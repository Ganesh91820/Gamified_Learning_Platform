"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Play, Brain, Trophy, Gift, Users, BarChart3, TrendingUp, LogIn, Cloud, User, LogOut } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { getCurrentUser, signOutUser, isSupabaseConfigured } from "@/lib/supabase"

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

  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUser(user))
  }, [])

  const handleSignOut = async () => {
    await signOutUser()
    setCurrentUser(null)
  }

  const isConfigured = isSupabaseConfigured()

  return (
    <>
      {/* Top Header Bar for Cloud Sync & Auth */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-semibold text-primary border-primary/30">
            AI Learning Platform
          </Badge>
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1 text-[10px]">
            <Cloud className="h-3 w-3 text-primary" />
            {currentUser ? `Cloud Synced: ${currentUser.email}` : isConfigured ? "Cloud Ready" : "Guest Mode"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-medium text-muted-foreground">
                {currentUser.user_metadata?.full_name || currentUser.email}
              </span>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleSignOut}>
                <LogOut className="h-3 w-3" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" className="h-7 text-xs gap-1" onClick={() => setIsAuthOpen(true)}>
              <LogIn className="h-3 w-3" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Floating Bottom Nav */}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={() => {
          getCurrentUser().then((user) => setCurrentUser(user))
        }}
      />
    </>
  )
}
