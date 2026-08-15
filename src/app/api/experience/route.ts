import { NextResponse } from 'next/server';
import { getExperience, saveExperience } from '@/lib/data-service';
import { isAuthenticated } from '@/lib/auth-server';

export async function GET() {
  try {
    const experience = await getExperience();
    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
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
      return NextResponse.json({ error: 'Data must be an array of experiences' }, { status: 400 });
    }

    const updated = await saveExperience(data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
  }
}
