import { NextResponse } from 'next/server';
import { getJourney, saveJourney } from '@/lib/data-service';
import { isAuthenticated } from '@/lib/auth-server';

export async function GET() {
  try {
    const journey = await getJourney();
    return NextResponse.json(journey, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Data must be an array of journey entries' }, { status: 400 });
    }

    // Sort descending by year
    data.sort((a, b) => b.year.localeCompare(a.year));

    const updated = await saveJourney(data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save journey' }, { status: 500 });
  }
}
