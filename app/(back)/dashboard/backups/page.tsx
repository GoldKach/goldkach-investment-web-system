import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getBackupManifest } from "@/actions/backups";
import { Database, Download, HardDrive, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TriggerBackupButton } from "@/components/back/trigger-backup-button";

export const dynamic = "force-dynamic";

function humanSize(bytes: number) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return                          `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function DatabaseBackupsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const backups = await getBackupManifest();
  const latest  = backups[0] ?? null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Database Backups</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Automated daily backups — runs at midnight · last 7 kept
            </p>
          </div>
        </div>
        <TriggerBackupButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-400">Total Backups</p>
            <p className="text-2xl font-bold mt-0.5 text-blue-500">{backups.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-400">Latest Backup</p>
            <p className="text-sm font-semibold mt-0.5 text-slate-700 dark:text-slate-200 truncate">
              {latest ? formatDate(latest.date) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-400">Latest Size</p>
            <p className="text-sm font-semibold mt-0.5 text-slate-700 dark:text-slate-200">
              {latest ? humanSize(latest.fileSizeBytes) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Backup list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Backup History</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Click Download to retrieve any backup from UploadThing
              </CardDescription>
            </div>
            {backups.length > 0 && (
              <Badge variant="outline" className="text-xs gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {backups.length} / 7 slots used
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <AlertCircle className="h-8 w-8 opacity-20" />
              <p className="text-sm">No backups yet.</p>
              <p className="text-xs text-slate-400">
                The first backup will run automatically at midnight, or you can trigger one manually:
              </p>
              <code className="text-xs bg-muted px-3 py-1.5 rounded-md font-mono">
                node backup/index.js --now
              </code>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-2.5 text-left">#</th>
                    <th className="px-4 py-2.5 text-left">Date</th>
                    <th className="px-4 py-2.5 text-left">File</th>
                    <th className="px-4 py-2.5 text-left">Size</th>
                    <th className="px-4 py-2.5 text-left">Created At</th>
                    <th className="px-4 py-2.5 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                  {backups.map((b, idx) => (
                    <tr
                      key={b.fileName}
                      className={`hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors ${
                        idx === 0 ? "bg-green-50/50 dark:bg-green-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-green-300 text-green-700 dark:text-green-400 shrink-0"
                            >
                              Latest
                            </Badge>
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-100 text-xs">
                            {formatDate(b.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {b.fileName}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 opacity-50" />
                          {humanSize(b.fileSizeBytes)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 opacity-50" />
                          {formatDateTime(b.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs h-7 px-3"
                          asChild
                        >
                          <a href={b.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info card */}
      <Card className="border-blue-200/50 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-500/5">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">How backups work: </span>
            Every day at midnight the server runs <code className="bg-muted px-1 rounded font-mono">pg_dump</code>,
            compresses the output, uploads it to UploadThing, and emails a download link to
            <span className="font-medium"> itsupport@goldkach.co.ug</span> and
            <span className="font-medium"> goldkachinvestments@gmail.com</span>.
            Only the 7 most recent backups are kept — older ones are deleted automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
