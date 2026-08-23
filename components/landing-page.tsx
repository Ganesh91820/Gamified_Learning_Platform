"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Trophy, ShieldCheck, Mail, Lock, User, LogIn, Globe, ArrowRight, Play, CheckCircle2, Zap, HelpCircle, BookOpen } from "lucide-react"
import { signInWithEmail, signUpWithEmail, signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase"

interface LandingPageProps {
  onEnterDashboard: () => void
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [showAuthCard, setShowAuthCard] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const isConfigured = isSupabaseConfigured()

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.")
      return
    }

    setLoading(true)

    try {
      if (activeTab === "signup") {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your full name.")
          setLoading(false)
          return
        }
        const { error } = await signUpWithEmail(email, password, fullName)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg("Account created! Check your email to confirm registration or sign in.")
        }
      } else {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg("Signed in successfully!")
          setTimeout(() => onEnterDashboard(), 500)
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg("")
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background text-foreground flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center py-3 border-b mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
          <span className="font-bold text-lg text-primary">AI Learning Platform</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowAuthCard(!showAuthCard)} className="text-xs gap-1">
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </Button>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-10 text-center py-4">
        {/* Main Hero Section */}
        <div className="space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/30 py-1 px-3 text-xs font-semibold">
            ✨ Free Gamified AI Education for Everyone
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-3xl mx-auto">
            Learn Anything, Earn Rewards & Master Subjects with <span className="text-primary">AI</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            An easy, interactive learning app. Take fun quizzes, generate custom AI topics, get 24/7 AI tutor help, and collect XP & badges!
          </p>

          {/* PRIMARY ACTION BUTTON: Start Learning Free / Explore as Guest */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              size="lg"
              onClick={onEnterDashboard}
              className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-700 shadow-xl gap-3 text-primary-foreground"
            >
              <Play className="h-5 w-5 fill-current" />
              Start Learning Free (Guest Mode)
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            No credit card or registration required to start learning!
          </div>
        </div>

        {/* 3-STEP HOW IT WORKS SECTION */}
        <div className="py-6 border-t border-b">
          <h2 className="text-xl font-bold text-center mb-6 text-foreground">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card className="p-5 border-primary/20 bg-background/80 relative overflow-hidden">
              <div className="text-3xl font-extrabold text-primary/20 absolute right-4 top-3">01</div>
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-sm text-foreground">1. Choose a Topic</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Select from core subjects like Math and Science, or type ANY custom topic for Gemini AI to generate.
              </p>
            </Card>

            <Card className="p-5 border-secondary/20 bg-background/80 relative overflow-hidden">
              <div className="text-3xl font-extrabold text-secondary/20 absolute right-4 top-3">02</div>
              <Brain className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-bold text-sm text-foreground">2. Take an AI Quiz</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Answer interactive timed questions with instant step-by-step explanations and 24/7 AI Tutor hints.
              </p>
            </Card>

            <Card className="p-5 border-amber-500/20 bg-background/80 relative overflow-hidden">
              <div className="text-3xl font-extrabold text-amber-500/20 absolute right-4 top-3">03</div>
              <Trophy className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-sm text-foreground">3. Earn XP & Track Progress</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Earn coins, level up, unlock achievement badges, and view dynamic AI performance reports.
              </p>
            </Card>
          </div>
        </div>

        {/* Optional Auth Section (Expandable or Below) */}
        {showAuthCard && (
          <div className="max-w-md mx-auto pt-2 text-left">
            <Card className="shadow-2xl border-primary/40 bg-background">
              <CardHeader className="pb-3 border-b bg-primary/5">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Sign In to Sync Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {!isConfigured && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 shrink-0 text-blue-500" />
                    <span>Account sync will be available soon. Start learning right now in free Guest Mode!</span>
                  </div>
                )}

                {/* Tab Switcher */}
                <div className="flex bg-muted p-1 rounded-lg text-xs font-semibold">
                  <Button
                    type="button"
                    variant={activeTab === "signin" ? "default" : "ghost"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setActiveTab("signin")
                      setErrorMsg("")
                      setSuccessMsg("")
                    }}
                  >
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    variant={activeTab === "signup" ? "default" : "ghost"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setActiveTab("signup")
                      setErrorMsg("")
                      setSuccessMsg("")
                    }}
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    Create Account
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {activeTab === "signup" && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Full Name:</label>
                      <div className="relative">
                        <User className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Alex Johnson"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Email Address:</label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Password:</label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background"
                      />
                    </div>
                  </div>

                  {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
                  {successMsg && <p className="text-xs text-green-600 font-medium">{successMsg}</p>}

                  <Button type="submit" disabled={loading || !isConfigured} className="w-full text-xs h-9 font-semibold">
                    {loading ? "Processing..." : activeTab === "signup" ? "Create Account" : "Sign In"}
                  </Button>
                </form>

                {isConfigured && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8 gap-1.5"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Globe className="h-3.5 w-3.5 text-blue-500" />
                    Sign in with Google
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Simple Footer */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-muted-foreground pt-6 border-t">
        AI Learning Platform • Empowering Students Everywhere
      </div>
    </div>
  )
}
