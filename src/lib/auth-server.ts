import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return payload !== null;
  } catch (error) {
    return false;
  }
}
