import { GoogleGenAI } from "@google/genai";

export function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export const AI_MODEL = "gemini-2.5-flash";
export const MAX_AI_INPUT_CHARS = 6000;
