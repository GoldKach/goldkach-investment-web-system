import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getUserSettings } from "@/actions/user-settings";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsPageContent } from "./components/settings-page-component";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const result = await getUserSettings();

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle>Error Loading Settings</CardTitle>
            <CardDescription>
              {result.error ?? "Unable to load your profile. Please try logging in again."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <SettingsPageContent user={result.data} />;
}
