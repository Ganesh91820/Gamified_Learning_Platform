import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const { question, userMessage } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Current question details required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey })
      const prompt = `You are "AI Study Buddy", an encouraging, friendly AI tutor for students.
The student is currently answering this quiz question:
Question: "${question.question}"
Options: ${JSON.stringify(question.options || [])}
Subject: "${question.subject}"

The student asks: "${userMessage || "Can you give me a hint?"}"

Provide a short, helpful, encouraging response (max 3 sentences). Give a gentle hint or explain the concept simply WITHOUT revealing the exact correct answer directly.`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })

      return NextResponse.json({ reply: response.text || "You've got this! Think about the core principle of this topic." })
    }

    // Smart fallback if API key is not set
    let reply = `Great question! Here's a tip for "${question.subject}": eliminate the options that don't match the main topic!`
    if (userMessage?.toLowerCase().includes("hint")) {
      reply = `Hint: Focus on what the question is asking about "${question.question.slice(0, 30)}..."!`
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("AI Tutor Chat Error:", error)
    return NextResponse.json({ reply: "I'm here to help! Take your time and read the options carefully." })
  }
}
