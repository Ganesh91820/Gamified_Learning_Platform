"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Mail, User, LogIn, Sparkles, X, Loader2, Globe, ShieldCheck } from "lucide-react"
import { signInWithEmail, signUpWithEmail, signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  if (!isOpen) return null

  const isConfigured = isSupabaseConfigured()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.")
      return
    }

    setLoading(true)

    try {
      if (activeTab === "signup") {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your name.")
          setLoading(false)
          return
        }

        const { data, error } = await signUpWithEmail(email, password, fullName)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg("Account created! Check your email to confirm registration or sign in.")
          if (onAuthSuccess) onAuthSuccess()
        }
      } else {
        const { data, error } = await signInWithEmail(email, password)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg("Successfully signed in!")
          if (onAuthSuccess) onAuthSuccess()
          setTimeout(() => onClose(), 800)
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please try again.")
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/30 bg-background relative overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Student Cloud Login
            </CardTitle>
            <p className="text-xs text-muted-foreground">Sign in to save your coins, XP, and badges to the cloud</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {!isConfigured && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300">
              <div className="font-semibold mb-1 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Operating in Guest Mode
              </div>
              Supabase cloud credentials are not set yet. You can continue as a Guest or test the UI below.
            </div>
          )}

          {/* Mode Switcher Tabs */}
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
          <form onSubmit={handleEmailSubmit} className="space-y-3">
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
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
            {successMsg && <p className="text-xs text-green-600 font-medium">{successMsg}</p>}

            <Button type="submit" disabled={loading} className="w-full text-xs h-9">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : activeTab === "signup" ? (
                "Create Student Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Social & Guest Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={handleGoogleSignIn}
              disabled={loading || !isConfigured}
            >
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              Google OAuth
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={onClose}
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              Guest Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
