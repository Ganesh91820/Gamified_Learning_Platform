"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Star, Trophy, ArrowRight, RotateCcw, Sparkles, Bot, Shuffle } from "lucide-react"
import { useStudentStore } from "@/lib/store"
import { AIQuizGenerator } from "@/components/ai-quiz-generator"
import { AITutorDialog } from "@/components/ai-tutor-dialog"
import Link from "next/link"

interface Question {
  id: number
  type: "multiple-choice" | "true-false" | "logic"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  subject: string
  points: number
}

interface QuizResult {
  correct: boolean
  timeSpent: number
  points: number
}

const EXTENDED_QUESTION_BANK: Question[] = [
  // Mathematics
  {
    id: 1,
    type: "multiple-choice",
    question: "What is 15 + 27?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "15 + 27 = 42. Break it down: 15 + 20 = 35, then 35 + 7 = 42",
    difficulty: "easy",
    subject: "Mathematics",
    points: 10,
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    explanation: "8 × 8 = 64, so the square root of 64 is 8.",
    difficulty: "medium",
    subject: "Mathematics",
    points: 15,
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "If a triangle has angles 60° and 30°, what is the third angle?",
    options: ["90°", "60°", "45°", "100°"],
    correctAnswer: 0,
    explanation: "The interior angles of any triangle sum to 180°. 180° - 60° - 30° = 90°.",
    difficulty: "medium",
    subject: "Mathematics",
    points: 15,
  },
  {
    id: 11,
    type: "multiple-choice",
    question: "What is 12 × 11?",
    options: ["121", "132", "144", "122"],
    correctAnswer: 1,
    explanation: "12 × 10 = 120, plus 12 = 132.",
    difficulty: "easy",
    subject: "Mathematics",
    points: 10,
  },
  {
    id: 12,
    type: "multiple-choice",
    question: "Solve for x: 2x + 5 = 15",
    options: ["x = 5", "x = 10", "x = 7.5", "x = 4"],
    correctAnswer: 0,
    explanation: "2x = 15 - 5 = 10, so x = 10 / 2 = 5.",
    difficulty: "medium",
    subject: "Mathematics",
    points: 15,
  },
  {
    id: 13,
    type: "multiple-choice",
    question: "What is 25% of 200?",
    options: ["25", "40", "50", "75"],
    correctAnswer: 2,
    explanation: "25% = 1/4. 200 / 4 = 50.",
    difficulty: "easy",
    subject: "Mathematics",
    points: 10,
  },
  {
    id: 14,
    type: "multiple-choice",
    question: "What is the perimeter of a rectangle with length 8cm and width 5cm?",
    options: ["26cm", "40cm", "13cm", "30cm"],
    correctAnswer: 0,
    explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 5) = 26cm.",
    difficulty: "medium",
    subject: "Mathematics",
    points: 15,
  },

  // Science
  {
    id: 4,
    type: "true-false",
    question: "The Earth revolves around the Sun.",
    correctAnswer: "true",
    explanation: "Correct! The Earth orbits around the Sun, completing one revolution in about 365.25 days.",
    difficulty: "easy",
    subject: "Science",
    points: 10,
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is called the Red Planet because of iron oxide (rust) on its surface.",
    difficulty: "medium",
    subject: "Science",
    points: 15,
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "What process do plants use to make food using sunlight?",
    options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
    correctAnswer: 1,
    explanation: "Photosynthesis converts light energy, water, and CO₂ into oxygen and glucose.",
    difficulty: "easy",
    subject: "Science",
    points: 10,
  },
  {
    id: 15,
    type: "multiple-choice",
    question: "What is the chemical symbol for Gold?",
    options: ["Ag", "Au", "Fe", "Gd"],
    correctAnswer: 1,
    explanation: "Au comes from the Latin word for gold, 'Aurum'.",
    difficulty: "medium",
    subject: "Science",
    points: 15,
  },
  {
    id: 16,
    type: "multiple-choice",
    question: "Which gas do human beings inhale for respiration?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    correctAnswer: 2,
    explanation: "Humans inhale Oxygen, which cells use to convert glucose into energy.",
    difficulty: "easy",
    subject: "Science",
    points: 10,
  },
  {
    id: 17,
    type: "multiple-choice",
    question: "What state of matter has a fixed volume but no fixed shape?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    correctAnswer: 1,
    explanation: "Liquids conform to the shape of their container while maintaining a constant volume.",
    difficulty: "medium",
    subject: "Science",
    points: 15,
  },

  // English
  {
    id: 7,
    type: "multiple-choice",
    question: "Which word is a synonym for 'Abundant'?",
    options: ["Scarce", "Plentiful", "Tiny", "Empty"],
    correctAnswer: 1,
    explanation: "'Abundant' means present in large quantities, which is synonymous with 'Plentiful'.",
    difficulty: "medium",
    subject: "English",
    points: 15,
  },
  {
    id: 8,
    type: "multiple-choice",
    question: "Identify the noun in the sentence: 'The swift runner won the medal.'",
    options: ["Swift", "Runner", "Won", "Quickly"],
    correctAnswer: 1,
    explanation: "'Runner' is the person performing the action (a noun).",
    difficulty: "easy",
    subject: "English",
    points: 10,
  },
  {
    id: 18,
    type: "multiple-choice",
    question: "Choose the correct spelling:",
    options: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"],
    correctAnswer: 0,
    explanation: "'Accommodate' has double 'c' and double 'm'.",
    difficulty: "medium",
    subject: "English",
    points: 15,
  },
  {
    id: 19,
    type: "multiple-choice",
    question: "Which word is an antonym of 'Reluctant'?",
    options: ["Hesitant", "Eager", "Unwilling", "Cautious"],
    correctAnswer: 1,
    explanation: "'Reluctant' means hesitant/unwilling, so 'Eager' is the exact opposite.",
    difficulty: "medium",
    subject: "English",
    points: 15,
  },

  // History
  {
    id: 9,
    type: "multiple-choice",
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
    correctAnswer: 2,
    explanation: "George Washington served as the first U.S. President from 1789 to 1797.",
    difficulty: "easy",
    subject: "History",
    points: 10,
  },
  {
    id: 20,
    type: "multiple-choice",
    question: "In which year did World War II end?",
    options: ["1939", "1942", "1945", "1950"],
    correctAnswer: 2,
    explanation: "World War II concluded in 1945 following the surrender of Axis powers.",
    difficulty: "medium",
    subject: "History",
    points: 15,
  },
  {
    id: 21,
    type: "multiple-choice",
    question: "Which ancient civilization constructed the Pyramids of Giza?",
    options: ["Romans", "Greeks", "Egyptians", "Persians"],
    correctAnswer: 2,
    explanation: "The Ancient Egyptians built the pyramids as monumental tombs for their Pharaohs.",
    difficulty: "easy",
    subject: "History",
    points: 10,
  },

  // Logic
  {
    id: 10,
    type: "logic",
    question: "If all cats are animals, and Fluffy is a cat, then Fluffy is:",
    options: ["A dog", "An animal", "A bird", "A fish"],
    correctAnswer: 1,
    explanation: "Logical syllogism: All cats → animals, Fluffy is a cat → Fluffy is an animal.",
    difficulty: "medium",
    subject: "Logic",
    points: 20,
  },
  {
    id: 22,
    type: "logic",
    question: "Which number comes next in the sequence: 2, 4, 8, 16, __?",
    options: ["20", "24", "32", "64"],
    correctAnswer: 2,
    explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32.",
    difficulty: "easy",
    subject: "Logic",
    points: 10,
  },
  {
    id: 23,
    type: "logic",
    question: "If RED is coded as 18-5-4 (alphabet positions R=18, E=5, D=4), what is CAB?",
    options: ["3-1-2", "1-2-3", "3-2-1", "12-1-3"],
    correctAnswer: 0,
    explanation: "C=3, A=1, B=2, so CAB = 3-1-2.",
    difficulty: "medium",
    subject: "Logic",
    points: 15,
  },
]

// Fisher-Yates Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function QuizSystem() {
  const { recordQuizResult } = useStudentStore()
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All")
  const [customAIQuestions, setCustomAIQuestions] = useState<Question[] | null>(null)
  const [customTopicTitle, setCustomTopicTitle] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showAITutor, setShowAITutor] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

  // Prepare and shuffle questions whenever subject filter or AI questions change
  const prepareQuestions = (subjFilter: string, aiQuestions: Question[] | null) => {
    if (aiQuestions && aiQuestions.length > 0) {
      return aiQuestions
    }
    const pool = subjFilter === "All"
      ? EXTENDED_QUESTION_BANK
      : EXTENDED_QUESTION_BANK.filter(q => q.subject.toLowerCase() === subjFilter.toLowerCase())
    
    // Pick 5 random non-repeating questions
    const shuffledPool = shuffleArray(pool)
    return shuffledPool.slice(0, Math.min(5, shuffledPool.length))
  }

  const activeQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : EXTENDED_QUESTION_BANK.slice(0, 4)
  const question = activeQuestions[currentQuestion] || activeQuestions[0]
  const totalQuestions = activeQuestions.length

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResult && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult && quizStarted) {
      handleAnswer()
    }
  }, [timeLeft, quizStarted, showResult, quizCompleted])

  const startQuiz = () => {
    const freshQuestions = prepareQuestions(selectedSubjectFilter, customAIQuestions)
    setShuffledQuestions(freshQuestions)
    setQuizStarted(true)
    setCurrentQuestion(0)
    setQuizResults([])
    setShowResult(false)
    setSelectedAnswer(null)
    setTimeLeft(30)
  }

  const handleAIQuizGenerated = (questions: Question[], topic: string) => {
    const shuffledAI = shuffleArray(questions)
    setCustomAIQuestions(shuffledAI)
    setCustomTopicTitle(topic)
    setShuffledQuestions(shuffledAI)
    setQuizStarted(true)
    setCurrentQuestion(0)
    setQuizResults([])
    setShowResult(false)
    setSelectedAnswer(null)
    setTimeLeft(30)
  }

  const handleAnswer = () => {
    const timeSpent = 30 - timeLeft
    const isCorrect = selectedAnswer === question.correctAnswer
    const points = isCorrect ? question.points + Math.max(0, Math.floor(timeLeft / 2)) : 0

    const result: QuizResult = {
      correct: isCorrect,
      timeSpent,
      points,
    }

    const updatedResults = [...quizResults, result]
    setQuizResults(updatedResults)
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      setQuizCompleted(true)
      const totalScore = [...quizResults].reduce((sum, r) => sum + r.points, 0) + 
        (selectedAnswer === question.correctAnswer ? (question.points + Math.max(0, Math.floor(timeLeft / 2))) : 0)
      const correctCount = quizResults.filter(r => r.correct).length + (selectedAnswer === question.correctAnswer ? 1 : 0)
      
      recordQuizResult(
        customTopicTitle ? `AI: ${customTopicTitle}` : (selectedSubjectFilter === "All" ? "General" : selectedSubjectFilter),
        correctCount,
        totalQuestions,
        totalScore
      )
    }
  }

  const restartQuiz = () => {
    setCustomAIQuestions(null)
    setCustomTopicTitle("")
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizResults([])
    setTimeLeft(30)
    setQuizStarted(false)
    setQuizCompleted(false)
  }

  const totalScore = quizResults.reduce((sum, result) => sum + result.points, 0)
  const correctAnswers = quizResults.filter((result) => result.correct).length

  if (!quizStarted) {
    return (
      <div className="container mx-auto p-4 max-w-3xl space-y-6">
        {/* Gemini AI Custom Quiz Generator */}
        <AIQuizGenerator onQuizGenerated={handleAIQuizGenerated} />

        {/* Standard Preset Quizzes */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary flex items-center justify-center gap-2">
              Or Choose Preset Subject Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-muted-foreground text-sm">
              Practice core syllabus subjects with randomized, non-repeating question sets:
            </div>

            {/* Subject Selector */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-foreground">Subject Filter:</label>
              <div className="flex flex-wrap gap-2">
                {["All", "Mathematics", "Science", "English", "History", "Logic"].map((subj) => (
                  <Button
                    key={subj}
                    variant={selectedSubjectFilter === subj ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedSubjectFilter(subj)
                      setCustomAIQuestions(null)
                    }}
                  >
                    {subj}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-semibold">Random Questions</div>
                <div>5 questions per session</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-semibold">Time per Question</div>
                <div>30 seconds</div>
              </div>
            </div>

            <Button onClick={startQuiz} size="lg" className="w-full gap-2">
              <Shuffle className="h-4 w-4" />
              Start Randomized Quiz ({selectedSubjectFilter})
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100)
    const performance = accuracy >= 80 ? "Excellent!" : accuracy >= 60 ? "Good Job!" : "Keep Practicing!"

    return (
      <div className="container mx-auto p-4 max-w-2xl space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
              <Trophy className="h-7 w-7 text-yellow-500" />
              {customTopicTitle ? `AI Quiz Complete: ${customTopicTitle}` : "Quiz Complete!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-secondary">{performance}</div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">+{totalScore}</div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">+{Math.round(totalScore / 2)}</div>
                <div className="text-sm text-muted-foreground">Coins Earned</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Performance Breakdown</div>
              {quizResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm font-medium">Question {index + 1} ({activeQuestions[index]?.subject})</span>
                  <div className="flex items-center gap-2">
                    {result.correct ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{result.points} pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={restartQuiz} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Another Quiz
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-6">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{question.subject}</Badge>
            {customTopicTitle && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                {customTopicTitle}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Clock className="h-4 w-4" />
            {timeLeft}s
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 text-primary gap-1 hover:bg-primary/10"
            onClick={() => setShowAITutor(true)}
          >
            <Bot className="h-3.5 w-3.5 text-primary" />
            Ask AI Tutor 🤖
          </Button>
        </div>
      </div>

      {!showResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {question.points} points
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.type === "multiple-choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {question.type === "true-false" && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedAnswer === "true" ? "default" : "outline"}
                  className="h-16 text-lg"
                  onClick={() => setSelectedAnswer("true")}
                >
                  True
                </Button>
                <Button
                  variant={selectedAnswer === "false" ? "default" : "outline"}
                  className="h-16 text-lg"
                  onClick={() => setSelectedAnswer("false")}
                >
                  False
                </Button>
              </div>
            )}

            {question.type === "logic" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="w-full mt-6">
              Submit Answer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              {quizResults[currentQuestion]?.correct ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
              )}
              <div className="text-xl font-semibold mb-2">
                {quizResults[currentQuestion]?.correct ? "Correct!" : "Incorrect"}
              </div>
              <div className="text-lg text-primary font-medium">
                +{quizResults[currentQuestion]?.points || 0} points
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-6 text-left">
              <div className="font-medium mb-2">Explanation:</div>
              <div className="text-sm text-muted-foreground">{question.explanation}</div>
            </div>

            <Button onClick={nextQuestion} className="w-full">
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Finish Quiz"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Tutor Chat Modal */}
      {showAITutor && (
        <AITutorDialog
          currentQuestion={question}
          onClose={() => setShowAITutor(false)}
        />
      )}
    </div>
  )
}
