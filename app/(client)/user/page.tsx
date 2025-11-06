import { getAllUsers, getSession } from '@/actions/auth';
import { DashboardContent } from '@/components/user/dashbaord-content'
import { list } from 'postcss';
import React from 'react'

export default async function Page() {
    const session = await getSession();
    const loggedIn = session?.user;

   const r = await getAllUsers();
     const users = r.data;

     const user =users.find((u:any)=>u.id==loggedIn?.id);
     console.log(user);
   
  return (
    <div>
      <DashboardContent user={user}/>
    </div>
  )
}
