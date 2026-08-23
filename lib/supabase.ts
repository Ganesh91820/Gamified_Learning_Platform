import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-ref")
  )
}

// Client-side Supabase instance using ANON key ONLY
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!supabase) return { error: { message: "Cloud Auth disabled. Operating in Guest Mode." } }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { error: { message: "Cloud Auth disabled. Operating in Guest Mode." } }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signInWithGoogle() {
  if (!supabase) return { error: { message: "Cloud Auth disabled. Operating in Guest Mode." } }
  
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/`,
    },
  })
  return { data, error }
}

export async function signOutUser() {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (e) {
    return null
  }
}

export async function fetchCloudProfile() {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error || !data) return null
    return data
  } catch (e) {
    return null
  }
}

export async function recordQuizCloudSubmission(
  subject: string,
  score: number,
  total: number,
  pointsGained: number
) {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Execute atomic, anti-tamper RPC function on Supabase PostgreSQL
    const { data, error } = await supabase.rpc("record_quiz_submission", {
      p_subject: subject,
      p_score: score,
      p_total: total,
      p_points_gained: pointsGained,
    })

    if (error) {
      console.warn("Cloud quiz recording fallback to RLS direct insert:", error.message)
      // Fallback insert to quiz_results if RPC function not created yet
      const accuracy = Math.round((score / total) * 100)
      await supabase.from("quiz_results").insert({
        user_id: user.id,
        subject,
        score,
        total,
        accuracy,
        points_gained: pointsGained,
      })
    }

    return data
  } catch (e) {
    console.error("Failed to record cloud quiz submission", e)
    return null
  }
}
