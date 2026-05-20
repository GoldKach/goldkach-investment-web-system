import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { UsersTableShell } from "@/components/back/users-table-shell";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container px-4 md:px-8 mx-auto py-8">
      <UsersTableShell />
    </div>
  );
}
