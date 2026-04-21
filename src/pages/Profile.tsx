import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '../store/appStore';
import { authService } from '../services/auth.service';
import { Save, Loader2, User as UserIcon } from 'lucide-react';
import { ACTIVITY_LEVELS, GOALS } from '../constants';
import { motion } from 'motion/react';

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(13).max(120),
  gender: z.enum(['male', 'female', 'other']),
  weight_kg: z.number().min(30).max(300),
  height_cm: z.number().min(100).max(250),
  goal: z.enum(['lose', 'maintain', 'gain']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active']),
  dietaryRestrictions: z.array(z.string()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, profile } = useAppStore();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName || user?.displayName || '',
      age: profile?.age || 30,
      gender: profile?.gender || 'male',
      weight_kg: profile?.weight_kg || 70,
      height_cm: profile?.height_cm || 170,
      goal: profile?.goal || 'maintain',
      activityLevel: profile?.activityLevel || 'moderate',
      dietaryRestrictions: profile?.dietaryRestrictions || [],
    }
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    try {
      // Basic TDEE Mifflin-St Jeor calculation
      const s = values.gender === 'male' ? 5 : -161;
      const bmr = 10 * values.weight_kg + 6.25 * values.height_cm - 5 * values.age + s;
      const factor = ACTIVITY_LEVELS.find(l => l.value === values.activityLevel)?.factor || 1.2;
      const adj = GOALS.find(g => g.value === values.goal)?.calorie_adj || 0;
      const tdee = Math.round(bmr * factor + adj);

      await authService.updateProfile(user.uid, {
        ...values,
        tdee_calories: tdee,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="flex items-center gap-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-200">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project Intake: User Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your physiological parameters for the nutrition engine.</p>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-full space-y-2">
            <Label>Internal ID / Display Name</Label>
            <Input {...register('displayName')} placeholder="Sarah Jenkins" />
            {errors.displayName && <ErrorText>{errors.displayName.message}</ErrorText>}
          </div>

          <div className="space-y-2">
            <Label>Biological Age</Label>
            <Input type="number" {...register('age', { valueAsNumber: true })} />
            {errors.age && <ErrorText>{errors.age.message}</ErrorText>}
          </div>

          <div className="space-y-2">
            <Label>Biometric Sex</Label>
            <Select {...register('gender')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mass Allocation (kg)</Label>
            <Input type="number" step="0.1" {...register('weight_kg', { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label>Vertical Scale (cm)</Label>
            <Input type="number" {...register('height_cm', { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label>Operational Activity Level</Label>
            <Select {...register('activityLevel')}>
              {ACTIVITY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Objective Function (Goal)</Label>
            <Select {...register('goal')}>
              {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </Select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {success ? "Parameters Synchronized" : "Initiate Synchronization"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{children}</label>;
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input 
    ref={ref} 
    {...props} 
    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-slate-900" 
  />
));

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => (
  <select 
    ref={ref} 
    {...props} 
    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all text-slate-900" 
  />
));

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{children}</p>;
}
