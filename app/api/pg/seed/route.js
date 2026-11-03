import { NextResponse } from 'next/server';
import { isDbConfigured } from '../../../../lib/server/db';
import { seedRecords } from '../../../../lib/server/pgRecords';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          'PostgreSQL env vars are missing. Set PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE.',
      },
      { status: 503 }
    );
  }

  try {
    const result = await seedRecords();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to seed PostgreSQL.' },
      { status: 500 }
    );
  }
}
