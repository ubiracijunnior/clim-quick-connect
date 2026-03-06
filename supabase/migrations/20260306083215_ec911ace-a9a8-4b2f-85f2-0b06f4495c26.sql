
-- Create storage bucket for quiz uploads (appliance label photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-uploads', 'quiz-uploads', true);

-- Allow anyone to upload files to the quiz-uploads bucket
CREATE POLICY "Anyone can upload quiz files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quiz-uploads');

-- Allow anyone to read quiz upload files (public bucket)
CREATE POLICY "Anyone can read quiz files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'quiz-uploads');

-- Allow anyone to delete their uploads (for replace functionality)
CREATE POLICY "Anyone can delete quiz files"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'quiz-uploads');
