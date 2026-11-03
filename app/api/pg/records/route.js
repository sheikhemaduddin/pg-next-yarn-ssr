import { NextResponse } from 'next/server';
import { isDbConfigured } from '../../../../lib/server/db';
import { createRecord, listRecords, seedRecords } from '../../../../lib/server/pgRecords';

export const dynamic = 'force-dynamic';

function dbMissingResponse() {
  return NextResponse.json(
    {
      error:
        'PostgreSQL env vars are missing. Set PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE.',
    },
    { status: 503 }
  );
}

export async function GET() {
  if (!isDbConfigured()) return dbMissingResponse();

  try {
    await seedRecords();
    const items = await listRecords({ limit: 50 });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load PostgreSQL records.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!isDbConfigured()) return dbMissingResponse();

  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const category = String(body.category || '').trim() || 'General';
    const summary = String(body.summary || '').trim();

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const item = await createRecord({
      title,
      category,
      summary,
      source: 'user',
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create PostgreSQL record.' },
      { status: 500 }
    );
  }
}
