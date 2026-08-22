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
      const prompt = `Generate a unique quiz with ${count} distinct, non-repeating multiple-choice questions on the topic "${topic}" (Subject: ${subject}, Difficulty: ${difficulty}).
Ensure each question tests a different sub-concept or aspect of ${topic}.
Return strictly a valid JSON array of objects with no markdown formatting around it (do not wrap in \`\`\`json).
Each object must have the following schema:
{
  "id": number,
  "type": "multiple-choice",
  "question": "question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0 (randomized index 0, 1, 2, or 3),
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

    // Dynamic, Varied Fallback Quiz Generator
    const topicTemplates = [
      {
        question: (t: string) => `Which of the following best defines the primary core concept of ${t}?`,
        options: (t: string) => [
          `The fundamental mechanism driving ${t} system behaviors`,
          `An unrelated external variable in computational modeling`,
          `A obsolete historical hypothesis disproved in 1920`,
          `A specialized sub-field exclusively dealing with thermodynamics`,
        ],
        correct: 0,
        exp: (t: string) => `Understanding the fundamental mechanism of ${t} is essential for master-level comprehension.`,
      },
      {
        question: (t: string) => `In real-world applications, how is ${t} most commonly utilized?`,
        options: (t: string) => [
          `In theoretical physics experiments only`,
          `To optimize efficiency and solve practical problems related to ${t}`,
          `As a purely artistic form of notation`,
          `It has no practical modern applications`,
        ],
        correct: 1,
        exp: (t: string) => `${t} is widely applied across modern industries to increase operational efficiency and accuracy.`,
      },
      {
        question: (t: string) => `What key factor distinguishes ${t} from closely related concepts?`,
        options: (t: string) => [
          `It operates under constant atmospheric pressure`,
          `It relies on linear progression without variables`,
          `Its unique structural attributes and specialized methodology`,
          `It only applies to micro-scale cellular structures`,
        ],
        correct: 2,
        exp: (t: string) => `The unique structural and methodological attributes of ${t} define its distinct identity.`,
      },
      {
        question: (t: string) => `Which common misconception should be avoided when analyzing ${t}?`,
        options: (t: string) => [
          `Assuming ${t} operates in complete isolation without environmental interaction`,
          `Recognizing that ${t} involves complex interdependencies`,
          `Using quantitative metrics to measure ${t}`,
          `Studying the historical evolution of ${t}`,
        ],
        correct: 0,
        exp: (t: string) => `A frequent pitfall is ignoring how ${t} interacts with surrounding environmental factors.`,
      },
      {
        question: (t: string) => `Which pioneer or milestone is historically associated with breakthroughs in ${t}?`,
        options: (t: string) => [
          `Early 18th-century industrial revolution discoveries`,
          `Collaborative modern interdisciplinary research frameworks`,
          `Classical Greek philosophical logic and early experimentation`,
          `All of the above contributed to the evolution of ${t}`,
        ],
        correct: 3,
        exp: (t: string) => `The evolution of ${t} built upon centuries of discoveries ranging from antiquity to modern times.`,
      },
    ]

    // Shuffle and pick templates
    const shuffledTemplates = [...topicTemplates].sort(() => Math.random() - 0.5)
    const fallbackQuestions = shuffledTemplates.slice(0, count).map((tpl, i) => ({
      id: i + 1,
      type: "multiple-choice",
      question: tpl.question(topic),
      options: tpl.options(topic),
      correctAnswer: tpl.correct,
      explanation: tpl.exp(topic),
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
