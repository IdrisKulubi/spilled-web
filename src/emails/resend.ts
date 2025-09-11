import { Resend } from 'resend';

// Initialize Resend client - require a real API key
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set. Please add it to .env.local');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    name: 'StrathSpace Team', 
    email: process.env.RESEND_FROM_EMAIL || 'hello@strathspace.com',
  },
  replyTo: process.env.RESEND_REPLY_TO || 'support@strathspace.com',
  // Rate limiting configuration
  rateLimit: {
    maxPerSecond: 10, // Resend's default rate limit
    delayMs: 100, // Delay between emails in milliseconds
  },
  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000, // Initial delay, will be multiplied by attempt number
  },
};

// Type definitions
export interface EmailResult {
  success: boolean;
  email: string;
  messageId?: string;
  error?: string;
}

export interface BatchEmailResult {
  sent: EmailResult[];
  failed: EmailResult[];
  total: number;
  successCount: number;
  failureCount: number;
}

// Utility function to format sender
export function formatSender(name?: string, email?: string): string {
  const senderName = name || EMAIL_CONFIG.from.name;
  const senderEmail = email || EMAIL_CONFIG.from.email;
  return `${senderName} <${senderEmail}>`;
}

// Utility function to delay execution
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = EMAIL_CONFIG.retry.maxAttempts,
  baseDelay: number = EMAIL_CONFIG.retry.delayMs
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const delayTime = baseDelay * attempt;
        console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delayTime}ms`);
        await delay(delayTime);
      }
    }
  }
  
  throw lastError;
}
