export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  age: number;
  gender: Gender;
  weight_kg: number;
  height_cm: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryRestrictions: string[];
  tdee_calories: number;
  created_at: Date;
  updated_at: Date;
}
