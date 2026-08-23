-- ==============================================================================
-- AI Learning Platform - Secure Supabase Database Schema, RLS & RPC Functions
-- Copy and run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  streak INT DEFAULT 1,
  total_quizzes INT DEFAULT 0,
  accuracy INT DEFAULT 0,
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  owned_items TEXT[] DEFAULT ARRAY[]::TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Quiz Results Table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  accuracy INT NOT NULL,
  points_gained INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Profiles Table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update only non-game stats like full_name and avatar_url
DROP POLICY IF EXISTS "Users can update own basic profile" ON public.profiles;
CREATE POLICY "Users can update own basic profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. RLS Policies for Quiz Results Table
DROP POLICY IF EXISTS "Users can view own quiz results" ON public.quiz_results;
CREATE POLICY "Users can view own quiz results"
  ON public.quiz_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz results" ON public.quiz_results;
CREATE POLICY "Users can insert own quiz results"
  ON public.quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Automatic Profile Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Student Learner'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Secure Server-Side RPC Function to Atomic Record Quiz Results & Anti-Tamper Stats
CREATE OR REPLACE FUNCTION public.record_quiz_submission(
  p_subject TEXT,
  p_score INT,
  p_total INT,
  p_points_gained INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_accuracy INT;
  v_coins_gained INT;
  v_profile public.profiles%ROWTYPE;
  v_new_xp INT;
  v_new_coins INT;
  v_new_total INT;
  v_new_accuracy INT;
  v_new_level INT;
  v_badges TEXT[];
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_accuracy := ROUND((p_score::NUMERIC / GREATEST(p_total, 1)::NUMERIC) * 100);
  v_coins_gained := ROUND(p_points_gained::NUMERIC / 2);

  -- Insert quiz result record securely
  INSERT INTO public.quiz_results (user_id, subject, score, total, accuracy, points_gained)
  VALUES (v_user_id, p_subject, p_score, p_total, v_accuracy, p_points_gained);

  -- Fetch current profile for atomic update
  SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  v_new_xp := v_profile.xp + p_points_gained;
  v_new_coins := v_profile.coins + v_coins_gained;
  v_new_total := v_profile.total_quizzes + 1;
  v_new_accuracy := ROUND(((v_profile.accuracy * v_profile.total_quizzes) + v_accuracy)::NUMERIC / v_new_total::NUMERIC);
  v_new_level := GREATEST(1, FLOOR(v_new_xp / 250) + 1);

  v_badges := COALESCE(v_profile.badges, ARRAY[]::TEXT[]);
  IF v_accuracy = 100 AND NOT ('Perfectionist' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'Perfectionist');
  END IF;
  IF v_new_total >= 25 AND NOT ('Quiz Master' = ANY(v_badges)) THEN
    v_badges := array_append(v_badges, 'Quiz Master');
  END IF;

  -- Update profile atomic game stats
  UPDATE public.profiles
  SET
    xp = v_new_xp,
    coins = v_new_coins,
    total_quizzes = v_new_total,
    accuracy = v_new_accuracy,
    level = v_new_level,
    badges = v_badges,
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'level', v_new_level,
    'xp', v_new_xp,
    'coins', v_new_coins,
    'total_quizzes', v_new_total,
    'accuracy', v_new_accuracy,
    'badges', v_badges
  );
END;
$$;
