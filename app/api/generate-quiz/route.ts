import { NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"
import { z } from "zod"

// Zod Schema for strict server-side validation
const SingleQuestionSchema = z.object({
  question: z.string().min(8, "Question text must be at least 8 characters"),
  options: z
    .array(z.string().min(1, "Option text cannot be empty"))
    .length(4, "Question must have exactly 4 options"),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  difficulty: z.string().optional().default("medium"),
})

const QuizResponseSchema = z.object({
  questions: z.array(SingleQuestionSchema),
})

// Helper to shuffle options server-side and update correctAnswer index
function shuffleOptionsServerSide(questionObj: z.infer<typeof SingleQuestionSchema>, id: number, subject: string) {
  const originalCorrectIndex = Math.min(3, Math.max(0, questionObj.correctAnswer))
  
  // Create indexed options array and shuffle
  const indexedOptions = questionObj.options.map((text, idx) => ({ text, isCorrect: idx === originalCorrectIndex }))
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
    correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    explanation: questionObj.explanation,
    difficulty: questionObj.difficulty || "medium",
    subject,
    points: 15,
  }
}

// Fallback topic generator if API Key is missing or rate-limited
function generateSmartFallback(topic: string, subject: string, difficulty: string, count: number) {
  const cleanTopic = topic.trim()
  const fallbackTemplates = [
    {
      q: `Which of the following best describes the primary characteristic of ${cleanTopic}?`,
      opts: [
        `The fundamental core mechanics and principles of ${cleanTopic}`,
        `An irrelevant secondary variable in external systems`,
        `A historical hypothesis disproved in early experimentation`,
        `A specialized thermal constant with limited scope`,
      ],
      c: 0,
      exp: `The core mechanics of ${cleanTopic} represent its foundational defining characteristic.`,
    },
    {
      q: `In practical applications, how is ${cleanTopic} most effectively utilized?`,
      opts: [
        `Exclusively in laboratory test environments`,
        `To optimize systemic efficiency and solve real-world problems in ${cleanTopic}`,
        `As a purely theoretical mathematical convention`,
        `It has no practical modern applications`,
      ],
      c: 1,
      exp: `${cleanTopic} is applied across modern domains to enhance operational precision.`,
    },
    {
      q: `What key feature distinguishes ${cleanTopic} from related topics?`,
      opts: [
        `Static atmospheric pressure requirements`,
        `Non-adaptive linear progression`,
        `Its unique structural properties and specialized methodologies`,
        `Exclusively micro-scale molecular requirements`,
      ],
      c: 2,
      exp: `The unique methodology of ${cleanTopic} separates it from adjacent subjects.`,
    },
    {
      q: `Which common pitfall should be avoided when analyzing ${cleanTopic}?`,
      opts: [
        `Assuming ${cleanTopic} operates in total isolation without external factors`,
        `Recognizing that ${cleanTopic} involves interconnected factors`,
        `Using quantitative metrics to measure ${cleanTopic}`,
        `Reviewing historic advancements in ${cleanTopic}`,
      ],
      c: 0,
      exp: `A frequent misconception is assuming ${cleanTopic} functions independently of environmental influences.`,
    },
    {
      q: `Which milestone contributed significantly to modern understanding of ${cleanTopic}?`,
      opts: [
        `Industrial Revolution technological discoveries`,
        `Modern collaborative interdisciplinary research`,
        `Classical systematic observation and experimentation`,
        `A synthesis of historic research and contemporary experimentation`,
      ],
      c: 3,
      exp: `Current understanding of ${cleanTopic} is built upon centuries of ongoing research.`,
    },
    {
      q: `When assessing ${cleanTopic}, which indicator demonstrates optimal outcomes?`,
      opts: [
        `High consistency, accuracy, and robust stability in ${cleanTopic}`,
        `Fluctuating measurements without baseline control`,
        `Complete elimination of input variables`,
        `Disregarding empirical verification data`,
      ],
      c: 0,
      exp: `Optimal outcomes in ${cleanTopic} are marked by consistent accuracy and structural stability.`,
    },
  ]

  const shuffled = [...fallbackTemplates].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((tpl, i) => ({
    id: Date.now() + i,
    type: "multiple-choice" as const,
    question: tpl.q,
    options: tpl.opts,
    correctAnswer: tpl.c,
    explanation: tpl.exp,
    difficulty,
    subject,
    points: 15,
  }))
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

    // Sanitize optional learning goal (ignore "..." or empty inputs)
    const cleanGoal = learningGoal.replace(/[\.\s]+/g, "").length >= 3 ? learningGoal.trim() : ""

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey })

        const excludePrompt =
          seenQuestions.length > 0
            ? `Do NOT generate questions similar to these previously asked prompts: ${JSON.stringify(seenQuestions.slice(-10))}.`
            : ""

        const goalPrompt = cleanGoal
          ? `PRIMARY LEARNING GOAL: The questions MUST directly test: "${cleanGoal}".`
          : ""

        const prompt = `You are an expert educator. Generate a high-quality quiz with EXACTLY ${requestedCount} multiple-choice questions on the topic "${topic.trim()}".

CONTEXT & METADATA:
- Target Learner Level: ${gradeLevel}
- Subject: ${subject}
- Target Difficulty: ${difficulty}
${goalPrompt ? `- ${goalPrompt}` : ""}
${excludePrompt ? `- ${excludePrompt}` : ""}

STRICT QUALITY RULES:
1. Every question MUST have exactly FOUR distinct options.
2. Every question MUST have EXACTLY ONE unambiguous, factually correct answer.
3. Include clear educational explanations explaining WHY the correct option is right.
4. Vary the sub-concepts tested; mix recall, understanding, and application.
5. DISALLOWED: Trick questions, "all of the above", "none of the above", duplicate questions, or vague wording.

Return strictly a JSON object with schema: { "questions": [ { "question": "string", "options": ["str", "str", "str", "str"], "correctAnswer": 0, "explanation": "string", "difficulty": "${difficulty}" } ] }.`

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
        const parsedData = JSON.parse(rawText)

        // Zod Validation
        const validationResult = QuizResponseSchema.safeParse(parsedData)
        if (validationResult.success && validationResult.data.questions.length > 0) {
          const rawQuestions = validationResult.data.questions
          const processedQuestions = rawQuestions.slice(0, requestedCount).map((q, idx) =>
            shuffleOptionsServerSide(q, Date.now() + idx, subject)
          )
          return NextResponse.json({ questions: processedQuestions, source: "gemini-ai-structured" })
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API call failed, falling back to smart topic generator:", geminiErr.message)
      }
    }

    // Fallback if API key missing or API rate-limited
    const fallbackQuestions = generateSmartFallback(topic, subject, difficulty, requestedCount)
    return NextResponse.json({ questions: fallbackQuestions, source: "smart-fallback" })
  } catch (error: any) {
    console.error("AI Quiz Generation Error:", error)
    return NextResponse.json(
      { error: "Failed to generate AI quiz", details: error.message },
      { status: 500 }
    )
  }
}
