import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { FileText } from "lucide-react";
import { LedgerShell } from "./ledger-shell";

export const dynamic = "force-dynamic";

export default async function AllClientsLedgerPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">All Client Transaction Statements</h1>
          <p className="text-sm text-muted-foreground">
            Select a client to view and download their full transaction ledger
          </p>
        </div>
      </div>

      <LedgerShell />
    </div>
  );
}
