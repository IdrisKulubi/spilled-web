#!/usr/bin/env node

/**
 * CLI Script for sending onboarding emails
 * 
 * Usage:
 *   npm run send-emails -- --file emails.txt
 *   npm run send-emails -- --list "email1@example.com,email2@example.com"
 *   npm run send-emails -- --dry-run --file emails.txt
 * 
 * Options:
 *   --file <path>    Read emails from a file (one per line)
 *   --list <emails>  Comma-separated list of emails
 *   --dry-run        Test mode - doesn't actually send emails
 *   --batch-size <n> Number of emails to send concurrently (default: 10)
 *   --delay <ms>     Delay between emails in milliseconds (default: 100)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { sendOnboardingEmails, type SendOnboardingOptions } from '../src/emails/sendOnboarding';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Parse command line arguments
interface CliArgs {
  file?: string;
  list?: string;
  dryRun: boolean;
  batchSize: number;
  delay: number;
  help: boolean;
  verbose: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    dryRun: false,
    batchSize: 10,
    delay: 100,
    help: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--file':
      case '-f':
        result.file = args[++i];
        break;
      case '--list':
      case '-l':
        result.list = args[++i];
        break;
      case '--dry-run':
      case '-d':
        result.dryRun = true;
        break;
      case '--batch-size':
      case '-b':
        result.batchSize = parseInt(args[++i], 10);
        break;
      case '--delay':
        result.delay = parseInt(args[++i], 10);
        break;
      case '--verbose':
      case '-v':
        result.verbose = true;
        break;
      case '--help':
      case '-h':
        result.help = true;
        break;
    }
  }

  return result;
}

function showHelp() {
  console.log(`
${colors.bright}Spilled Onboarding Email Sender${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npm run send-emails -- [options]
  tsx scripts/sendEmails.ts [options]

${colors.cyan}Options:${colors.reset}
  ${colors.green}--file, -f <path>${colors.reset}      Read emails from a file (one per line)
  ${colors.green}--list, -l <emails>${colors.reset}    Comma-separated list of emails
  ${colors.green}--dry-run, -d${colors.reset}          Test mode - doesn't actually send emails
  ${colors.green}--batch-size, -b <n>${colors.reset}   Number of emails to send concurrently (default: 10)
  ${colors.green}--delay <ms>${colors.reset}           Delay between emails in milliseconds (default: 100)
  ${colors.green}--verbose, -v${colors.reset}          Show detailed progress
  ${colors.green}--help, -h${colors.reset}             Show this help message

${colors.cyan}Examples:${colors.reset}
  # Send emails from a file
  npm run send-emails -- --file emails.txt

  # Send to specific emails
  npm run send-emails -- --list "alice@example.com,bob@example.com"

  # Test run without sending
  npm run send-emails -- --dry-run --file emails.txt

  # Send with custom batch size
  npm run send-emails -- --file emails.txt --batch-size 5

${colors.cyan}Email File Format:${colors.reset}
  Create a text file with one email per line:
  
  user1@example.com
  user2@example.com
  user3@example.com

${colors.yellow}Note:${colors.reset} Make sure RESEND_API_KEY is set in your .env.local file
`);
}

/**
 * Read emails from a file
 */
async function readEmailsFromFile(filePath: string): Promise<string[]> {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  return fileContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#')); // Skip empty lines and comments
}

/**
 * Interactive mode - ask for emails if not provided
 */
async function promptForEmails(): Promise<string[]> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log(`${colors.cyan}Enter email addresses (one per line, empty line to finish):${colors.reset}`);
    const emails: string[] = [];

    rl.on('line', (line) => {
      const trimmed = line.trim();
      if (trimmed === '') {
        rl.close();
      } else {
        emails.push(trimmed);
        console.log(`  Added: ${colors.green}${trimmed}${colors.reset}`);
      }
    });

    rl.on('close', () => {
      resolve(emails);
    });
  });
}

/**
 * Progress bar display
 */
function displayProgress(current: number, total: number, email: string) {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filled = Math.round((current / total) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  
  process.stdout.write(`\r${colors.cyan}[${bar}]${colors.reset} ${percentage}% (${current}/${total}) ${colors.yellow}${email}${colors.reset}`);
  
  if (current === total) {
    console.log(''); // New line when complete
  }
}

/**
 * Main execution
 */
async function main() {
  const args = parseArgs();

  // Show help if requested
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error(`${colors.red}❌ Error: RESEND_API_KEY is not set in .env.local${colors.reset}`);
    console.log(`${colors.yellow}Please add your Resend API key to .env.local:${colors.reset}`);
    console.log(`  RESEND_API_KEY=re_xxxxxxxxxxxx`);
    process.exit(1);
  }

  try {
    // Collect emails from various sources
    let emails: string[] = [];

    if (args.file) {
      console.log(`${colors.cyan}📂 Reading emails from file: ${args.file}${colors.reset}`);
      emails = await readEmailsFromFile(args.file);
    } else if (args.list) {
      console.log(`${colors.cyan}📝 Parsing email list${colors.reset}`);
      emails = args.list.split(',').map(e => e.trim());
    } else {
      // Interactive mode
      console.log(`${colors.magenta}🎯 Interactive mode${colors.reset}`);
      emails = await promptForEmails();
    }

    if (emails.length === 0) {
      console.error(`${colors.red}❌ No emails provided${colors.reset}`);
      showHelp();
      process.exit(1);
    }

    // Display configuration
    console.log(`\n${colors.bright}📧 Email Campaign Configuration:${colors.reset}`);
    console.log(`  Recipients: ${colors.green}${emails.length}${colors.reset}`);
    console.log(`  Mode: ${args.dryRun ? colors.yellow + 'DRY RUN' : colors.green + 'LIVE'} ${colors.reset}`);
    console.log(`  Batch Size: ${colors.cyan}${args.batchSize}${colors.reset}`);
    console.log(`  Delay: ${colors.cyan}${args.delay}ms${colors.reset}`);
    
    if (args.verbose) {
      console.log(`\n${colors.cyan}Email list:${colors.reset}`);
      emails.forEach((email, i) => {
        console.log(`  ${i + 1}. ${email}`);
      });
    }

    // Confirmation for live mode
    if (!args.dryRun && emails.length > 10) {
      console.log(`\n${colors.yellow}⚠️  You're about to send ${emails.length} emails in LIVE mode.${colors.reset}`);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
      const confirm = await new Promise<string>((resolve) => {
        rl.question(`Type "yes" to continue: `, resolve);
      });
      rl.close();
      
      if (confirm.toLowerCase() !== 'yes') {
        console.log(`${colors.yellow}Cancelled by user${colors.reset}`);
        process.exit(0);
      }
    }

    console.log(`\n${colors.bright}🚀 Starting email campaign...${colors.reset}\n`);

    // Send emails with progress tracking
    const options: SendOnboardingOptions = {
      dryRun: args.dryRun,
      batchSize: args.batchSize,
      onProgress: args.verbose ? displayProgress : undefined,
      onSuccess: args.verbose ? (email, messageId) => {
        console.log(`\n  ${colors.green}✅ Sent to ${email} (ID: ${messageId})${colors.reset}`);
      } : undefined,
      onError: (email, error) => {
        console.log(`\n  ${colors.red}❌ Failed: ${email} - ${error}${colors.reset}`);
      },
    };

    const startTime = Date.now();
    const result = await sendOnboardingEmails(emails, options);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Display results
    console.log(`\n${colors.bright}📊 Campaign Results:${colors.reset}`);
    console.log(`  ${colors.green}✅ Successfully sent: ${result.successCount}${colors.reset}`);
    console.log(`  ${colors.red}❌ Failed: ${result.failureCount}${colors.reset}`);
    console.log(`  ${colors.cyan}⏱️  Duration: ${duration}s${colors.reset}`);

    if (result.failureCount > 0 && args.verbose) {
      console.log(`\n${colors.red}Failed emails:${colors.reset}`);
      result.failed.forEach(f => {
        console.log(`  - ${f.email}: ${f.error}`);
      });
    }

    // Save results to file
    const resultsFile = `email-results-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(result, null, 2));
    console.log(`\n${colors.cyan}📁 Results saved to: ${resultsFile}${colors.reset}`);

    process.exit(result.failureCount > 0 ? 1 : 0);

  } catch (error) {
    console.error(`\n${colors.red}❌ Error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`);
    if (args.verbose && error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main };
