-- Add batch column to email_list to support 50-sized grouping
ALTER TABLE "email_list" ADD COLUMN IF NOT EXISTS "batch" text;

-- Create index for batch queries
CREATE INDEX IF NOT EXISTS "idx_email_list_batch" ON "email_list"("batch");
