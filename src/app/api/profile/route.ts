import { NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/data-service';
import { isAuthenticated } from '@/lib/auth-server';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const updated = await updateProfile(data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
