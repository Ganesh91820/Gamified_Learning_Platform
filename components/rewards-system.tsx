"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Zap, Gem, Calendar, Trophy, Check } from "lucide-react"
import { useStudentStore } from "@/lib/store"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: "avatar" | "badge" | "theme" | "power-up"
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: string
}

interface DailyReward {
  day: number
  reward: string
  type: "xp" | "coins" | "item"
  amount?: number
}

const REWARDS_CATALOG: Reward[] = [
  {
    id: "avatar_scientist",
    name: "Scientist Avatar",
    description: "Show your love for science!",
    cost: 100,
    type: "avatar",
    rarity: "common",
    icon: "🧪",
  },
  {
    id: "badge_math_genius",
    name: "Math Genius Badge",
    description: "Display your mathematical prowess",
    cost: 250,
    type: "badge",
    rarity: "rare",
    icon: "🧮",
  },
  {
    id: "theme_space",
    name: "Space Theme",
    description: "Transform your dashboard with a cosmic theme",
    cost: 500,
    type: "theme",
    rarity: "epic",
    icon: "🚀",
  },
  {
    id: "powerup_double_xp",
    name: "Double XP Boost",
    description: "Earn 2x XP for the next 3 quizzes",
    cost: 150,
    type: "power-up",
    rarity: "rare",
    icon: "⚡",
  },
  {
    id: "avatar_crown",
    name: "Golden Crown Avatar",
    description: "Show everyone you're royalty!",
    cost: 1000,
    type: "avatar",
    rarity: "legendary",
    icon: "👑",
  },
]

const DAILY_REWARDS_SCHEDULE: DailyReward[] = [
  { day: 1, reward: "50 XP", type: "xp", amount: 50 },
  { day: 2, reward: "25 Coins", type: "coins", amount: 25 },
  { day: 3, reward: "75 XP", type: "xp", amount: 75 },
  { day: 4, reward: "Speed Boost", type: "item" },
  { day: 5, reward: "100 XP", type: "xp", amount: 100 },
  { day: 6, reward: "50 Coins", type: "coins", amount: 50 },
  { day: 7, reward: "Mystery Box", type: "item" },
]

export function RewardsSystem() {
  const { state: studentState, buyReward, claimDailyReward, equipItem } = useStudentStore()
  const [activeTab, setActiveTab] = useState<"shop" | "daily" | "inventory">("shop")

  const coins = studentState.coins
  const currentStreak = studentState.streak

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

  const handlePurchase = (reward: Reward) => {
    buyReward(reward.id, reward.cost)
  }

  const handleClaimDaily = (reward: DailyReward) => {
    claimDailyReward(reward.day, reward.type, reward.amount)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Gift className="h-8 w-8 text-yellow-500" />
          Rewards & Shop
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-950 px-3 py-1 rounded-full text-yellow-800 dark:text-yellow-300">
            <Gem className="h-4 w-4 text-yellow-600" />
            <span className="font-bold">{coins} Coins</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-950 px-3 py-1 rounded-full text-orange-800 dark:text-orange-300">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="font-bold">{currentStreak} Day Streak</span>
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
          Inventory ({studentState.ownedItems.length})
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
                {REWARDS_CATALOG.map((reward) => {
                  const isOwned = studentState.ownedItems.includes(reward.id)
                  const canAfford = coins >= reward.cost

                  return (
                    <Card key={reward.id} className={`${isOwned ? "opacity-75 bg-muted/30" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl p-2 bg-muted rounded-lg">{reward.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{reward.name}</h3>
                              <Badge variant="outline" className={`text-xs ${getRarityColor(reward.rarity)}`}>
                                {reward.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 font-bold text-yellow-600">
                                <Gem className="h-4 w-4" />
                                <span>{reward.cost} coins</span>
                              </div>
                              <Button
                                size="sm"
                                disabled={isOwned || !canAfford}
                                onClick={() => handlePurchase(reward)}
                              >
                                {isOwned ? "Owned" : canAfford ? "Buy" : "Need Coins"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
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
                Login every day to claim rewards! Current streak: {currentStreak} days
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {DAILY_REWARDS_SCHEDULE.map((item) => {
                  const isClaimed = studentState.claimedDailyDays.includes(item.day)
                  const canClaim = !isClaimed && item.day <= currentStreak + 1

                  return (
                    <Card
                      key={item.day}
                      className={`text-center transition-all ${
                        isClaimed
                          ? "bg-green-50 border-green-300 dark:bg-green-950/30"
                          : canClaim
                            ? "bg-primary/10 border-primary/40 hover:bg-primary/20"
                            : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="text-xs font-bold mb-1">Day {item.day}</div>
                        <div className="text-2xl mb-2">
                          {item.type === "xp" ? "⭐" : item.type === "coins" ? "💰" : "🎁"}
                        </div>
                        <div className="text-xs font-medium">{item.reward}</div>
                        {isClaimed ? (
                          <Badge variant="secondary" className="mt-2 text-xs bg-green-200 text-green-800 gap-1">
                            <Check className="h-3 w-3" /> Claimed
                          </Badge>
                        ) : canClaim ? (
                          <Button size="sm" className="mt-2 text-xs w-full h-7" onClick={() => handleClaimDaily(item)}>
                            Claim
                          </Button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground block mt-2">Locked</span>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Streak Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Streak Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Streak</span>
                  <span className="font-bold">{currentStreak} days</span>
                </div>
                <Progress value={(currentStreak / 7) * 100} className="h-3" />
                <div className="text-sm text-muted-foreground">Keep your streak alive to unlock bonus coins!</div>
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
              <p className="text-sm text-muted-foreground">Items you've earned and unlocked</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REWARDS_CATALOG.filter((reward) => studentState.ownedItems.includes(reward.id)).map((reward) => {
                  const isEquipped = studentState.equippedItems.avatar === reward.id || studentState.equippedItems.theme === reward.id

                  return (
                    <Card key={reward.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl p-2 bg-muted rounded-lg">{reward.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className={`text-xs mt-2 ${getRarityColor(reward.rarity)}`}>
                              {reward.rarity}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant={isEquipped ? "default" : "outline"}
                            onClick={() => equipItem(reward.type === "avatar" ? "avatar" : "theme", reward.id)}
                          >
                            {isEquipped ? "Equipped" : "Equip"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              {studentState.ownedItems.length === 0 && (
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
