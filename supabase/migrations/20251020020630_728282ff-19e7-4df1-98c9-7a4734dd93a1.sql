-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User info
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Website info
  website_url TEXT,
  website_age TEXT,
  satisfaction_score INTEGER,
  
  -- Goals & problems
  frustrations TEXT[], -- array of selected frustrations
  primary_goal TEXT,
  
  -- Competition
  competitors_better BOOLEAN,
  lost_business BOOLEAN,
  
  -- Budget & timeline
  budget_range TEXT,
  timeline TEXT,
  
  -- AI Analysis Results
  analysis_complete BOOLEAN DEFAULT FALSE,
  overall_score INTEGER, -- 0-100
  performance_score INTEGER,
  design_score INTEGER,
  seo_score INTEGER,
  mobile_score INTEGER,
  analysis_summary TEXT,
  recommendations JSONB -- array of recommendation objects
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can insert their own assessment (no auth required for this use case)
CREATE POLICY "Anyone can insert assessments"
ON public.assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy: Anyone can read assessments by ID (for viewing results page)
CREATE POLICY "Anyone can read assessments by id"
ON public.assessments
FOR SELECT
TO anon, authenticated
USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON public.assessments(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);