import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { diaryService } from '../services/diary.service';
import { DayLog } from '../types/nutrition.types';
import { 
  TrendingUp, 
  Droplets, 
  Flame, 
  Trophy,
  History,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, profile } = useAppStore();
  const [log, setLog] = useState<DayLog | null>(null);

  useEffect(() => {
    if (user) {
      diaryService.getDailyLog(user.uid, new Date()).then(setLog);
    }
  }, [user]);

  const caloriesGoal = profile?.tdee_calories || 2000;
  const caloriesPercent = log ? Math.min((log.totals.calories / caloriesGoal) * 100, 100) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <section className="border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Hello, {profile?.displayName?.split(' ')[0] || 'Health Seeker'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Daily overview of your nutritional performance metrics.</p>
      </section>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring Card */}
        <motion.div 
          className="lg:col-span-1 bg-white p-8 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-6"
        >
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="80"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <motion.circle
                cx="88"
                cy="88"
                r="80"
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="8"
                strokeDasharray={502.65}
                initial={{ strokeDashoffset: 502.65 }}
                animate={{ strokeDashoffset: 502.65 - (502.65 * caloriesPercent) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 leading-none">
                {log?.totals.calories || 0}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                kcal consumed
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Target</p>
            </div>
            <p className="text-sm font-semibold text-slate-700">{caloriesGoal} kcal</p>
          </div>
        </motion.div>

        {/* Macro & Secondary Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard 
              icon={<TrendingUp className="text-blue-600" />} 
              label="Protein" 
              value={`${log?.totals.protein_g || 0}g`} 
              subValue="Goal: 150g"
              progress={log ? (log.totals.protein_g / 150) * 100 : 0}
            />
            <StatCard 
              icon={<Flame className="text-slate-600" />} 
              label="Fat" 
              value={`${log?.totals.fat_g || 0}g`} 
              subValue="Goal: 65g"
              progress={log ? (log.totals.fat_g / 65) * 100 : 0}
            />
            <StatCard 
              icon={<History className="text-blue-500" />} 
              label="Carbs" 
              value={`${log?.totals.carbs_g || 0}g`} 
              subValue="Goal: 200g"
              progress={log ? (log.totals.carbs_g / 200) * 100 : 0}
            />
            <StatCard 
              icon={<Droplets className="text-blue-400" />} 
              label="Water" 
              value={`${log?.water_ml || 0}ml`} 
              subValue="Goal: 2500ml"
              progress={log ? (log.water_ml / 2500) * 100 : 0}
            />
          </div>

          <div className="bg-blue-900 rounded-lg p-6 text-white flex items-center justify-between shadow-lg shadow-blue-200 overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase mb-1 opacity-60 tracking-widest">System Status</p>
              <h3 className="text-lg font-bold">Nutritional Streak: {log?.streak_day || 0} Days</h3>
              <p className="text-blue-100 text-xs opacity-80 mt-1">Operational: Peak metabolism efficiency detected.</p>
            </div>
            <Trophy className="w-16 h-16 text-white absolute -right-2 -bottom-2 opacity-10 transform -rotate-12" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h2>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors">
            View Log <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {log?.entries.length ? log.entries.slice(0, 3).map((entry) => (
            <motion.div 
              key={entry.id}
              className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{entry.food_name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{entry.meal_type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{entry.calories} kcal</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">P: {entry.protein_g}g · C: {entry.carbs_g}g</p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full bg-white p-12 rounded-lg border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
              <p className="text-slate-400 text-sm font-medium">Internal engine idle. Log a meal to initiate tracking.</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Manual Intake</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, progress }: { icon: React.ReactNode, label: string, value: string, subValue: string, progress: number }) {
  return (
    <motion.div 
      className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5">{subValue}</p>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1 }}
          className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
        />
      </div>
    </motion.div>
  );
}

function UtensilsIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l4 4-4 4" />
    </svg>
  );
}
