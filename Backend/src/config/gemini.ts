import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export const geminiModel = genAI.getGenerativeModel({
  model: modelName,
});

export { genAI };

