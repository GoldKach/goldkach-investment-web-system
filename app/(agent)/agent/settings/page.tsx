import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAllStaffAction } from "@/actions/staff";
import { ErrorSection } from "@/components/agent/error-section";
import { AgentSettingsForm } from "./components/agent-settings-form";

export const dynamic = "force-dynamic";

export default async function AgentSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const allStaffRes = await getAllStaffAction({ role: "AGENT" });
  const staff = allStaffRes.data?.find((s) => s.id === session.user.id);

  if (!staff) {
    return <ErrorSection message="Could not load your staff profile." />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile photo and password</p>
      </div>
      <AgentSettingsForm staff={staff} />
    </div>
  );
}
