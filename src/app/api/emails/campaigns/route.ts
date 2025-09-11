import { NextRequest, NextResponse } from 'next/server';
import { emailRepository } from '@/server/repositories/EmailRepository';
import { sendOnboardingEmails } from '@/emails/sendOnboarding';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/emails/campaigns - list campaigns with stats
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await emailRepository.getAllCampaigns();
    const stats = await emailRepository.getCampaignStats();
    return NextResponse.json({ campaigns, stats });
  } catch (error: any) {
    console.error('GET /api/emails/campaigns error:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/emails/campaigns - create and send a campaign
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      subject = "You're invited to Spilled 💌",
      emailIds,
      batchSize = 50,
      dryRun = false,
    } = body || {};

    if (!name || !Array.isArray(emailIds) || emailIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Create campaign
    const campaign = await emailRepository.createCampaign({
      name,
      subject,
      template: 'onboarding',
      createdBy: session?.user?.id,
    });

    // Resolve emails
    const emailEntries = await Promise.all(emailIds.map((id: string) => emailRepository.getEmailById(id)));
    const validEmails = emailEntries.filter((e) => e && e.email);

    // Start campaign
    await emailRepository.startCampaign(campaign.id, validEmails.length);

    // Create recipient rows
    for (const entry of validEmails) {
      await emailRepository.addCampaignRecipient(campaign.id, entry!.id);
    }

    // Send emails
    const addresses = validEmails.map((e) => e!.email as string);
    const result = await sendOnboardingEmails(addresses, {
      batchSize,
      dryRun,
      onSuccess: async (email, messageId) => {
        const entry = validEmails.find((e) => e!.email === email);
        if (entry) {
          await emailRepository.updateEmailStatus(entry!.id, 'sent');
          await emailRepository.updateCampaignRecipient(campaign.id, entry!.id, 'sent', messageId);
        }
      },
      onError: async (email, error) => {
        const entry = validEmails.find((e) => e!.email === email);
        if (entry) {
          await emailRepository.updateEmailStatus(entry!.id, 'failed');
          await emailRepository.updateCampaignRecipient(campaign.id, entry!.id, 'failed', undefined, error);
        }
      },
    });

    // Complete
    await emailRepository.completeCampaign(campaign.id, result.successCount, result.failureCount);

    return NextResponse.json({ campaign, result });
  } catch (error: any) {
    console.error('POST /api/emails/campaigns error:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}

