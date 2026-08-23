"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { StudentDashboard } from "@/components/student-dashboard"
import { getCurrentUser } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Home() {
  const [showDashboard, setShowDashboard] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      if (u) setShowDashboard(true)
    })
  }, [])

  if (!showDashboard && !user) {
    return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-5xl flex justify-between items-center pt-10">
        <Button variant="ghost" size="sm" onClick={() => setShowDashboard(false)} className="text-xs text-muted-foreground gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Welcome Page
        </Button>
      </div>
      <StudentDashboard />
    </main>
  )
}
