// app/admin/deposits/page.tsx
import { getSession, getAllUsers } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AdminDepositsContent } from "./components/admin-deposits-content";

export default async function AdminDepositsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Get fresh role from DB (session cookie may be stale)
  const r = await getAllUsers();
  const users = r?.data;
  const user = users?.find((u: any) => u.id === session.user?.id) ?? session.user;
  const role = user?.role ?? (session.user as any)?.role;

  const adminRoles = ["ADMIN", "SUPER_ADMIN", "MANAGER"];
  if (!adminRoles.includes(role)) {
    if (role === "USER") redirect("/user/deposits");
    if (role === "AGENT") redirect("/agent");
    if (role === "CLIENT_RELATIONS") redirect("/cr");
    if (role === "ACCOUNT_MANAGER") redirect("/accountant");
    redirect("/dashboard");
  }

  // Fetch all deposits with user and wallet info
  const result = await listDeposits({
    sortBy: "createdAt",
    order: "desc",
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Deposits</CardTitle>
            <CardDescription>
              {result.error || "Unable to load deposit data. Please try again later."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <AdminDepositsContent 
      deposits={result.data} 
      adminId={session.user.id}
      adminName={user?.name || user?.email || session.user.email || "Admin"}
    />
  );
}