import { getSession } from '@/actions/auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function DashboardLayout({children}:{children:ReactNode}) {
   const session = await getSession();
    if (session && session.user.role=="ADMIN"){
      redirect("/dashboard")
    }  else if (session && session.user.role=="USER") redirect("/user");
  return (
    <div>
        {children}
    </div>
  )
}
