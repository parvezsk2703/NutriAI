import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { geminiService } from '../services/gemini.service';
import { MealPlan } from '../types/nutrition.types';
import { Calendar, Sparkles, Loader2, RefreshCcw, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';

export default function Planner() {
  const { profile } = useAppStore();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const newPlan = await geminiService.generateMealPlan(
        profile.age,
        profile.gender,
        profile.weight_kg,
        profile.height_cm,
        profile.goal,
        profile.dietaryRestrictions,
        profile.tdee_calories
      );
      setPlan(newPlan);
    } catch (err) {
      alert("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Deployment Phase: 7-Day Protocol</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Personalized Nutri-Matrix</h1>
          <p className="text-slate-500 text-sm mt-1">
            Algorithmic meal distribution optimized for your physiological targets.
          </p>
        </div>
        {plan && (
          <button 
            onClick={generatePlan}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Reset Simulation
          </button>
        )}
      </section>

      {!plan ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-200 text-center space-y-8">
          <div className="w-16 h-16 bg-slate-50 rounded border border-slate-200 flex items-center justify-center text-slate-300 mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">No Active Protocol</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">Initialize the generator to craft a science-backed weekly nutrient plan.</p>
          </div>
          <button 
            onClick={generatePlan}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Initiate 7-Day Matrix
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-800 text-white p-6 rounded-lg shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Objective Focus</p>
                <p className="text-xl font-bold">{plan.weekly_summary.focus}</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center backdrop-blur-md border border-white/10">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          </div>

          <div className="space-y-4">
            {plan.days.map((day, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">{day.day}</p>
                  <p className="text-[10px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded border border-blue-100 uppercase">
                    {day.totals.calories} kcal
                  </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MealSlot label="Phase 01: Morning" name={day.breakfast.name} kcal={day.breakfast.calories} />
                  <MealSlot label="Phase 02: Mid-Day" name={day.lunch.name} kcal={day.lunch.calories} />
                  <MealSlot label="Phase 03: Evening" name={day.dinner.name} kcal={day.dinner.calories} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MealSlot({ label, name, kcal }: { label: string, name: string, kcal: number }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="font-bold text-slate-800 text-sm leading-tight">{name}</p>
      <p className="text-[11px] font-medium text-slate-500 mt-1">{kcal} kcal</p>
    </div>
  );
}
