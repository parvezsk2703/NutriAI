import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a clear indicator that JS reached this point
console.log("NutriAI Frontend Booting...");

// Global error listener to catch and display initialization crashes
window.addEventListener('error', (event) => {
  console.error('CRITICAL FRONTEND ERROR:', event.error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; color: #b91c1c; font-family: system-ui, sans-serif; text-align: center;">
        <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Application Crash</h1>
        <p style="background: #fee2e2; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.875rem; display: inline-block;">
          ${event.error?.message || 'Check browser console for details'}
        </p>
        <div style="margin-top: 2rem;">
          <button onclick="window.location.reload()" style="background: #1d4ed8; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; font-weight: 600; border: none; cursor: pointer;">
            Reload App
          </button>
        </div>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
