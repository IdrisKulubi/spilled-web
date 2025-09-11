-- Create email_list table
CREATE TABLE IF NOT EXISTS "email_list" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text,
  "status" text DEFAULT 'pending',
  "last_sent_at" timestamp,
  "sent_count" integer DEFAULT 0,
  "tags" text,
  "notes" text,
  "added_by" text REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS "email_campaigns" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "subject" text NOT NULL,
  "template" text DEFAULT 'onboarding',
  "total_emails" integer DEFAULT 0,
  "sent_emails" integer DEFAULT 0,
  "failed_emails" integer DEFAULT 0,
  "status" text DEFAULT 'draft',
  "started_at" timestamp,
  "completed_at" timestamp,
  "created_by" text REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create email_campaign_recipients table
CREATE TABLE IF NOT EXISTS "email_campaign_recipients" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" text NOT NULL REFERENCES "email_campaigns"("id"),
  "email_id" text NOT NULL REFERENCES "email_list"("id"),
  "status" text DEFAULT 'pending',
  "message_id" text,
  "error" text,
  "sent_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_email_list_status" ON "email_list"("status");
CREATE INDEX IF NOT EXISTS "idx_email_list_email" ON "email_list"("email");
CREATE INDEX IF NOT EXISTS "idx_campaigns_status" ON "email_campaigns"("status");
CREATE INDEX IF NOT EXISTS "idx_campaign_recipients_campaign" ON "email_campaign_recipients"("campaign_id");
CREATE INDEX IF NOT EXISTS "idx_campaign_recipients_email" ON "email_campaign_recipients"("email_id");
