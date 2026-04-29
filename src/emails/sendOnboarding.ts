import { render } from '@react-email/components';
import * as React from 'react';
import { resend, EMAIL_CONFIG, formatSender, delay, retryWithBackoff, type BatchEmailResult, type EmailResult } from './resend';
import OnboardingEmail from './templates/OnboardingEmail';

// Email configuration
const SUBJECT = "We made StrathSpace better 👀";
const BATCH_SIZE = 10; // Process emails in batches to optimize performance

// Type definitions
export interface SendOnboardingOptions {
  batchSize?: number;
  dryRun?: boolean;
  onProgress?: (current: number, total: number, email: string) => void;
  onError?: (email: string, error: string) => void;
  onSuccess?: (email: string, messageId?: string) => void;
  /** When true (recommended for UI campaigns), failed recipients are retried until all succeed or maxRetryRounds is reached. */
  retryUntilAllSent?: boolean;
  /** Maximum send waves (first attempt + retries). Default 12. */
  maxRetryRounds?: number;
  /** Base delay between retry waves; multiplied by min(round, 5). Default 2500ms. */
  retryRoundDelayMs?: number;
}

/**
 * Validates and sanitizes email addresses
 * - Removes duplicates
 * - Validates email format
 * - Normalizes to lowercase
 */
function sanitizeEmails(emails: string[]): string[] {
  const deduped = new Set<string>();
  const invalidEmails: string[] = [];
  
  for (const email of emails) {
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed) continue;
    
    // More comprehensive email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) {
      deduped.add(trimmed);
    } else {
      invalidEmails.push(email);
    }
  }
  
  if (invalidEmails.length > 0) {
    console.warn(`⚠️ Skipped ${invalidEmails.length} invalid emails:`, invalidEmails.slice(0, 5));
  }
  
  return Array.from(deduped);
}

/**
 * Sends a single onboarding email with retry logic
 */
async function sendSingleEmail(
  to: string,
  name?: string,
  options?: SendOnboardingOptions
): Promise<EmailResult> {
  try {
    // Render the email template
    const html = await render(
      React.createElement(OnboardingEmail, {
        recipientEmail: to,
        recipientName: name || ''
      }),
      { pretty: true }
    );

    const firstName = name ? name.trim().split(' ')[0] : 'bestie';
    const text = `Hey ${firstName}! 👋

You're invited to join Spilled - a safe, private community for women to share dating experiences.

As one of the first members, you'll get:
✨ The exclusive "OG Spiller" badge
🔮 Early access to new features
💬 Priority in community decisions

Join now: https://spilledforwomen.com?ref=invite&email=${encodeURIComponent(to)}

With love,
The Spilled Team 💕`;

    // Skip actual sending in dry run mode
    if (options?.dryRun) {
      console.log(`[DRY RUN] Would send to: ${to}`);
      return { success: true, email: to, messageId: 'dry-run' };
    }

    // Send email with retry logic
    const send = async () => {
      const { data, error } = await resend.emails.send({
        from: formatSender(EMAIL_CONFIG.from.name, EMAIL_CONFIG.from.email),
        to,
        subject: SUBJECT,
        html,
        text,
        reply_to: EMAIL_CONFIG.replyTo,
        tags: [
          { name: 'campaign', value: 'onboarding' },
          { name: 'type', value: 'invitation' },
        ],
      } as any);

      if (error) throw error;
      return data;
    };

    const data = await retryWithBackoff(send);
    const messageId = (data as any)?.id;
    
    options?.onSuccess?.(to, messageId);
    return { success: true, email: to, messageId };
    
  } catch (err: any) {
    const errorMessage = err?.message || err?.toString() || JSON.stringify(err);
    console.error(`❌ Failed for ${to}:`, err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      full: err
    });
    options?.onError?.(to, errorMessage);
    return { success: false, email: to, error: errorMessage };
  }
}

/**
 * Sends onboarding emails to a list of recipients
 * Features:
 * - Batch processing for performance
 * - Automatic retry with exponential backoff
 * - Rate limiting to avoid API limits
 * - Progress tracking
 * - Comprehensive error handling
 */
export async function sendOnboardingEmails(
  emails: Array<string | { email: string; name?: string }>,
  options?: SendOnboardingOptions
): Promise<BatchEmailResult> {
  // Normalize input and extract emails and names
  const normalizedRecipients = emails.map(e => {
    if (typeof e === 'string') {
      return { email: e, name: undefined };
    }
    return e;
  });
  
  // Validate and sanitize emails
  const emailAddresses = normalizedRecipients.map(r => r.email);
  const sanitizedEmails = sanitizeEmails(emailAddresses);
  
  // Match sanitized emails back to their names
  const recipients = sanitizedEmails.map(email => {
    const original = normalizedRecipients.find(r => r.email.toLowerCase() === email);
    return { email, name: original?.name };
  });
  
  if (recipients.length === 0) {
    console.warn('⚠️ No valid emails to send');
    return {
      sent: [],
      failed: [],
      total: 0,
      successCount: 0,
      failureCount: 0,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`📧 Starting to send ${recipients.length} onboarding emails...`);
    if (options?.dryRun) {
      console.log('🔍 DRY RUN MODE - No emails will actually be sent');
    }
  }

  const batchSize = options?.batchSize || BATCH_SIZE;
  const retryUntilAllSent = options?.retryUntilAllSent === true;
  const maxRetryRounds = Math.max(
    1,
    options?.maxRetryRounds ?? (retryUntilAllSent ? 12 : 1)
  );
  const retryRoundDelayMs = options?.retryRoundDelayMs ?? 2500;

  const recipientByEmail = new Map(
    recipients.map((r) => [r.email, r.name] as const)
  );

  async function sendRecipientRound(
    roundRecipients: { email: string; name?: string }[],
    totalForProgress: number
  ): Promise<EmailResult[]> {
    const roundResults: EmailResult[] = [];
    for (let i = 0; i < roundRecipients.length; i += batchSize) {
      const batch = roundRecipients.slice(
        i,
        Math.min(i + batchSize, roundRecipients.length)
      );
      const batchPromises = batch.map(async (recipient, index) => {
        const currentIndex = i + index + 1;
        options?.onProgress?.(currentIndex, totalForProgress, recipient.email);
        const result = await sendSingleEmail(
          recipient.email,
          recipient.name,
          options
        );
        if (index < batch.length - 1) {
          await delay(EMAIL_CONFIG.rateLimit.delayMs);
        }
        return result;
      });
      const batchResults = await Promise.all(batchPromises);
      roundResults.push(...batchResults);
      if (i + batchSize < roundRecipients.length) {
        await delay(EMAIL_CONFIG.rateLimit.delayMs * 2);
      }
    }
    return roundResults;
  }

  let pending = [...recipients];
  const latestByEmail = new Map<string, EmailResult>();
  const totalRecipients = recipients.length;

  for (let round = 1; round <= maxRetryRounds && pending.length > 0; round++) {
    if (round > 1) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `📧 Retry wave ${round}/${maxRetryRounds}: ${pending.length} recipient(s) still failing`
        );
      }
    }

    const roundResults = await sendRecipientRound(pending, totalRecipients);
    for (const r of roundResults) {
      latestByEmail.set(r.email, r);
    }

    pending = roundResults
      .filter((r) => !r.success)
      .map((r) => ({
        email: r.email,
        name: recipientByEmail.get(r.email),
      }));

    if (pending.length === 0) break;
    if (round < maxRetryRounds) {
      const wait = retryRoundDelayMs * Math.min(round, 5);
      await delay(wait);
    }
  }

  const results = recipients.map((r) => latestByEmail.get(r.email)!);

  const sent = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  const summary: BatchEmailResult = {
    sent,
    failed,
    total: results.length,
    successCount: sent.length,
    failureCount: failed.length,
  };

  // Log summary in non-production only
  if (process.env.NODE_ENV !== 'production') {
    if (summary.failureCount > 0) {
      console.log(`❌ Failed: ${summary.failureCount}`);
      console.log('Failed emails:', failed.map(f => f.email));
    }
  }

  return summary;
}

/**
 * Convenience function to send a single onboarding email
 */
export async function sendSingleOnboardingEmail(
  email: string,
  options?: SendOnboardingOptions
): Promise<EmailResult> {
  const sanitized = sanitizeEmails([email]);
  
  if (sanitized.length === 0) {
    return {
      success: false,
      email,
      error: 'Invalid email address',
    };
  }
  
  return sendSingleEmail(sanitized[0], undefined, options);
}

