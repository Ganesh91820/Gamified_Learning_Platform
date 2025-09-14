"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, BookOpen, Clock, Award, Activity, Zap } from "lucide-react"

interface ProgressData {
  date: string
  subject: string
  accuracy: number
  xpGained: number
  timeSpent: number
  quizzesCompleted: number
}

interface LearningGoal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  maxProgress: number
  subject: string
  difficulty: "easy" | "medium" | "hard"
  status: "active" | "completed" | "overdue"
}

interface WeeklyStats {
  week: string
  totalXP: number
  accuracy: number
  timeSpent: number
  quizzesCompleted: number
  streak: number
}

const mockProgressData: ProgressData[] = [
  { date: "2024-01-15", subject: "Mathematics", accuracy: 85, xpGained: 120, timeSpent: 45, quizzesCompleted: 3 },
  { date: "2024-01-16", subject: "Science", accuracy: 78, xpGained: 95, timeSpent: 38, quizzesCompleted: 2 },
  { date: "2024-01-17", subject: "English", accuracy: 92, xpGained: 140, timeSpent: 52, quizzesCompleted: 4 },
  { date: "2024-01-18", subject: "Mathematics", accuracy: 88, xpGained: 110, timeSpent: 41, quizzesCompleted: 3 },
  { date: "2024-01-19", subject: "History", accuracy: 75, xpGained: 85, timeSpent: 35, quizzesCompleted: 2 },
  { date: "2024-01-20", subject: "Science", accuracy: 82, xpGained: 105, timeSpent: 43, quizzesCompleted: 3 },
]

const mockLearningGoals: LearningGoal[] = [
  {
    id: "1",
    title: "Master Fractions",
    description: "Complete 10 fraction-related quizzes with 80% accuracy",
    targetDate: "2024-02-01",
    progress: 6,
    maxProgress: 10,
    subject: "Mathematics",
    difficulty: "medium",
    status: "active",
  },
  {
    id: "2",
    title: "Science Vocabulary",
    description: "Learn 50 new science terms",
    targetDate: "2024-01-25",
    progress: 32,
    maxProgress: 50,
    subject: "Science",
    difficulty: "easy",
    status: "active",
  },
  {
    id: "3",
    title: "Reading Comprehension",
    description: "Complete 5 advanced reading quizzes",
    targetDate: "2024-01-30",
    progress: 5,
    maxProgress: 5,
    subject: "English",
    difficulty: "hard",
    status: "completed",
  },
  {
    id: "4",
    title: "History Timeline",
    description: "Master chronological events in world history",
    targetDate: "2024-01-20",
    progress: 2,
    maxProgress: 8,
    subject: "History",
    difficulty: "medium",
    status: "overdue",
  },
]

const mockWeeklyStats: WeeklyStats[] = [
  { week: "Week 1", totalXP: 450, accuracy: 82, timeSpent: 180, quizzesCompleted: 12, streak: 5 },
  { week: "Week 2", totalXP: 520, accuracy: 85, timeSpent: 210, quizzesCompleted: 15, streak: 7 },
  { week: "Week 3", totalXP: 655, accuracy: 88, timeSpent: 254, quizzesCompleted: 17, streak: 7 },
  { week: "Week 4", totalXP: 720, accuracy: 86, timeSpent: 275, quizzesCompleted: 19, streak: 6 },
]

export function ProgressTracking() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const filteredData =
    selectedSubject === "all"
      ? mockProgressData
      : mockProgressData.filter((data) => data.subject.toLowerCase() === selectedSubject)

  const totalXP = filteredData.reduce((sum, data) => sum + data.xpGained, 0)
  const avgAccuracy = Math.round(filteredData.reduce((sum, data) => sum + data.accuracy, 0) / filteredData.length)
  const totalTime = filteredData.reduce((sum, data) => sum + data.timeSpent, 0)
  const totalQuizzes = filteredData.reduce((sum, data) => sum + data.quizzesCompleted, 0)

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your learning journey and achievements</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{totalXP}</div>
            <p className="text-sm text-muted-foreground">Total XP Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">{avgAccuracy}%</div>
            <p className="text-sm text-muted-foreground">Average Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">{Math.round(totalTime / 60)}h</div>
            <p className="text-sm text-muted-foreground">Time Studied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">{totalQuizzes}</div>
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Learning Goals</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Daily Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProgressData.slice(-7).map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium w-20">
                        {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <Badge variant="outline">{data.subject}</Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-primary">+{data.xpGained}</div>
                        <div className="text-muted-foreground">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{data.accuracy}%</div>
                        <div className="text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{data.timeSpent}m</div>
                        <div className="text-muted-foreground">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{data.quizzesCompleted}</div>
                        <div className="text-muted-foreground">Quizzes</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["Mathematics", "Science", "English", "History"].map((subject) => {
                  const subjectData = mockProgressData.filter((d) => d.subject === subject)
                  const avgAcc = Math.round(subjectData.reduce((sum, d) => sum + d.accuracy, 0) / subjectData.length)
                  const totalXP = subjectData.reduce((sum, d) => sum + d.xpGained, 0)

                  return (
                    <div key={subject} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{subject}</h4>
                        <div className="text-sm text-muted-foreground">{avgAcc}% avg</div>
                      </div>
                      <Progress value={avgAcc} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{totalXP} XP earned</span>
                        <span>{subjectData.length} sessions</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLearningGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{goal.title}</h4>
                            <Badge variant="outline" className={getGoalStatusColor(goal.status)}>
                              {goal.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Subject: {goal.subject}</span>
                            <span className={getDifficultyColor(goal.difficulty)}>Difficulty: {goal.difficulty}</span>
                            <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {goal.progress}/{goal.maxProgress}
                          </span>
                        </div>
                        <Progress value={(goal.progress / goal.maxProgress) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockWeeklyStats.map((week, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{week.week}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{week.streak} day streak</span>
                        <span>{Math.round(week.timeSpent / 60)}h studied</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{week.totalXP}</div>
                        <div className="text-xs text-muted-foreground">Total XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">{week.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-500">{week.quizzesCompleted}</div>
                        <div className="text-xs text-muted-foreground">Quizzes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-500">{week.timeSpent}m</div>
                        <div className="text-xs text-muted-foreground">Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Accuracy Improving</span>
                    </div>
                    <span className="text-sm text-green-600">+6% this week</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Study Time Consistent</span>
                    </div>
                    <span className="text-sm text-blue-600">4.5h/week avg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">XP Growth</span>
                    </div>
                    <span className="text-sm text-purple-600">+38% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Focus on History</div>
                    <div className="text-xs text-muted-foreground">
                      Your history scores are below average. Try 2-3 history quizzes this week.
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Maintain Math Streak</div>
                    <div className="text-xs text-muted-foreground">
                      Great progress in mathematics! Keep up the daily practice.
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Challenge Yourself</div>
                    <div className="text-xs text-muted-foreground">
                      Ready for harder difficulty levels in science topics.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Week Warrior", description: "Completed 7 days in a row", date: "2024-01-20", icon: "🔥" },
                  {
                    title: "Math Master",
                    description: "90% accuracy in 5 math quizzes",
                    date: "2024-01-19",
                    icon: "🧮",
                  },
                  {
                    title: "Speed Demon",
                    description: "Answered 10 questions in under 5 seconds each",
                    date: "2024-01-18",
                    icon: "⚡",
                  },
                  {
                    title: "Knowledge Seeker",
                    description: "Completed 25 total quizzes",
                    date: "2024-01-17",
                    icon: "📚",
                  },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
