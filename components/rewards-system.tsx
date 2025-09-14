"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Zap, Gem, Calendar, Trophy } from "lucide-react"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: "avatar" | "badge" | "theme" | "power-up"
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: string
  owned: boolean
}

interface DailyReward {
  day: number
  reward: string
  claimed: boolean
  type: "xp" | "coins" | "item"
  amount?: number
}

const mockRewards: Reward[] = [
  {
    id: "avatar_scientist",
    name: "Scientist Avatar",
    description: "Show your love for science!",
    cost: 100,
    type: "avatar",
    rarity: "common",
    icon: "🧪",
    owned: false,
  },
  {
    id: "badge_math_genius",
    name: "Math Genius Badge",
    description: "Display your mathematical prowess",
    cost: 250,
    type: "badge",
    rarity: "rare",
    icon: "🧮",
    owned: true,
  },
  {
    id: "theme_space",
    name: "Space Theme",
    description: "Transform your dashboard with a cosmic theme",
    cost: 500,
    type: "theme",
    rarity: "epic",
    icon: "🚀",
    owned: false,
  },
  {
    id: "powerup_double_xp",
    name: "Double XP Boost",
    description: "Earn 2x XP for the next 3 quizzes",
    cost: 150,
    type: "power-up",
    rarity: "rare",
    icon: "⚡",
    owned: false,
  },
  {
    id: "avatar_crown",
    name: "Golden Crown Avatar",
    description: "Show everyone you're royalty!",
    cost: 1000,
    type: "avatar",
    rarity: "legendary",
    icon: "👑",
    owned: false,
  },
]

const mockDailyRewards: DailyReward[] = [
  { day: 1, reward: "50 XP", claimed: true, type: "xp", amount: 50 },
  { day: 2, reward: "25 Coins", claimed: true, type: "coins", amount: 25 },
  { day: 3, reward: "75 XP", claimed: true, type: "xp", amount: 75 },
  { day: 4, reward: "Speed Boost", claimed: false, type: "item" },
  { day: 5, reward: "100 XP", claimed: false, type: "xp", amount: 100 },
  { day: 6, reward: "50 Coins", claimed: false, type: "coins", amount: 50 },
  { day: 7, reward: "Mystery Box", claimed: false, type: "item" },
]

export function RewardsSystem() {
  const [activeTab, setActiveTab] = useState<"shop" | "daily" | "inventory">("shop")
  const [coins, setCoins] = useState(320)
  const [currentStreak, setCurrentStreak] = useState(3)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-300"
      case "rare":
        return "text-blue-600 border-blue-300"
      case "epic":
        return "text-purple-600 border-purple-300"
      case "legendary":
        return "text-yellow-600 border-yellow-300"
      default:
        return "text-gray-600 border-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "avatar":
        return "👤"
      case "badge":
        return "🏆"
      case "theme":
        return "🎨"
      case "power-up":
        return "⚡"
      default:
        return "🎁"
    }
  }

  const handlePurchase = (reward: Reward) => {
    if (coins >= reward.cost && !reward.owned) {
      setCoins(coins - reward.cost)
      // In a real app, this would update the backend
      console.log(`Purchased ${reward.name}`)
    }
  }

  const claimDailyReward = (day: number) => {
    const reward = mockDailyRewards.find((r) => r.day === day)
    if (reward && !reward.claimed && day <= currentStreak + 1) {
      reward.claimed = true
      if (reward.type === "coins" && reward.amount) {
        setCoins(coins + reward.amount)
      }
      console.log(`Claimed day ${day} reward: ${reward.reward}`)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Gift className="h-8 w-8" />
          Rewards & Shop
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Gem className="h-4 w-4 text-primary" />
            <span className="font-medium">{coins} Coins</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="font-medium">{currentStreak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "shop" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("shop")}
        >
          <Gift className="h-4 w-4 mr-2" />
          Shop
        </Button>
        <Button
          variant={activeTab === "daily" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("daily")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Daily Rewards
        </Button>
        <Button
          variant={activeTab === "inventory" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("inventory")}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Inventory
        </Button>
      </div>

      {activeTab === "shop" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward Shop</CardTitle>
              <p className="text-sm text-muted-foreground">Spend your hard-earned coins on amazing rewards!</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRewards.map((reward) => (
                  <Card key={reward.id} className={`${reward.owned ? "opacity-60" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{reward.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{reward.name}</h3>
                            <Badge variant="outline" className={`text-xs ${getRarityColor(reward.rarity)}`}>
                              {reward.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Gem className="h-4 w-4 text-primary" />
                              <span className="font-medium">{reward.cost} coins</span>
                            </div>
                            <Button
                              size="sm"
                              disabled={reward.owned || coins < reward.cost}
                              onClick={() => handlePurchase(reward)}
                            >
                              {reward.owned ? "Owned" : "Buy"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "daily" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Login Rewards
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Login every day to claim amazing rewards! Current streak: {currentStreak} days
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-3">
                {mockDailyRewards.map((reward) => (
                  <Card
                    key={reward.day}
                    className={`text-center cursor-pointer transition-all ${
                      reward.claimed
                        ? "bg-green-50 border-green-200"
                        : reward.day <= currentStreak + 1
                          ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                          : "opacity-50"
                    }`}
                    onClick={() => claimDailyReward(reward.day)}
                  >
                    <CardContent className="p-3">
                      <div className="text-lg font-bold mb-1">Day {reward.day}</div>
                      <div className="text-2xl mb-2">
                        {reward.type === "xp" ? "⭐" : reward.type === "coins" ? "💰" : "🎁"}
                      </div>
                      <div className="text-xs font-medium">{reward.reward}</div>
                      {reward.claimed && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Claimed
                        </Badge>
                      )}
                      {!reward.claimed && reward.day <= currentStreak + 1 && (
                        <Button size="sm" className="mt-2 text-xs">
                          Claim
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Streak Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                Streak Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Streak</span>
                  <span>{currentStreak} days</span>
                </div>
                <Progress value={(currentStreak / 7) * 100} className="h-3" />
                <div className="text-sm text-muted-foreground">Keep your streak alive to unlock better rewards!</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Collection</CardTitle>
              <p className="text-sm text-muted-foreground">Items you've earned and purchased</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRewards
                  .filter((reward) => reward.owned)
                  .map((reward) => (
                    <Card key={reward.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{reward.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className={`text-xs mt-2 ${getRarityColor(reward.rarity)}`}>
                              {reward.rarity}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            Equip
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {mockRewards.filter((reward) => reward.owned).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No items in your collection yet.</p>
                  <p className="text-sm">Complete quizzes and visit the shop to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
