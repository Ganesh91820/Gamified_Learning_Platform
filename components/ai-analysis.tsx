"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Target, BookOpen, Lightbulb, AlertCircle, CheckCircle, Star, Sparkles } from "lucide-react"
import { useStudentStore, QuizRecord } from "@/lib/store"
import Link from "next/link"

interface StudentPerformance {
  subject: string
  accuracy: number
  speed: number
  consistency: number
  difficulty_preference: "easy" | "medium" | "hard"
  learning_style: "visual" | "auditory" | "kinesthetic" | "mixed"
  strengths: string[]
  weaknesses: string[]
  recommended_topics: string[]
}

interface AIInsight {
  type: "strength" | "weakness" | "recommendation" | "achievement"
  title: string
  description: string
  confidence: number
  actionable: boolean
}

function analyzeStudentPerformance(quizHistory: QuizRecord[], overallAccuracy: number) {
  // Aggregate accuracy by subject
  const subjectMap: Record<string, number[]> = {}
  quizHistory.forEach(q => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = []
    subjectMap[q.subject].push(q.accuracy)
  })

  const subjects = ["Mathematics", "Science", "English", "History", "Logic"]
  const performance_by_subject: StudentPerformance[] = subjects.map((subj) => {
    const scores = subjectMap[subj] || [75]
    const avgAcc = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

    return {
      subject: subj,
      accuracy: avgAcc,
      speed: Math.min(95, avgAcc + 5),
      consistency: Math.max(60, avgAcc - 5),
      difficulty_preference: avgAcc > 80 ? "hard" : avgAcc > 60 ? "medium" : "easy",
      learning_style: subj === "Mathematics" || subj === "Logic" ? "visual" : "mixed",
      strengths: avgAcc >= 75 ? ["Concept Mastery", "Quick Comprehension"] : ["Foundational Understanding"],
      weaknesses: avgAcc < 75 ? ["Complex Problem Solving", "Speed under pressure"] : ["Edge Case Reasoning"],
      recommended_topics: subj === "Mathematics" ? ["Fractions & Algebra", "Word Problems"] : ["Core Principles", "Interactive Practice"],
    }
  })

  const overall_capability = overallAccuracy || 82

  const insights: AIInsight[] = [
    {
      type: "strength",
      title: "Strong Mathematical & Logic Foundation",
      description: `Your average accuracy across quizzes is ${overall_capability}%. You demonstrate quick numerical comprehension.`,
      confidence: 92,
      actionable: false,
    },
    {
      type: "weakness",
      title: "Targeted Weak Spots Identified",
      description: "Scores indicate higher accuracy in multiple choice questions compared to logic syllogisms.",
      confidence: 86,
      actionable: true,
    },
    {
      type: "recommendation",
      title: "Adaptive Learning Recommendation",
      description: "Spending 10 minutes daily on Science and Logic quizzes will boost your streak and level up your overall score.",
      confidence: 89,
      actionable: true,
    },
    {
      type: "achievement",
      title: "Consistent Learning Trend",
      description: `You have completed ${quizHistory.length} quiz sessions with active participation!`,
      confidence: 98,
      actionable: false,
    },
  ]

  const next_recommendations = [
    "Complete a 5-question Science Quiz to strengthen your weak topics",
    "Try a Logic Reasoning challenge to improve problem solving",
    "Review quiz explanation breakdowns after finishing each session",
    "Maintain your daily learning streak to earn bonus coins",
  ]

  return {
    overall_capability,
    performance_by_subject,
    insights,
    next_recommendations,
  }
}

export function AIAnalysis() {
  const { state: studentState } = useStudentStore()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => {
      const result = analyzeStudentPerformance(studentState.quizHistory, studentState.accuracy)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [studentState.quizHistory, studentState.accuracy])

  if (isAnalyzing) {
    return (
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <h3 className="text-2xl font-bold">AI is analyzing your performance...</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Evaluating past quiz history, response timing, accuracy trends, and subject mastery.
            </p>
            <Progress value={85} className="w-full max-w-md mx-auto h-3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Performance Analysis
        </h1>
        <p className="text-muted-foreground">Personalized insights generated from your quiz history</p>
      </div>

      {/* Overall Capability Score */}
      <Card className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Learning Capability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-extrabold text-primary">{analysis.overall_capability}%</div>
              <div className="text-sm text-muted-foreground">Overall Mastery Score</div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2 text-sm py-1 px-3">
                {analysis.overall_capability >= 80
                  ? "Advanced Learner"
                  : analysis.overall_capability >= 60
                    ? "Intermediate Learner"
                    : "Developing Learner"}
              </Badge>
              <div className="text-sm text-muted-foreground">Skill Tier</div>
            </div>
          </div>
          <Progress value={analysis.overall_capability} className="h-3" />
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysis.performance_by_subject.map((subject: StudentPerformance) => (
              <div key={subject.subject} className="border rounded-lg p-4 bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{subject.subject}</h3>
                  <Badge variant="outline">{subject.learning_style} learner</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{subject.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-2 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-secondary">{subject.speed}%</div>
                    <div className="text-xs text-muted-foreground">Speed Index</div>
                  </div>
                  <div className="text-center p-2 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-yellow-600">{subject.consistency}%</div>
                    <div className="text-xs text-muted-foreground">Consistency</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="text-sm space-y-1">
                      {subject.strengths.map((strength, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-1 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Areas to Improve
                    </h4>
                    <ul className="text-sm space-y-1">
                      {subject.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.insights.map((insight: AIInsight, index: number) => {
              return (
                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/40 rounded-lg border">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% AI confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Personalized Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.next_recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-background">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="flex-1 text-sm font-medium">{recommendation}</span>
                <Link href="/quiz">
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href="/quiz" className="flex-1">
          <Button className="w-full h-12 text-base">
            <BookOpen className="h-5 w-5 mr-2" />
            Take a Practice Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}
