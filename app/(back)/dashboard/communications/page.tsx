import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { CommunicationsShell } from "./components/communications-shell";

export const dynamic = "force-dynamic";

export default async function CommunicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Communications</h1>
        <p className="text-sm text-slate-400 mt-1">
          View contacts, send bulk emails, and export lists
        </p>
      </div>
      <CommunicationsShell />
    </div>
  );
}
