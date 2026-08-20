import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const { topic, subject = "General", difficulty = "medium", count = 4 } = await req.json()

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic string is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey })
      const prompt = `Generate a quiz with ${count} multiple-choice questions on the topic "${topic}" (Subject: ${subject}, Difficulty: ${difficulty}).
Return strictly a valid JSON array of objects with no markdown formatting around it (do not wrap in \`\`\`json).
Each object must have the following schema:
{
  "id": number,
  "type": "multiple-choice",
  "question": "question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0 (index 0, 1, 2, or 3),
  "explanation": "Clear step-by-step educational explanation of why this answer is correct",
  "difficulty": "${difficulty}",
  "subject": "${subject}",
  "points": 15
}`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })

      const rawText = response.text || ""
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim()
      const questions = JSON.parse(cleanJson)

      return NextResponse.json({ questions, source: "gemini-ai" })
    }

    // Smart Fallback Generator if GEMINI_API_KEY is not set yet
    const fallbackQuestions = Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      type: "multiple-choice",
      question: `[AI Topic: ${topic}] Question ${i + 1}: What is a fundamental concept regarding ${topic}?`,
      options: [
        `Key principle of ${topic}`,
        `Alternative theory of ${topic}`,
        `Historical aspect of ${topic}`,
        `Modern application of ${topic}`,
      ],
      correctAnswer: 0,
      explanation: `Option A represents the primary foundational principle of ${topic} for grade-level understanding.`,
      difficulty,
      subject,
      points: 15,
    }))

    return NextResponse.json({ questions: fallbackQuestions, source: "fallback-ai" })
  } catch (error: any) {
    console.error("AI Quiz Generation Error:", error)
    return NextResponse.json(
      { error: "Failed to generate AI quiz", details: error.message },
      { status: 500 }
    )
  }
}
