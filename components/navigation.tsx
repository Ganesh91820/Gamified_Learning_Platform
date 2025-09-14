"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Play, Brain, Trophy, Gift, Users, BarChart3, TrendingUp } from "lucide-react"

const studentNavItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/quiz", icon: Play, label: "Quiz" },
  { href: "/analysis", icon: Brain, label: "AI Analysis" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/rewards", icon: Gift, label: "Rewards" },
]

const teacherNavItems = [
  { href: "/teacher", icon: BarChart3, label: "Teacher Dashboard" },
  { href: "/", icon: Users, label: "Student View" },
]

export function Navigation() {
  const pathname = usePathname()
  const isTeacherView = pathname.startsWith("/teacher")

  const navItems = isTeacherView ? teacherNavItems : studentNavItems

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-fit">
      <CardContent className="p-2">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex flex-col h-12 w-16 p-1">
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
