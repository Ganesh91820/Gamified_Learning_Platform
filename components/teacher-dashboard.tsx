"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  Download,
  Settings,
} from "lucide-react"

interface Student {
  id: string
  name: string
  avatar?: string
  level: number
  xp: number
  accuracy: number
  streak: number
  lastActive: string
  totalQuizzes: number
  weakSubjects: string[]
  strongSubjects: string[]
  status: "active" | "inactive" | "struggling"
}

interface ClassStats {
  totalStudents: number
  activeToday: number
  averageAccuracy: number
  totalQuizzesCompleted: number
  averageLevel: number
  strugglingStudents: number
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    level: 5,
    xp: 1250,
    accuracy: 85,
    streak: 7,
    lastActive: "2024-01-20T10:30:00Z",
    totalQuizzes: 23,
    weakSubjects: ["Science", "History"],
    strongSubjects: ["Mathematics", "English"],
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Chen",
    level: 8,
    xp: 2450,
    accuracy: 92,
    streak: 15,
    lastActive: "2024-01-20T14:15:00Z",
    totalQuizzes: 45,
    weakSubjects: ["History"],
    strongSubjects: ["Mathematics", "Science", "English"],
    status: "active",
  },
  {
    id: "3",
    name: "Miguel Rodriguez",
    level: 3,
    xp: 680,
    accuracy: 65,
    streak: 2,
    lastActive: "2024-01-18T16:45:00Z",
    totalQuizzes: 12,
    weakSubjects: ["Mathematics", "Science"],
    strongSubjects: ["English"],
    status: "struggling",
  },
  {
    id: "4",
    name: "Emma Wilson",
    level: 6,
    xp: 1580,
    accuracy: 88,
    streak: 5,
    lastActive: "2024-01-20T09:20:00Z",
    totalQuizzes: 31,
    weakSubjects: ["History"],
    strongSubjects: ["Mathematics", "Science"],
    status: "active",
  },
  {
    id: "5",
    name: "David Kim",
    level: 2,
    xp: 420,
    accuracy: 58,
    streak: 0,
    lastActive: "2024-01-17T11:30:00Z",
    totalQuizzes: 8,
    weakSubjects: ["Mathematics", "Science", "English"],
    strongSubjects: [],
    status: "inactive",
  },
]

const mockClassStats: ClassStats = {
  totalStudents: 25,
  activeToday: 18,
  averageAccuracy: 78,
  totalQuizzesCompleted: 342,
  averageLevel: 4.2,
  strugglingStudents: 6,
}

export function TeacherDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const handleExportCSV = () => {
    const headers = "Name,Level,XP,Accuracy,Streak,Quizzes,Status\n"
    const rows = mockStudents
      .map(s => `"${s.name}",${s.level},${s.xp},${s.accuracy}%,${s.streak},${s.totalQuizzes},${s.status}`)
      .join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `class_performance_report_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300"
      case "struggling":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "struggling":
        return <AlertCircle className="h-4 w-4" />
      case "inactive":
        return <Clock className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and classroom analytics</p>
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
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.totalStudents}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.activeToday}</div>
            <p className="text-sm text-muted-foreground">Active Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.averageAccuracy}%</div>
            <p className="text-sm text-muted-foreground">Avg Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.totalQuizzesCompleted}</div>
            <p className="text-sm text-muted-foreground">Quizzes Done</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.averageLevel.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Avg Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockClassStats.strugglingStudents}</div>
            <p className="text-sm text-muted-foreground">Need Help</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Student List */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Student Overview</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 border rounded-md text-sm bg-background w-full sm:w-48"
                />
                <div className="flex gap-1">
                  {["all", "active", "struggling", "inactive"].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      className="capitalize text-xs"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Level {student.level} • {student.totalQuizzes} quizzes •{" "}
                          {formatLastActive(student.lastActive)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{student.accuracy}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{student.streak}</div>
                        <div className="text-sm text-muted-foreground">Streak</div>
                      </div>
                      <Badge className={`${getStatusColor(student.status)} flex items-center gap-1`}>
                        {getStatusIcon(student.status)}
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">No students match your filter criteria.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student Detail Modal */}
          {selectedStudent && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {selectedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {selectedStudent.name} - Detailed View
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Level</span>
                          <span className="font-medium">{selectedStudent.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total XP</span>
                          <span className="font-medium">{selectedStudent.xp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy</span>
                          <span className="font-medium">{selectedStudent.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Streak</span>
                          <span className="font-medium">{selectedStudent.streak} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Quizzes</span>
                          <span className="font-medium">{selectedStudent.totalQuizzes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Strong Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.strongSubjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="bg-green-100 text-green-800">
                            {subject}
                          </Badge>
                        ))}
                        {selectedStudent.strongSubjects.length === 0 && (
                          <span className="text-sm text-muted-foreground">No strong subjects identified yet</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-orange-600">Areas for Improvement</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.weakSubjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="bg-orange-100 text-orange-800">
                            {subject}
                          </Badge>
                        ))}
                        {selectedStudent.weakSubjects.length === 0 && (
                          <span className="text-sm text-muted-foreground">No weak areas identified</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {selectedStudent.status === "struggling" && (
                          <>
                            <li>• Consider one-on-one tutoring sessions</li>
                            <li>• Assign easier difficulty quizzes to build confidence</li>
                            <li>• Encourage daily practice with shorter sessions</li>
                          </>
                        )}
                        {selectedStudent.status === "inactive" && (
                          <>
                            <li>• Send motivational messages to re-engage</li>
                            <li>• Check for technical or access issues</li>
                            <li>• Consider parent/guardian outreach</li>
                          </>
                        )}
                        {selectedStudent.status === "active" && (
                          <>
                            <li>• Continue current learning path</li>
                            <li>• Consider advanced challenges</li>
                            <li>• Peer mentoring opportunities</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Mathematics", "Science", "English", "History"].map((subject) => {
                    const accuracy = Math.floor(Math.random() * 30) + 60
                    return (
                      <div key={subject}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{subject}</span>
                          <span className="text-sm text-muted-foreground">{accuracy}%</span>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                    const activity = Math.floor(Math.random() * 20) + 5
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{day}</span>
                        <div className="flex-1 mx-4">
                          <Progress value={(activity / 25) * 100} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{activity}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Class Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">↗ 12%</div>
                  <div className="text-sm text-muted-foreground">Average accuracy improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">↗ 8%</div>
                  <div className="text-sm text-muted-foreground">Daily active users increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">↗ 15%</div>
                  <div className="text-sm text-muted-foreground">Quiz completion rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <Calendar className="h-6 w-6 mb-2" />
                  Weekly Progress Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Subject Performance Analysis
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <Users className="h-6 w-6 mb-2" />
                  Individual Student Reports
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Class Trends & Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Create Custom Quiz
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Target className="h-6 w-6 mb-2" />
                    Assign Practice Topics
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Create personalized assignments based on student performance and learning needs.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
