-- Add imageUrl column to guys table if it doesn't exist
ALTER TABLE guys ADD COLUMN IF NOT EXISTS image_url text;

-- Create index for better performance if needed
CREATE INDEX IF NOT EXISTS idx_guys_image_url ON guys(image_url) WHERE image_url IS NOT NULL;
