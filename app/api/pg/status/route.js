import { NextResponse } from 'next/server';
import { isDbConfigured } from '../../../../lib/server/db';
import { getStatus } from '../../../../lib/server/pgRecords';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        connected: false,
        error:
          'PostgreSQL env vars are missing. Set PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE.',
      },
      { status: 503 }
    );
  }

  try {
    const status = await getStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error.message || 'Failed to connect to PostgreSQL.',
      },
      { status: 503 }
    );
  }
}
