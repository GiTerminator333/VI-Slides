import { Response } from "express";
import { geminiModel } from "../config/gemini";
import { AuthRequest } from "../middleware/auth.middleware";

export const generateAIAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { question, context } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "A valid question is required." });
    }

    const trimmedQuestion = question.trim();
    const contextNote = context ? `Context / Class topic: ${context}\n` : "";

    const promptText = `
You are an expert AI teaching assistant for a real-time virtual classroom named Vi-Slides.
Your goal is to provide a clear, concise, well-structured, and helpful answer to the student's or teacher's question.

${contextNote}
Question:
${trimmedQuestion}

Format Guidelines:
- Structure your answer cleanly using standard GitHub-flavored Markdown.
- Use a concise "## Overview" or direct title to summarize the answer.
- Use bullet points, bold key terms, and numbered steps where appropriate.
- If code is relevant, use fenced code blocks with the appropriate language tag (e.g. \`\`\`python, \`\`\`javascript).
- Keep the explanation directly focused on answering the question without unnecessary fluff.
`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("AI generation timed out after 15 seconds")),
        15000
      )
    );

    const generatePromise = geminiModel.generateContent(promptText);

    const result: any = await Promise.race([generatePromise, timeoutPromise]);
    const answer = result.response.text();

    res.json({ answer });
  } catch (err: any) {
    console.error("Gemini AI error:", err);
    let message = err?.message || "Failed to generate AI response";
    if (err?.status === 503 || message.includes("503") || message.includes("high demand")) {
      message = "Google Gemini is temporarily experiencing high traffic spikes. Please try again in a few seconds.";
    }
    res.status(500).json({
      error: "AI failed to generate response.",
      details: message,
    });
  }
};

