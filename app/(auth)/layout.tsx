import { getSession } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import React, { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // /onboarding is accessible to authenticated users
  if (pathname.startsWith('/onboarding')) {
    return <div>{children}</div>;
  }

  const session = await getSession();
  if (session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN') redirect('/dashboard');
  else if (session?.user.role === 'AGENT') redirect('/agent');
  else if (session?.user.role === 'CLIENT_RELATIONS') redirect('/cr');
  else if (session?.user.role === 'ACCOUNT_MANAGER') redirect('/accountant');
  else if (session?.user.role === 'USER') redirect('/user');

  return <div>{children}</div>;
}
