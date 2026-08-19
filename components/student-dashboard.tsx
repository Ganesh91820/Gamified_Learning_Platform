"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Brain, Target, BookOpen, Award, Play, Users, Gift, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useStudentStore } from "@/lib/store"

export function StudentDashboard() {
  const { state: studentStats } = useStudentStore()

  // Calculate dynamic subject progress based on quiz history
  const getSubjectAccuracy = (subjectName: string, defaultVal: number) => {
    const history = studentStats.quizHistory.filter(
      (q) => q.subject.toLowerCase() === subjectName.toLowerCase()
    )
    if (history.length === 0) return defaultVal
    return Math.round(history.reduce((sum, q) => sum + q.accuracy, 0) / history.length)
  }

  const subjects = [
    { name: "Mathematics", icon: Target, progress: getSubjectAccuracy("Mathematics", 75), color: "bg-primary" },
    { name: "Science", icon: Brain, progress: getSubjectAccuracy("Science", 60), color: "bg-secondary" },
    { name: "English", icon: BookOpen, progress: getSubjectAccuracy("English", 90), color: "bg-chart-3" },
    { name: "History", icon: Award, progress: getSubjectAccuracy("History", 45), color: "bg-chart-4" },
  ]

  const recentAchievements = [
    { title: "Perfect Score!", description: "Got 100% in Quiz", icon: Trophy },
    { title: `${studentStats.streak} Day Streak`, description: `${studentStats.streak} days of continuous learning`, icon: Star },
    { title: "Fast Learner", description: `Completed ${studentStats.totalQuizzes} quizzes so far`, icon: Brain },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Ready to continue your learning adventure?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">Level {studentStats.level}</div>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{studentStats.streak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-chart-3">{studentStats.totalQuizzes}</div>
            <p className="text-sm text-muted-foreground">Quizzes Done</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-chart-4">{studentStats.accuracy}%</div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{studentStats.coins}</div>
            <p className="text-sm text-muted-foreground">Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Experience Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{studentStats.xp} XP</span>
              <span>
                {studentStats.xpToNext} XP to Level {studentStats.level + 1}
              </span>
            </div>
            <Progress value={(studentStats.xp / studentStats.xpToNext) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">AI Performance Insights</h3>
                <p className="text-sm text-muted-foreground">Get personalized learning recommendations</p>
              </div>
            </div>
            <Link href="/analysis">
              <Button variant="outline">View Analysis</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <div key={subject.name} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Play className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start New Quiz</h3>
            <p className="text-muted-foreground mb-4">Test your knowledge and earn XP</p>
            <Link href="/quiz">
              <Button className="w-full">Play Now</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">View Progress</h3>
            <p className="text-muted-foreground mb-4">Track your learning journey</p>
            <Link href="/progress">
              <Button variant="outline" className="w-full bg-transparent">
                View Progress
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-muted-foreground mb-4">See how you rank against friends</p>
            <Link href="/leaderboard">
              <Button variant="secondary" className="w-full">
                View Rankings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Gift className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rewards Shop</h3>
            <p className="text-muted-foreground mb-4">Spend coins on cool items</p>
            <Link href="/rewards">
              <Button variant="outline" className="w-full bg-transparent">
                Shop Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Zap className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Bonus</h3>
            <p className="text-muted-foreground mb-4">Claim your daily reward</p>
            <Link href="/rewards">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Claim Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {studentStats.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-sm py-1 px-3">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Icon className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
