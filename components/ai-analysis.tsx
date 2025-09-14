"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Target, BookOpen, Lightbulb, AlertCircle, CheckCircle, Star } from "lucide-react"

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

// Simulated AI analysis function
function analyzeStudentPerformance(quizResults: any[]): {
  overall_capability: number
  performance_by_subject: StudentPerformance[]
  insights: AIInsight[]
  next_recommendations: string[]
} {
  // This would normally call an AI service, but for demo purposes we'll simulate it
  const mockAnalysis = {
    overall_capability: 75,
    performance_by_subject: [
      {
        subject: "Mathematics",
        accuracy: 85,
        speed: 70,
        consistency: 80,
        difficulty_preference: "medium" as const,
        learning_style: "visual" as const,
        strengths: ["Arithmetic", "Problem solving"],
        weaknesses: ["Word problems", "Geometry"],
        recommended_topics: ["Fractions", "Basic algebra"],
      },
      {
        subject: "Science",
        accuracy: 65,
        speed: 60,
        consistency: 70,
        difficulty_preference: "easy" as const,
        learning_style: "mixed" as const,
        strengths: ["Basic concepts", "Memory retention"],
        weaknesses: ["Complex reasoning", "Application"],
        recommended_topics: ["Earth science", "Simple experiments"],
      },
    ],
    insights: [
      {
        type: "strength" as const,
        title: "Strong Mathematical Foundation",
        description: "You show excellent arithmetic skills and logical thinking in math problems.",
        confidence: 90,
        actionable: false,
      },
      {
        type: "weakness" as const,
        title: "Science Application Gap",
        description: "While you understand concepts well, applying them to real-world scenarios needs practice.",
        confidence: 85,
        actionable: true,
      },
      {
        type: "recommendation" as const,
        title: "Visual Learning Approach",
        description: "Your performance improves significantly with visual aids and diagrams.",
        confidence: 80,
        actionable: true,
      },
      {
        type: "achievement" as const,
        title: "Consistent Improvement",
        description: "Your accuracy has improved by 15% over the last week!",
        confidence: 95,
        actionable: false,
      },
    ],
    next_recommendations: [
      "Practice word problems with visual aids",
      "Try interactive science experiments",
      "Focus on medium-difficulty math challenges",
      "Use diagrams for complex concepts",
    ],
  }

  return mockAnalysis
}

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Simulate loading analysis
    setIsAnalyzing(true)
    setTimeout(() => {
      const mockQuizResults = [] // This would come from actual quiz data
      const result = analyzeStudentPerformance(mockQuizResults)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 2000)
  }, [])

  if (isAnalyzing) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">AI is analyzing your performance...</h3>
            <p className="text-muted-foreground mb-4">
              Our AI is evaluating your learning patterns and generating personalized insights.
            </p>
            <Progress value={75} className="w-full max-w-md mx-auto" />
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
          <Brain className="h-8 w-8" />
          AI Performance Analysis
        </h1>
        <p className="text-muted-foreground">Personalized insights based on your learning patterns</p>
      </div>

      {/* Overall Capability Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Learning Capability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">{analysis.overall_capability}%</div>
              <div className="text-sm text-muted-foreground">Capability Score</div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {analysis.overall_capability >= 80
                  ? "Advanced"
                  : analysis.overall_capability >= 60
                    ? "Intermediate"
                    : "Beginner"}
              </Badge>
              <div className="text-sm text-muted-foreground">Current Level</div>
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
              <div key={subject.subject} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{subject.subject}</h3>
                  <Badge variant="outline">{subject.learning_style} learner</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{subject.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{subject.speed}%</div>
                    <div className="text-sm text-muted-foreground">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-3">{subject.consistency}%</div>
                    <div className="text-sm text-muted-foreground">Consistency</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1">
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
                    <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-1">
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

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommended Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {subject.recommended_topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
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
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.insights.map((insight: AIInsight, index: number) => {
              const getInsightIcon = (type: string) => {
                switch (type) {
                  case "strength":
                    return <CheckCircle className="h-5 w-5 text-green-500" />
                  case "weakness":
                    return <AlertCircle className="h-5 w-5 text-orange-500" />
                  case "recommendation":
                    return <Lightbulb className="h-5 w-5 text-blue-500" />
                  case "achievement":
                    return <Star className="h-5 w-5 text-yellow-500" />
                  default:
                    return <Brain className="h-5 w-5 text-primary" />
                }
              }

              return (
                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Take Action
                      </Button>
                    )}
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
            <p className="text-muted-foreground mb-4">
              Based on your performance, here's what we recommend you focus on next:
            </p>
            {analysis.next_recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <span className="flex-1">{recommendation}</span>
                <Button variant="outline" size="sm">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <BookOpen className="h-4 w-4 mr-2" />
          Continue Learning
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Brain className="h-4 w-4 mr-2" />
          Take Assessment Quiz
        </Button>
      </div>
    </div>
  )
}
