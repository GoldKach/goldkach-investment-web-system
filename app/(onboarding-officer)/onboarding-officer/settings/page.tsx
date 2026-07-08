import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { OOSettingsView } from "@/components/onboarding-officer/oo-settings-view";

export const dynamic = "force-dynamic";

export default async function OOSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container mx-auto px-6 py-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile photo and account security
        </p>
      </div>
      <OOSettingsView user={session.user} />
    </div>
  );
}
