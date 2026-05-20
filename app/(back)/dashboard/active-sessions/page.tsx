import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { ActiveSessionsShell } from "./components/active-sessions-shell";

export const dynamic = "force-dynamic";

export default async function ActiveSessionsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container mx-auto py-8 px-4">
      <ActiveSessionsShell currentUserId={session.user.id} />
    </div>
  );
}
