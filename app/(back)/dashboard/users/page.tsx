import { getAllUsers } from "@/actions/auth";
import { UsersTable } from "@/components/back/users-table";
import { get } from "http";

export default async function UsersPage() {
  const r = await getAllUsers();
  const users = r.data;

  console.log(users)
  return (
    <div className="container px-4 md:px-8 mx-auto py-8">
      <UsersTable allUsers={users} />
    </div>
  )
}
