// app/dashboard/clients/page.tsx
import { Suspense } from "react";
import { getAllUsers } from "@/actions/auth";
import ClientsListing from "./components/client-listing";

async function ClientsWithData() {
  const r = await getAllUsers();
  const allUsers = r.data ?? [];
  const clients = allUsers.filter((u: any) => u.role === "USER");

  return <ClientsListing clients={clients} />;
}

function ClientsLoading() {
  return (
    <div className="space-y-4 p-8">
      <div className="h-8 w-48 rounded-lg bg-muted/50 animate-pulse" />
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-36 rounded bg-muted/50 animate-pulse" />
              <div className="h-3 w-24 rounded bg-muted/30 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-muted/50 animate-pulse" />
            <div className="h-5 w-20 rounded bg-muted/30 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<ClientsLoading />}>
        <ClientsWithData />
      </Suspense>
    </div>
  );
}