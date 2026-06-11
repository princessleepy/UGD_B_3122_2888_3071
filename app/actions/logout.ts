'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('user');
  
  // Also clear the old cookies to be safe
  cookieStore.delete('isLoggedIn');
  cookieStore.delete('userRole');
  cookieStore.delete('userName');
  cookieStore.delete('userId');

  redirect('/login');
}
