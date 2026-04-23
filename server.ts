import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function startServer() {
  console.log('--- NutriAI Server Starting ---');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const app = express();
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'NutriAI API' });
  });

  // Gemini Proxy Routes
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { image, mimeType, prompt } = req.body;
      if (!image || !mimeType) return res.status(400).json({ error: "Missing image data" });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: image,
            mimeType
          }
        }
      ]);
      
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Server API Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/ai/plan', async (req, res) => {
    try {
      const { prompt } = req.body;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Server API Planning Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite dev server middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware ready.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Server listening on 0.0.0.0:${PORT}`);
    console.log(`>>> Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
