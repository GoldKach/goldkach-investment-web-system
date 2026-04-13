

// app/user/deposits/page.tsx (or wherever your deposits page is)
import { getSession, getUserById } from "@/actions/auth";
import { getUserDeposits } from "@/actions/deposits";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { DepositsPageContent } from "./components/deposit-content";

export default async function DepositsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [userResponse, result] = await Promise.all([
    getUserById(userId).catch(() => null),
    getUserDeposits(userId),
  ]);
  const user = userResponse?.data ?? userResponse ?? session.user;

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex bg-white dark:bg-slate-950 items-center justify-center min-h-screen">
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

  return <DepositsPageContent deposits={result.data} user={user} />;
}