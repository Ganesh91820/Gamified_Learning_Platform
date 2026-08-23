"use client"

import { useState, useEffect } from "react"

export interface QuizRecord {
  id: string
  subject: string
  score: number
  total: number
  accuracy: number
  pointsGained: number
  date: string
}

export interface StudentState {
  level: number
  xp: number
  xpToNext: number
  streak: number
  totalQuizzes: number
  accuracy: number
  coins: number
  badges: string[]
  ownedItems: string[]
  equippedItems: {
    avatar?: string
    theme?: string
  }
  claimedDailyDays: number[]
  quizHistory: QuizRecord[]
  seenQuestionKeys: string[]
}

const DEFAULT_STATE: StudentState = {
  level: 5,
  xp: 1250,
  xpToNext: 1500,
  streak: 7,
  totalQuizzes: 23,
  accuracy: 85,
  coins: 320,
  badges: ["Math Wizard", "Science Explorer", "Quick Learner"],
  ownedItems: ["badge_math_genius"],
  equippedItems: {},
  claimedDailyDays: [1, 2, 3],
  seenQuestionKeys: [],
  quizHistory: [
    { id: "1", subject: "Mathematics", score: 3, total: 4, accuracy: 75, pointsGained: 45, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "2", subject: "Science", score: 4, total: 4, accuracy: 100, pointsGained: 60, date: new Date(Date.now() - 86400000).toISOString() },
  ],
}

const STORAGE_KEY = "ai_learning_platform_student_state"

export function getStoredState(): StudentState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return {
        ...DEFAULT_STATE,
        ...parsed,
        seenQuestionKeys: parsed.seenQuestionKeys || [],
      }
    }
  } catch (e) {
    console.error("Failed to load state from localStorage", e)
  }
  return DEFAULT_STATE
}

export function saveStoredState(state: StudentState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event("student-state-updated"))
  } catch (e) {
    console.error("Failed to save state to localStorage", e)
  }
}

export function useStudentStore() {
  const [state, setState] = useState<StudentState>(DEFAULT_STATE)

  useEffect(() => {
    setState(getStoredState())
    const handleUpdate = () => setState(getStoredState())
    window.addEventListener("student-state-updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("student-state-updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const recordQuizResult = (subject: string, score: number, total: number, points: number) => {
    const accuracy = Math.round((score / total) * 100)
    const newRecord: QuizRecord = {
      id: Date.now().toString(),
      subject,
      score,
      total,
      accuracy,
      pointsGained: points,
      date: new Date().toISOString(),
    }

    const current = getStoredState()
    const newXp = current.xp + points
    const newCoins = current.coins + Math.round(points / 2)
    const newTotalQuizzes = current.totalQuizzes + 1
    
    // Recalculate average accuracy
    const allAccuracy = [...current.quizHistory.map(q => q.accuracy), accuracy]
    const avgAccuracy = Math.round(allAccuracy.reduce((a, b) => a + b, 0) / allAccuracy.length)
    
    // Calculate level up
    let level = current.level
    let xpToNext = current.xpToNext
    if (newXp >= xpToNext) {
      level += 1
      xpToNext = Math.round(xpToNext * 1.25)
    }

    // Check for new badges
    const badges = [...current.badges]
    if (accuracy === 100 && !badges.includes("Perfectionist")) {
      badges.push("Perfectionist")
    }
    if (newTotalQuizzes >= 25 && !badges.includes("Quiz Master")) {
      badges.push("Quiz Master")
    }

    const updated: StudentState = {
      ...current,
      xp: newXp,
      coins: newCoins,
      level,
      xpToNext,
      totalQuizzes: newTotalQuizzes,
      accuracy: avgAccuracy,
      badges,
      quizHistory: [newRecord, ...current.quizHistory],
    }

    saveStoredState(updated)
    return updated
  }

  const markQuestionsSeen = (keys: string[]) => {
    const current = getStoredState()
    const updatedSeen = Array.from(new Set([...current.seenQuestionKeys, ...keys]))
    // Keep max 150 recent seen keys
    const trimmed = updatedSeen.slice(-150)
    const updated: StudentState = {
      ...current,
      seenQuestionKeys: trimmed,
    }
    saveStoredState(updated)
  }

  const buyReward = (rewardId: string, cost: number): boolean => {
    const current = getStoredState()
    if (current.coins < cost || current.ownedItems.includes(rewardId)) {
      return false
    }

    const updated: StudentState = {
      ...current,
      coins: current.coins - cost,
      ownedItems: [...current.ownedItems, rewardId],
    }

    saveStoredState(updated)
    return true
  }

  const claimDailyReward = (day: number, rewardType: "xp" | "coins" | "item", amount?: number): boolean => {
    const current = getStoredState()
    if (current.claimedDailyDays.includes(day)) return false

    let newXp = current.xp
    let newCoins = current.coins

    if (rewardType === "xp" && amount) {
      newXp += amount
    } else if (rewardType === "coins" && amount) {
      newCoins += amount
    }

    const updated: StudentState = {
      ...current,
      xp: newXp,
      coins: newCoins,
      claimedDailyDays: [...current.claimedDailyDays, day],
    }

    saveStoredState(updated)
    return true
  }

  const equipItem = (type: "avatar" | "theme", itemId: string) => {
    const current = getStoredState()
    const updated: StudentState = {
      ...current,
      equippedItems: {
        ...current.equippedItems,
        [type]: itemId,
      },
    }
    saveStoredState(updated)
  }

  return {
    state,
    recordQuizResult,
    markQuestionsSeen,
    buyReward,
    claimDailyReward,
    equipItem,
  }
}
