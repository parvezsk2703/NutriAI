import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { authService } from './services/auth.service';
import { useAppStore } from './store/appStore';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Planner = lazy(() => import('./pages/Planner'));
const Insights = lazy(() => import('./pages/Insights'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const { user, loading } = useAppStore();

  useEffect(() => {
    const unsub = authService.init();
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[100]">
        <div className="w-20 h-20 bg-green-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-green-200 animate-bounce mb-8">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
        <p className="text-xl font-black text-gray-900 tracking-tight animate-pulse">Initializing NutriAI...</p>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/planner" 
              element={user ? <Planner /> : <Navigate to="/" />} 
            />
            <Route 
              path="/insights" 
              element={user ? <Insights /> : <Navigate to="/" />} 
            />
            <Route 
              path="/analyze" 
              element={user ? <Analyze /> : <Navigate to="/" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/" />} 
            />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
    </div>
  );
}

export default App;
