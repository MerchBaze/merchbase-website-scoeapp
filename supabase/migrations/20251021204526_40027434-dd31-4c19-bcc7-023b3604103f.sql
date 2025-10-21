-- Add PDF and email tracking columns to assessments table
ALTER TABLE assessments 
ADD COLUMN pdf_url TEXT,
ADD COLUMN email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create storage bucket for assessment PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assessment-reports',
  'assessment-reports',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
);

-- Storage policies for assessment reports
CREATE POLICY "Public can read assessment reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'assessment-reports');

CREATE POLICY "Service role can upload assessment reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assessment-reports');

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  -- Organization
  category TEXT NOT NULL,
  tags TEXT[],
  author_name TEXT DEFAULT 'MerchBase Team',
  author_image_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  
  -- Affiliate
  affiliate_disclosure TEXT,
  affiliate_links JSONB
);

-- Indexes for blog posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
CREATE POLICY "Anyone can read published posts" 
ON blog_posts FOR SELECT 
USING (status = 'published');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_posts_updated_at();