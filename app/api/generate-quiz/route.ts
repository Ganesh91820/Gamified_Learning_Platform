import { NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"
import { z } from "zod"

// Zod Schema for strict server-side validation
const SingleQuestionSchema = z.object({
  question: z.string().min(12, "Question text must be at least 12 characters"),
  options: z
    .array(z.string().min(1, "Option text cannot be empty"))
    .length(4, "Question must have exactly 4 options"),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(20, "Explanation must be at least 20 characters"),
  difficulty: z.string().optional().default("medium"),
})

const QuizResponseSchema = z.object({
  questions: z.array(SingleQuestionSchema),
})

// Helper to shuffle options server-side and update correctAnswer index
function shuffleOptionsServerSide(questionObj: z.infer<typeof SingleQuestionSchema>, id: number, subject: string) {
  const originalCorrectText = questionObj.options[questionObj.correctAnswer]
  
  // Create indexed options array and shuffle
  const indexedOptions = questionObj.options.map((text, idx) => ({ text, isCorrect: idx === questionObj.correctAnswer }))
  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]]
  }

  const shuffledOptions = indexedOptions.map((item) => item.text)
  const newCorrectIndex = indexedOptions.findIndex((item) => item.isCorrect)

  return {
    id,
    type: "multiple-choice" as const,
    question: questionObj.question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex,
    explanation: questionObj.explanation,
    difficulty: questionObj.difficulty || "medium",
    subject,
    points: 15,
  }
}

export async function POST(req: Request) {
  try {
    const {
      topic,
      subject = "General",
      difficulty = "medium",
      count = 5,
      gradeLevel = "Middle school (11–14)",
      learningGoal = "",
      seenQuestions = [],
    } = await req.json()

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "Topic string is required" }, { status: 400 })
    }

    const requestedCount = Number(count) || 5
    const apiKey = process.env.GEMINI_API_KEY

    // Remove generic fallback generator: return 503 if API key missing
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Gemini API Key is missing. Please configure GEMINI_API_KEY in your environment to generate AI quizzes.",
        },
        { status: 503 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const excludePrompt =
      seenQuestions.length > 0
        ? `CRITICAL EXCLUSION: Do NOT generate questions similar to any of these previously seen question prompts: ${JSON.stringify(
            seenQuestions.slice(-10)
          )}.`
        : ""

    const goalPrompt = learningGoal.trim()
      ? `PRIMARY LEARNING GOAL: The questions MUST directly test and reinforce this specific learning objective: "${learningGoal.trim()}".`
      : ""

    const prompt = `You are an expert curriculum designer and educator.
Generate a high-quality, pedagogically sound quiz with EXACTLY ${requestedCount} multiple-choice questions on the topic "${topic.trim()}".

CONTEXT & METADATA:
- Target Learner Level: ${gradeLevel}
- Subject: ${subject}
- Target Difficulty: ${difficulty}
- ${goalPrompt}
- ${excludePrompt}

STRICT QUALITY RULES:
1. Every question MUST have exactly FOUR distinct options.
2. Every question MUST have EXACTLY ONE unambiguous, factually correct answer.
3. Include clear, step-by-step educational explanations explaining WHY the correct option is right.
4. Vary the sub-concepts tested; mix recall, conceptual understanding, and practical application.
5. DISALLOWED: Trick questions, "all of the above", "none of the above", duplicate questions, duplicate options, vague wording, or unsupported claims.
6. Check internal factual accuracy and curriculum alignment before outputting.

Return strictly a JSON object matching the required schema.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswer", "explanation", "difficulty"],
              },
            },
          },
          required: ["questions"],
        },
      },
    })

    const rawText = response.text || ""
    let parsedData: any

    try {
      parsedData = JSON.parse(rawText)
    } catch (parseErr) {
      console.error("JSON Parsing Error from Gemini output:", rawText)
      return NextResponse.json(
        { error: "AI generated invalid response format. Please try again." },
        { status: 502 }
      )
    }

    // Zod Schema Validation
    const validationResult = QuizResponseSchema.safeParse(parsedData)
    if (!validationResult.success) {
      console.error("Zod Validation Failed:", validationResult.error.flatten())
      return NextResponse.json(
        {
          error: "Generated quiz failed quality validation rules.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const rawQuestions = validationResult.data.questions

    // Validate Question Count
    if (rawQuestions.length !== requestedCount) {
      console.warn(`Requested ${requestedCount} questions, but Gemini returned ${rawQuestions.length}`)
      if (rawQuestions.length < requestedCount) {
        return NextResponse.json(
          { error: `AI generated ${rawQuestions.length} questions instead of the requested ${requestedCount}. Please try again.` },
          { status: 422 }
        )
      }
    }

    // Check for duplicate questions or options within any question
    const questionTexts = new Set<string>()
    for (const q of rawQuestions) {
      const trimmedQ = q.question.trim().toLowerCase()
      if (questionTexts.has(trimmedQ)) {
        return NextResponse.json(
          { error: "AI response contained duplicate questions. Retrying recommended." },
          { status: 422 }
        )
      }
      questionTexts.add(trimmedQ)

      const uniqueOptions = new Set(q.options.map((opt) => opt.trim().toLowerCase()))
      if (uniqueOptions.size !== 4) {
        return NextResponse.json(
          { error: "A question contained duplicate answer choices. Retrying recommended." },
          { status: 422 }
        )
      }
    }

    // Shuffle options server-side and update correctAnswer index
    const processedQuestions = rawQuestions.slice(0, requestedCount).map((q, idx) =>
      shuffleOptionsServerSide(q, Date.now() + idx, subject)
    )

    return NextResponse.json({ questions: processedQuestions, source: "gemini-ai-structured" })
  } catch (error: any) {
    console.error("AI Quiz Generation Error:", error)
    return NextResponse.json(
      { error: "Failed to generate AI quiz", details: error.message },
      { status: 500 }
    )
  }
}
