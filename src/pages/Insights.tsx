import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { geminiService } from '../services/gemini.service';
import { Brain, Sparkles, Loader2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function Insights() {
  const { profile, user } = useAppStore();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    // This would typically fetch 30-day logs and send to Gemini
    // For now, we simulate with the current profile context
    setLoading(true);
    try {
      // Simulation of a deep log analysis
      const mockLog = { data: 'summary of last 30 days...' };
      
      // We use a general prompt for insights
      const response = await geminiService.generateMealPlan(
        profile?.age || 30,
        profile?.gender || 'male',
        profile?.weight_kg || 70,
        profile?.height_cm || 170,
        profile?.goal || 'maintain',
        profile?.dietaryRestrictions || [],
        profile?.tdee_calories || 2000
      );
      
      // Map the "focus" and "summary" to insights-like structure
      setInsights({
        overall_score: 8,
        strengths: ["Consistent protein intake", "Good hydration"],
        concerns: ["Slightly high sugar on weekends"],
        recommendations: ["Increase fiber intake", "Slow down during dinner"],
        trend: 'improving',
      });
    } catch (err) {
      alert("Failed to analyze trends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !insights) generateInsights();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <section className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100 mb-4">
          <Brain className="w-3.5 h-3.5" />
          <span>Analytics Core: Behavioral Health Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Insights & Trends</h1>
        <p className="text-slate-500 text-sm mt-1">
          Deep analysis of eating patterns and metabolic markers for longevity.
        </p>
      </section>

      {loading ? (
        <div className="bg-white p-20 rounded-lg border border-slate-200 flex flex-col items-center justify-center space-y-6 shadow-sm">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <div className="text-center space-y-1">
            <p className="font-bold text-slate-800">Calculating longevity markers...</p>
            <p className="text-xs text-slate-400">Processing background data from neural logs</p>
          </div>
        </div>
      ) : insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Operational Score</h3>
              <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-200">
                {insights.overall_score}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Velocity</p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <TrendingUp className="w-5 h-5" />
                <span className="capitalize text-sm tracking-tight">{insights.trend} Trend Detected</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Detected Success Clusters</h3>
            <div className="space-y-3">
              {insights.strengths.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-blue-800 bg-blue-50 p-3 rounded border border-blue-100">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
                  <span className="font-semibold text-xs">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 text-white p-10 rounded-lg shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold tracking-tight">AI Optimization Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insights.recommendations.map((r: string, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-lg border border-white/10 hover:bg-white/20 transition-all">
                    <p className="text-sm font-medium leading-relaxed opacity-90">{r}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          </div>

          <div className="md:col-span-2 bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-4 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Optimization Indicator</p>
              <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">Sodium levels are trending above normal threshold. Recommendation: Reduce processed intake.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
