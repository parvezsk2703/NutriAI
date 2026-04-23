import { PROMPTS } from "../constants";
import { MealAnalysis, MealPlan } from "../types/nutrition.types";
import axios from 'axios';

export const geminiService = {
  /**
   * Analyzes an image of a meal to extract nutritional information via server proxy.
   */
  async analyzeMeal(base64Image: string, mimeType: string): Promise<MealAnalysis> {
    try {
      const response = await axios.post('/api/ai/analyze', {
        image: base64Image,
        mimeType,
        prompt: PROMPTS.MEAL_ANALYSIS
      });

      const text = response.data.text;
      if (!text) throw new Error("No response from AI service");
      
      // Clean up potential markdown formatting from AI response
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Meal analysis failed:", error);
      throw error;
    }
  },

  /**
   * Generates a 7-day meal plan based on user profile via server proxy.
   */
  async generateMealPlan(
    age: number,
    gender: string,
    weight: number,
    height: number,
    goal: string,
    restrictions: string[],
    tdee: number
  ): Promise<MealPlan> {
    try {
      const prompt = PROMPTS.MEAL_PLAN(age, gender, weight, height, goal, restrictions, tdee);
      const response = await axios.post('/api/ai/plan', { prompt });

      const text = response.data.text;
      if (!text) throw new Error("No response from AI service");
      
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      return {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date(),
        status: 'active'
      };
    } catch (error) {
      console.error("Meal planning failed:", error);
      throw error;
    }
  }
};
