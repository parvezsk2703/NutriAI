export interface NutritionTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g?: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface MealAnalysis {
  items: FoodItem[];
  totals: NutritionTotals;
  vitamins?: {
    vitaminC_mg: number;
    vitaminD_iu: number;
    iron_mg: number;
    calcium_mg: number;
  };
  health_score: number;
  suggestions: string[];
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DiaryEntry extends FoodItem {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  fiber_g: number;
  time: Date;
  source: 'manual' | 'ai_analysis' | 'search' | 'barcode';
}

export interface DayLog {
  date: string;
  entries: DiaryEntry[];
  totals: NutritionTotals;
  water_ml: number;
  notes?: string;
  streak_day: number;
}

export interface MealPlanDay {
  day: string;
  breakfast: { name: string; calories: number; recipe_url?: string };
  lunch: { name: string; calories: number };
  dinner: { name: string; calories: number };
  snacks: { name: string; calories: number }[];
  totals: NutritionTotals;
}

export interface MealPlan {
  id: string;
  created_at: Date;
  status: 'active' | 'completed' | 'archived';
  days: MealPlanDay[];
  weekly_summary: {
    avg_calories: number;
    focus: string;
  };
}
