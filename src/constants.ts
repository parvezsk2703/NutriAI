/**
 * NutriAI Constants
 */

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (Little/no exercise)', factor: 1.2 },
  { value: 'light', label: 'Light (Exercise 1-3 days/week)', factor: 1.375 },
  { value: 'moderate', label: 'Moderate (Exercise 3-5 days/week)', factor: 1.55 },
  { value: 'active', label: 'Active (Exercise 6-7 days/week)', factor: 1.725 },
] as const;

export const GOALS = [
  { value: 'lose', label: 'Lose Weight', calorie_adj: -500 },
  { value: 'maintain', label: 'Maintain Weight', calorie_adj: 0 },
  { value: 'gain', label: 'Gain Weight', calorie_adj: 500 },
] as const;

export const PROMPTS = {
  MEAL_ANALYSIS: `You are a professional nutritionist. Analyze this meal and return ONLY valid JSON with no markdown:
{
  "items": [{"name": "string", "quantity": "string", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}],
  "totals": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fiber_g": 0, "sugar_g": 0},
  "vitamins": {"vitaminC_mg": 0, "vitaminD_iu": 0, "iron_mg": 0, "calcium_mg": 0},
  "health_score": 0,
  "suggestions": ["string"],
  "meal_type": "breakfast"
}`,
  MEAL_PLAN: (age: number, gender: string, weight: number, height: number, goal: string, restrictions: string[], tdee: number) => 
    `Create a personalized 7-day meal plan for: age=${age}, gender=${gender}, weight=${weight}kg, height=${height}cm, goal=${goal}, restrictions=${restrictions.join(', ')}, daily_calories=${tdee}. Return ONLY valid JSON:
{
  "days": [{
    "day": "string",
    "breakfast": {"name": "string", "calories": 0, "recipe_url": "optional_string"},
    "lunch": {"name": "string", "calories": 0},
    "dinner": {"name": "string", "calories": 0},
    "snacks": [{"name": "string", "calories": 0}],
    "totals": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
  }],
  "weekly_summary": {"avg_calories": 0, "focus": "string"}
}`
};
