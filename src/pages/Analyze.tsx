import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { geminiService } from '../services/gemini.service';
import { diaryService } from '../services/diary.service';
import { useAppStore } from '../store/appStore';
import { MealAnalysis } from '../types/nutrition.types';
import { motion, AnimatePresence } from 'motion/react';

export default function Analyze() {
  const { user } = useAppStore();
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !file) return;

    setLoading(true);
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const result = await geminiService.analyzeMeal(base64, file.type);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze meal. Please try again with a clearer photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = async () => {
    if (!analysis || !user) return;

    setSaving(true);
    try {
      await diaryService.addEntry(user.uid, new Date(), {
        name: analysis.items[0]?.name || 'Meal',
        quantity: analysis.items[0]?.quantity || '1 serving',
        food_name: analysis.items.map(i => i.name).join(', '),
        meal_type: analysis.meal_type,
        calories: analysis.totals.calories,
        protein_g: analysis.totals.protein_g,
        carbs_g: analysis.totals.carbs_g,
        fat_g: analysis.totals.fat_g,
        fiber_g: analysis.totals.fiber_g,
        source: 'ai_analysis'
      });
      alert("Meal saved to diary!");
      setImage(null);
      setAnalysis(null);
    } catch (err) {
      alert("Failed to save meal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="border-b border-slate-200 pb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Vision: Meal Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">Initialize visual recognition to quantify nutritional load.</p>
      </section>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-16 h-16 bg-white rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-105 transition-all">
              <Camera className="w-8 h-8" />
            </div>
            <p className="mt-6 text-sm font-bold text-slate-500">Capture or upload optical data</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Supported: JPEG, PNG · Limit: 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border border-slate-200">
              <img src={image} alt="Input source" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-slate-900/60 text-white px-3 py-1.5 rounded-md backdrop-blur-md hover:bg-slate-900/80 text-xs font-bold transition-colors"
              >
                Clear Buffer
              </button>
            </div>

            {!analysis && !loading && (
              <button 
                onClick={handleAnalyze}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Loader2 className={`w-4 h-4 animate-spin ${loading ? 'block' : 'hidden'}`} />
                Initiate AI Processing
              </button>
            )}

            {loading && (
              <div className="text-center py-12 space-y-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800">Processing Node: Gemini AI</p>
                  <p className="text-xs text-slate-400">Extracting macro-nutrient clusters from optical input...</p>
                </div>
                <div className="flex justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          capture="environment"
          className="hidden" 
        />

        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 border-t border-slate-200 pt-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <NutritionSmallCard label="Energy" value={`${analysis.totals.calories}`} unit="kcal" />
                <NutritionSmallCard label="Protein" value={`${analysis.totals.protein_g}g`} />
                <NutritionSmallCard label="Carbs" value={`${analysis.totals.carbs_g}g`} />
                <NutritionSmallCard label="Lipids" value={`${analysis.totals.fat_g}g`} />
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-blue-200 pb-4 md:pb-0 md:pr-6 shrink-0">
                  <div className="w-14 h-14 bg-blue-600 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-200">
                    {analysis.health_score}
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold text-sm tracking-tight leading-none">Integrity Score</p>
                    <p className="text-blue-600 text-[10px] uppercase font-bold mt-1 tracking-widest">AI Validated</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-blue-800 font-medium flex gap-2 items-start">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveToDiary}
                  disabled={saving}
                  className="px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Commit to Neural Diary
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NutritionSmallCard({ label, value, unit }: { label: string, value: string, unit?: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded border border-slate-200 text-center">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
      {unit && <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase">{unit}</p>}
    </div>
  );
}
