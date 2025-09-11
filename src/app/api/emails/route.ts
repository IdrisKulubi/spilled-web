import { NextRequest, NextResponse } from 'next/server';
import { emailRepository } from '@/server/repositories/EmailRepository';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/emails - Get all emails or search
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const offset = parseInt(searchParams.get('offset') || '0');

    let emails;
    if (query) {
      emails = await emailRepository.searchEmails(query);
    } else if (status) {
      emails = await emailRepository.getEmailsByStatus(status);
    } else {
      emails = await emailRepository.getAllEmails(limit, offset);
    }

    const stats = await emailRepository.getEmailStats();
    const batches = await emailRepository.getBatches();

    return NextResponse.json({ emails, stats, batches });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/emails - Add single or bulk emails
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { emails, email, name, notes } = body;


    // Bulk add
    if (emails && Array.isArray(emails)) {
      const results = await emailRepository.bulkAddEmails(
        emails,
        session?.user?.id
      );
      return NextResponse.json(results);
    }

    // Single add
    if (email) {
      const result = await emailRepository.addEmail(
        email,
        name,
        notes,
        session?.user?.id
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error adding emails:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.toString() 
    }, { status: 500 });
  }
}

// DELETE /api/emails - Delete emails
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const results = await emailRepository.deleteMultipleEmails(ids);
    return NextResponse.json({ deleted: results.length });
  } catch (error: any) {
    console.error('Error deleting emails:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
