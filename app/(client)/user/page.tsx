import { getSession } from '@/actions/auth';
import { DashboardContent } from '@/components/user/dashbaord-content'
import React from 'react'

export default async function Page() {
    const session = await getSession();
    const user = session?.user;
    console.log(user);
  return (
    <div>
      <DashboardContent/>
    </div>
  )
}
