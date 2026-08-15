import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProjects, addProject } from '@/lib/data-service';
import { isAuthenticated } from '@/lib/auth-server';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProject = await addProject(data);
    revalidatePath('/');
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
