
import { GoogleGenAI } from "@google/genai";
import { Product, Sale } from "../types";

// Initialize the Google GenAI client with the API key from environment variables.
// Always use the named parameter `apiKey`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIReportSummary = async (products: Product[], sales: Sale[]) => {
  const prompt = `
    You are an expert agricultural business analyst for Olatunbosun Agro Stock Manager.
    Based on the following data, provide a concise (2-3 paragraph) executive summary of business health,
    identifying any risks (like low stock) and performance highlights.

    Stock Inventory: ${JSON.stringify(products)}
    Recent Sales: ${JSON.stringify(sales)}

    Focus on:
    1. Critical stock levels.
    2. Revenue trends.
    3. Strategic recommendations for the store manager.
  `;

  try {
    // Generate content using the specified model. 
    // gemini-3-flash-preview is suitable for basic text tasks like summarization.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The .text property directly returns the generated string.
    return response.text || "Unable to generate AI summary at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Intelligence services are currently offline. Please check back later.";
  }
};
