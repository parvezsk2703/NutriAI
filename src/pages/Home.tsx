import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Heart,
  Brain
} from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAppStore } from '../store/appStore';
import { motion } from 'motion/react';

export default function Home() {
  const { user, isSigningIn } = useAppStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleStart = async () => {
    if (isSigningIn) return;
    
    if (user) {
      navigate('/dashboard');
      return;
    }

    try {
      const loggedInUser = await authService.login();
      if (loggedInUser) {
        // We wait a tiny bit to let the global store catch the login state
        console.log("Login successful, preparing to redirect...");
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (error) {
      console.log("Login flow was interrupted or failed.");
    }
  };

  return (
    <div className="space-y-32 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Operational Alpha: Intelligent Nutrition Engine</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-slate-800 leading-[1.05] tracking-tight">
          Quantified Nutrition. <br />
          <span className="text-blue-600">Enhanced Longevity.</span>
        </h1>
        
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          NutriAI utilizes advanced Gemini neural processing to analyze dietary input, 
          optimize meal structures, and deliver behavioral health insights for the human machine.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button 
            onClick={handleStart}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-md text-sm font-semibold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Initialize Environment <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/tech_user${i}/100/100`} 
                alt="System Operator"
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm grayscale hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold shadow-sm">
              +1.2k
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        <FeatureCard 
          icon={<Camera className="w-6 h-6 text-blue-600" />}
          title="Optical Analysis"
          description="Multimodal neural networks extract macro-nutrient clusters from standard visual inputs."
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="Predictive Planning"
          description="Biometric-aware simulations generate optimized 7-day nutritional protocols."
        />
        <FeatureCard 
          icon={<Brain className="w-6 h-6 text-blue-600" />}
          title="Behavioral Insights"
          description="Identify high-variance eating patterns and execute corrective health actions."
        />
      </section>

      {/* Social Proof Section */}
      <section className="bg-white rounded-lg p-12 md:p-20 border border-slate-200 shadow-sm relative overflow-hidden text-center space-y-12">
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Evidence-Based Performance
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl mx-auto">
              Join a global network of high-performance individuals optimizing their biological substrate 
              through NutriAI's data-driven frameworks.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6">
            <Stat label="Recog. Accuracy" value="98.2%" />
            <Stat label="Data Points" value="50M+" />
            <Stat label="Neural Nodes" value="1.2k" />
            <Stat label="SLA Uptime" value="99.9%" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/30 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 rounded-lg p-12 md:p-20 text-white text-center space-y-8 shadow-2xl shadow-slate-200 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Optimization Sequence Ready.</h2>
          <p className="text-slate-400 font-medium text-sm max-w-xl mx-auto">
            Commit to a data-first approach to wellness. Initialize your personal nutrition engine today.
          </p>
          <button 
            onClick={handleStart}
            className="bg-blue-600 text-white px-10 py-3.5 rounded-md font-bold text-sm hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Execute Initialization
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6 group transition-all hover:border-blue-300"
    >
      <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
    </div>
  );
}
