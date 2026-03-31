import { redirect } from "next/navigation";
import { getSession, getAllUsers } from "@/actions/auth";
import { ErrorSection } from "@/components/agent/error-section";
import { AdminSettingsForm } from "./components/admin-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Admin is a regular user account, not a staff record
  const r = await getAllUsers();
  const user = (r?.data ?? []).find((u: any) => u.id === session.user.id) ?? session.user;

  if (!user) {
    return (
      <div className="p-6 max-w-2xl">
        <ErrorSection message="Could not load your profile." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Update your profile photo, name, phone and password
        </p>
      </div>
      <AdminSettingsForm user={user} />
    </div>
  );
}
