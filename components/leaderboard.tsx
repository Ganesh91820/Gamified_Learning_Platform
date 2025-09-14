"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Star, Users } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  xp: number
  level: number
  streak: number
  badges: number
  isCurrentUser?: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Chen", xp: 2450, level: 8, streak: 15, badges: 12 },
  { rank: 2, name: "Miguel Rodriguez", xp: 2380, level: 7, streak: 12, badges: 10 },
  { rank: 3, name: "Alex Johnson", xp: 1250, level: 5, streak: 7, badges: 8, isCurrentUser: true },
  { rank: 4, name: "Emma Wilson", xp: 1180, level: 5, streak: 5, badges: 7 },
  { rank: 5, name: "David Kim", xp: 1050, level: 4, streak: 3, badges: 6 },
  { rank: 6, name: "Priya Patel", xp: 980, level: 4, streak: 8, badges: 5 },
  { rank: 7, name: "James Brown", xp: 920, level: 4, streak: 2, badges: 4 },
  { rank: 8, name: "Lisa Zhang", xp: 850, level: 3, streak: 6, badges: 3 },
]

const mockAchievements: Achievement[] = [
  {
    id: "first_quiz",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "🎯",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: "2024-01-15",
  },
  {
    id: "week_streak",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    rarity: "rare",
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    unlockedAt: "2024-01-20",
  },
  {
    id: "math_master",
    name: "Math Master",
    description: "Score 90% or higher in 10 math quizzes",
    icon: "🧮",
    rarity: "epic",
    progress: 6,
    maxProgress: 10,
    unlocked: false,
  },
  {
    id: "perfect_score",
    name: "Perfectionist",
    description: "Get a perfect score in any quiz",
    icon: "⭐",
    rarity: "rare",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: "2024-01-18",
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Answer 5 questions in under 10 seconds each",
    icon: "⚡",
    rarity: "epic",
    progress: 3,
    maxProgress: 5,
    unlocked: false,
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 100 quizzes",
    icon: "📚",
    rarity: "legendary",
    progress: 23,
    maxProgress: 100,
    unlocked: false,
  },
]

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "achievements">("leaderboard")
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("week")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8" />
          Leaderboard & Achievements
        </h1>
        <p className="text-muted-foreground">Compete with friends and unlock amazing achievements!</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "leaderboard" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("leaderboard")}
        >
          <Users className="h-4 w-4 mr-2" />
          Leaderboard
        </Button>
        <Button
          variant={activeTab === "achievements" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("achievements")}
        >
          <Award className="h-4 w-4 mr-2" />
          Achievements
        </Button>
      </div>

      {activeTab === "leaderboard" && (
        <>
          {/* Time Filter */}
          <div className="flex justify-center space-x-2">
            {["week", "month", "all"].map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter(filter as any)}
              >
                {filter === "week" ? "This Week" : filter === "month" ? "This Month" : "All Time"}
              </Button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-end space-x-4 mb-6">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-16 h-20 bg-gray-200 rounded-t-lg flex items-end justify-center pb-2">
                    <Medal className="h-8 w-8 text-gray-400" />
                  </div>
                  <Avatar className="mx-auto mt-2 mb-2">
                    <AvatarFallback>
                      {mockLeaderboard[1].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{mockLeaderboard[1].name}</div>
                  <div className="text-xs text-muted-foreground">{mockLeaderboard[1].xp} XP</div>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="w-16 h-24 bg-yellow-200 rounded-t-lg flex items-end justify-center pb-2">
                    <Crown className="h-8 w-8 text-yellow-500" />
                  </div>
                  <Avatar className="mx-auto mt-2 mb-2">
                    <AvatarFallback>
                      {mockLeaderboard[0].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{mockLeaderboard[0].name}</div>
                  <div className="text-xs text-muted-foreground">{mockLeaderboard[0].xp} XP</div>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-200 rounded-t-lg flex items-end justify-center pb-2">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <Avatar className="mx-auto mt-2 mb-2">
                    <AvatarFallback>
                      {mockLeaderboard[2].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{mockLeaderboard[2].name}</div>
                  <div className="text-xs text-muted-foreground">{mockLeaderboard[2].xp} XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center space-x-4 p-3 rounded-lg border ${
                      entry.isCurrentUser ? "bg-primary/10 border-primary/30" : "bg-muted/30"
                    }`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                    <Avatar>
                      <AvatarFallback>
                        {entry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {entry.level} • {entry.streak} day streak
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{entry.xp} XP</div>
                      <div className="text-xs text-muted-foreground">{entry.badges} badges</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-6">
          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {mockAchievements.filter((a) => a.unlocked).length}
                </div>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">{mockAchievements.length}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-chart-3">
                  {Math.round((mockAchievements.filter((a) => a.unlocked).length / mockAchievements.length) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.unlocked ? "bg-muted/30" : "opacity-75"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

                      {achievement.unlocked ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Star className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Unlocked {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
