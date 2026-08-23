"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Loader2 } from "lucide-react"
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

export function AIQuizGenerator({ onQuizGenerated }: AIQuizGeneratorProps) {
  const { state: studentState } = useStudentStore()
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("Science")
  const [difficulty, setDifficulty] = useState("medium")
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
          topic: targetTopic,
          subject: targetSubject,
          difficulty,
          count: 5,
          seenQuestions: studentState.seenQuestionKeys || [],
        }),
      })

      const data = await res.json()
      if (res.ok && data.questions && data.questions.length > 0) {
        onQuizGenerated(data.questions, targetTopic)
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
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
          <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
          AI Custom Quiz Generator (Powered by Gemini)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Type ANY topic you want to learn about and Gemini AI will create a personalized, non-repeating quiz for you!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. Black Holes, Algebra, French Revolution..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isGenerating}
          />
          <Button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-700 min-w-[140px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Quiz
                <Sparkles className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-primary" />
            Quick AI Topic Ideas:
          </div>
          <div className="flex flex-wrap gap-2">
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
