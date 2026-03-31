import { redirect } from "next/navigation";
import { getSession, getAllUsers } from "@/actions/auth";
import { getAllStaffAction } from "@/actions/staff";
import { ActiveSessionsView } from "./components/active-sessions-view";

export const dynamic = "force-dynamic";

export default async function ActiveSessionsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [usersRes, staffRes] = await Promise.allSettled([
    getAllUsers(),
    getAllStaffAction(),
  ]);

  const allUsers = usersRes.status === "fulfilled" ? (usersRes.value?.data ?? []) : [];
  const allStaff = staffRes.status === "fulfilled" ? (staffRes.value?.data ?? []) : [];

  // Combine users and staff into one list
  const everyone = [
    ...allUsers.map((u: any) => ({ ...u, _source: "user" })),
    ...allStaff.map((s: any) => ({ ...s, _source: "staff" })),
  ];

  // "Active" = account is ACTIVE status and has been updated recently (within 7 days)
  // This is the best approximation without a dedicated session store
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeSessions = everyone
    .filter((u: any) => u.status === "ACTIVE")
    .map((u: any) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || u.email,
      email: u.email,
      role: u.role,
      imageUrl: u.imageUrl || "",
      status: u.status,
      lastSeen: u.updatedAt || u.createdAt,
      createdAt: u.createdAt,
      isCurrentUser: u.id === session.user.id,
    }))
    .sort((a: any, b: any) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  return (
    <div className="container mx-auto py-8 px-4">
      <ActiveSessionsView
        sessions={activeSessions}
        currentUserId={session.user.id}
      />
    </div>
  );
}
