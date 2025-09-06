import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function googleGenAi(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  // Raw Gemini output (may contain ```json ... ```)
  let text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Remove code fences (```json ... ```)
  try {
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim(); 
  } catch (error) {
    console.error("❌ Gemini parsing error:", error.message);
    
  }
  return text;
}
export default googleGenAi;