import { redirect } from "next/navigation";
import { getSession, getAllUsers } from "@/actions/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsPageContent } from "./components/settings-page-component";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Use getAllUsers to get the full user object — most reliable approach
  const r = await getAllUsers();
  const users = r?.data ?? [];
  const fullUser = users.find((u: any) => u.id === session.user.id);

  // Build settings object from whatever data we have
  const userData = fullUser ?? session.user;

  if (!userData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle>Error Loading Settings</CardTitle>
            <CardDescription>Unable to load your profile. Please try logging in again.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const user = {
    id: userData.id,
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    name: userData.name || [userData.firstName, userData.lastName].filter(Boolean).join(" ") || "",
    email: userData.email || "",
    phone: userData.phone || "",
    imageUrl: userData.imageUrl || "",
    role: userData.role || "USER",
    status: userData.status || "ACTIVE",
    emailVerified: userData.emailVerified ?? false,
    isApproved: userData.isApproved ?? false,
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updatedAt || new Date().toISOString(),
  };

  return <SettingsPageContent user={user} />;
}
