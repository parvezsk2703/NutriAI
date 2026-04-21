import { GoogleGenAI, Type } from "@google/genai";
import { PROMPTS } from "../constants";
import { MealAnalysis, MealPlan } from "../types/nutrition.types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  /**
   * Analyzes an image of a meal to extract nutritional information.
   */
  async analyzeMeal(base64Image: string, mimeType: string): Promise<MealAnalysis> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: PROMPTS.MEAL_ANALYSIS },
              { inlineData: { data: base64Image, mimeType } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      if (!response.text) throw new Error("No response from Gemini");
      return JSON.parse(response.text.trim());
    } catch (error) {
      console.error("Gemini meal analysis failed:", error);
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
      const prompt = PROMPTS.MEAL_PLAN(age, gender, weight, height, goal, restrictions, tdee);
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      if (!response.text) throw new Error("No response from Gemini");
      const data = JSON.parse(response.text.trim());
      return {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date(),
        status: 'active'
      };
    } catch (error) {
      console.error("Gemini meal planning failed:", error);
      throw error;
    }
  }
};
