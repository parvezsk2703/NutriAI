# NutriAI 🥗

AI-powered nutrition tracking and planning application using Gemini.

## Features
- **AI Vision Analysis**: Snap food photos to get instant nutritional data.
- **7-Day Meal Matrix**: Personalized meal plans based on your metrics.
- **Behavioral Insights**: Pattern recognition for healthier eating habits.
- **Secure Logs**: Track your journey with Firestore.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **Backend**: Node.js (Express) with Vite middleware.
- **AI**: Google Gemini Pro & Flash via `@google/genai`.
- **Database**: Firebase Firestore & Auth.

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd nutriai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_key_here
   # Firebase configuration will be picked up from firebase-applet-config.json
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Cloud Run Deployment

To deploy this to Cloud Run using a GitHub repository:
1. Push this code to your GitHub repository.
2. In the [Google Cloud Console](https://console.cloud.google.com/), go to **Cloud Run**.
3. Click **Create Service**.
4. Select **Continuously deploy from a repository**.
5. Connect your GitHub account and select this repository.
6. **Important Configuration**:
   - **Port**: 3000
   - **Environment Variables**: Make sure to add `GEMINI_API_KEY` in the Cloud Run service settings.
   - **Build Type**: Use "Google Cloud's buildpacks" or provide a Dockerfile.
