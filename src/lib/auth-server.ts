import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) return true;

    // Fallback for legacy admin_session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload !== null) return true;
    }

    return false;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}
