"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Star, Trophy, ArrowRight, RotateCcw } from "lucide-react"

interface Question {
  id: number
  type: "multiple-choice" | "true-false" | "memory" | "logic"
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

const sampleQuestions: Question[] = [
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
    type: "true-false",
    question: "The Earth revolves around the Sun.",
    correctAnswer: "true",
    explanation: "Correct! The Earth orbits around the Sun, completing one revolution in about 365 days.",
    difficulty: "easy",
    subject: "Science",
    points: 10,
  },
  {
    id: 3,
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
    id: 4,
    type: "logic",
    question: "If all cats are animals, and Fluffy is a cat, then Fluffy is:",
    options: ["A dog", "An animal", "A bird", "A fish"],
    correctAnswer: 1,
    explanation: "This is logical reasoning: All cats → animals, Fluffy is a cat → Fluffy is an animal.",
    difficulty: "medium",
    subject: "Logic",
    points: 20,
  },
]

export function QuizSystem() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  const question = sampleQuestions[currentQuestion]
  const totalQuestions = sampleQuestions.length

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResult && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer()
    }
  }, [timeLeft, quizStarted, showResult, quizCompleted])

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
    setTimeLeft(30)
  }

  const handleAnswer = () => {
    const timeSpent = 30 - timeLeft
    const isCorrect = selectedAnswer === question.correctAnswer
    const points = isCorrect ? question.points + Math.max(0, timeLeft) : 0

    const result: QuizResult = {
      correct: isCorrect,
      timeSpent,
      points,
    }

    setQuizResults([...quizResults, result])
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
    }
  }

  const restartQuiz = () => {
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
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Ready for a Quiz Challenge?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-muted-foreground">
              Test your knowledge across different subjects and earn XP points!
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-semibold">Questions</div>
                <div>{totalQuestions}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-semibold">Time per Question</div>
                <div>30 seconds</div>
              </div>
            </div>
            <Button onClick={startQuiz} size="lg" className="w-full">
              Start Quiz
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
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold text-secondary">{performance}</div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalScore}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 bg-chart-3/10 rounded-lg">
                <div className="text-2xl font-bold text-chart-3">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Performance Breakdown</div>
              {quizResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">Question {index + 1}</span>
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
                Try Again
              </Button>
              <Button className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary">{question.subject}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {timeLeft}s
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
        <div className="text-sm text-muted-foreground mt-1">
          Question {currentQuestion + 1} of {totalQuestions}
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
                  className="h-16"
                  onClick={() => setSelectedAnswer("true")}
                >
                  True
                </Button>
                <Button
                  variant={selectedAnswer === "false" ? "default" : "outline"}
                  className="h-16"
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
                "View Results"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
