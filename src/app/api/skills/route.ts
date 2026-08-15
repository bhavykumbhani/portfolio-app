import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSkills, saveSkills } from '@/lib/data-service';
import { isAuthenticated } from '@/lib/auth-server';

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
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
      return NextResponse.json({ error: 'Data must be an array of skills' }, { status: 400 });
    }

    const updated = await saveSkills(data);
    revalidatePath('/');
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save skills' }, { status: 500 });
  }
}
