"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Loader2, Target, GraduationCap, Sliders, AlertTriangle } from "lucide-react"
import { useStudentStore } from "@/lib/store"

interface AIQuizGeneratorProps {
  onQuizGenerated: (questions: any[], topic: string) => void
}

const QUICK_TOPICS = [
  { topic: "Solar System", subject: "Science" },
  { topic: "Pythagorean Theorem", subject: "Mathematics" },
  { topic: "Ancient Civilizations", subject: "History" },
  { topic: "English Grammar Rules", subject: "English" },
  { topic: "Logical Riddles", subject: "Logic" },
  { topic: "Photosynthesis & Plant Life", subject: "Science" },
]

const GRADE_LEVELS = [
  "Primary school (6–10)",
  "Middle school (11–14)",
  "High school (15–18)",
  "College/adult",
]

const QUESTION_COUNTS = [3, 5, 8, 10]
const DIFFICULTIES = ["easy", "medium", "hard"] as const

export function AIQuizGenerator({ onQuizGenerated }: AIQuizGeneratorProps) {
  const { state: studentState } = useStudentStore()
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("Science")
  const [gradeLevel, setGradeLevel] = useState("Middle school (11–14)")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [count, setCount] = useState<number>(5)
  const [learningGoal, setLearningGoal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleGenerate = async (customTopic?: string, customSubject?: string) => {
    const targetTopic = customTopic || topic
    const targetSubject = customSubject || subject

    if (!targetTopic.trim()) {
      setErrorMsg("Please enter a topic or select one below.")
      return
    }

    setErrorMsg("")
    setIsGenerating(true)

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic.trim(),
          subject: targetSubject,
          gradeLevel,
          difficulty,
          count,
          learningGoal: learningGoal.trim(),
          seenQuestions: studentState.seenQuestionKeys || [],
        }),
      })

      const data = await res.json()
      if (res.ok && data.questions && data.questions.length > 0) {
        onQuizGenerated(data.questions, targetTopic.trim())
      } else {
        setErrorMsg(data.error || "Failed to generate AI quiz. Try another topic.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Network error generating AI quiz.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
          <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
          AI Custom Quiz Generator (Powered by Gemini)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize learner level, difficulty, and learning goal to generate structured, non-repeating quizzes!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Topic Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-primary" />
            Topic / Subject:
          </label>
          <input
            type="text"
            placeholder="e.g. Black Holes, Algebra, French Revolution..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isGenerating}
          />
        </div>

        {/* Optional Learning Goal */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-primary" />
            Optional Learning Goal:
          </label>
          <input
            type="text"
            placeholder="e.g. Apply the theorem to find a missing side"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isGenerating}
          />
        </div>

        {/* Extended Control Grid: Grade Level, Difficulty, Count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Learner Level */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              Learner Level:
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              disabled={isGenerating}
              className="w-full px-3 py-1.5 border rounded-md text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {GRADE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              Difficulty:
            </label>
            <div className="flex gap-1">
              {DIFFICULTIES.map((diff) => (
                <Button
                  key={diff}
                  type="button"
                  variant={difficulty === diff ? "default" : "outline"}
                  size="sm"
                  className="flex-1 capitalize text-xs h-8 px-2"
                  onClick={() => setDifficulty(diff)}
                  disabled={isGenerating}
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Questions:
            </label>
            <div className="flex gap-1">
              {QUESTION_COUNTS.map((cnt) => (
                <Button
                  key={cnt}
                  type="button"
                  variant={count === cnt ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-8 px-2"
                  onClick={() => setCount(cnt)}
                  disabled={isGenerating}
                >
                  {cnt}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-700 h-10 text-sm font-semibold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Custom AI Quiz...
            </>
          ) : (
            <>
              Generate AI Quiz ({count} Questions)
              <Sparkles className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-xs text-red-600 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-primary" />
            Quick AI Topic Ideas:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map((item) => (
              <Badge
                key={item.topic}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors py-1 px-2 text-xs flex items-center gap-1"
                onClick={() => {
                  setTopic(item.topic)
                  setSubject(item.subject)
                  handleGenerate(item.topic, item.subject)
                }}
              >
                <span>{item.topic}</span>
                <span className="text-[10px] text-muted-foreground">({item.subject})</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
