import { GoogleGenAI } from "@google/genai";
import { PROMPTS } from "../constants";
import { MealAnalysis, MealPlan } from "../types/nutrition.types";

// Helper to safely get the API key
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Lazy initialize AI to prevent crash if key is missing during boot
let genAI: any = null;
const getAI = () => {
  if (!genAI) {
    const key = getApiKey();
    if (!key) {
      console.warn("GEMINI_API_KEY is missing. AI features will be limited.");
      return null;
    }
    genAI = new GoogleGenAI(key);
  }
  return genAI;
};

export const geminiService = {
  /**
   * Analyzes an image of a meal to extract nutritional information.
   */
  async analyzeMeal(base64Image: string, mimeType: string): Promise<MealAnalysis> {
    try {
      const ai = getAI();
      if (!ai) throw new Error("AI service not configured. Please add VITE_GEMINI_API_KEY to your environment variables.");

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent([
        PROMPTS.MEAL_ANALYSIS,
        {
          inlineData: {
            data: base64Image,
            mimeType
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Clean up potential markdown formatting from AI response
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.error("Meal analysis failed:", error);
      throw error;
    }
  },

  /**
   * Generates a 7-day meal plan based on user profile.
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
      const ai = getAI();
      if (!ai) throw new Error("AI service not configured.");

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = PROMPTS.MEAL_PLAN(age, gender, weight, height, goal, restrictions, tdee);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      return {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date(),
        status: 'active'
      };
    } catch (error: any) {
      console.error("Meal planning failed:", error);
      throw error;
    }
  }
};
