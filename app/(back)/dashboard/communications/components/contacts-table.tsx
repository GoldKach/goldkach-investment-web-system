"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  Download,
  Mail,
  MessageSquare,
  Search,
  Send,
  History,
  ChevronDown,
  ChevronUp,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/front-end/rich-text-editor";
import { sendBulkEmail, getSentEmails } from "@/actions/communications";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  role?: string;
}

interface SentEmail {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  sentCount: number;
  failedCount: number;
  sentByName: string | null;
  sentAt: string;
}

interface ContactsTableProps {
  clients: Contact[];
  agents: Contact[];
}

function exportToExcel(data: Contact[], filename: string) {
  const headers = ["Name", "Email", "Phone", "Status/Role"];
  const rows = data.map((c) => [c.name, c.email, c.phone || "—", c.status || c.role || "—"]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ContactTable({
  contacts,
  selected,
  onToggle,
  onToggleAll,
}: {
  contacts: Contact[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = contacts.filter((c) => {
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });
  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(filtered.map((c) => c.id), e.target.checked)}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => onToggle(c.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.email}</td>
                  <td className="px-4 py-3 text-slate-500">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {c.status || c.role || "—"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmailHistoryRow({ email }: { email: SentEmail }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(email.sentAt);
  const formatted = date.toLocaleString("en-UG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-slate-200 dark:border-[#2B2F77]/30 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium text-slate-800 dark:text-white truncate">{email.subject}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {email.recipients.length} recipient{email.recipients.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-green-500" />
              {email.sentCount} sent
            </span>
            {email.failedCount > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <AlertCircle className="h-3 w-3" />
                {email.failedCount} failed
              </span>
            )}
            <span>{formatted}</span>
            {email.sentByName && <span>by {email.sentByName}</span>}
          </div>
        </div>
        <div className="shrink-0 text-slate-400 mt-1">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-[#2B2F77]/20 px-5 py-4 space-y-4 bg-slate-50/50 dark:bg-[#2B2F77]/5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Recipients</p>
            <div className="flex flex-wrap gap-1.5">
              {email.recipients.map((r) => (
                <span
                  key={r}
                  className="inline-block text-xs bg-white dark:bg-[#1a1e4a] border border-slate-200 dark:border-[#2B2F77]/40 rounded px-2 py-0.5 text-slate-600 dark:text-slate-300"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Message</p>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1e4a] border border-slate-200 dark:border-[#2B2F77]/40 rounded-lg p-4"
              dangerouslySetInnerHTML={{ __html: email.message }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmailHistory() {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getSentEmails();
      if (res.success) {
        setEmails(res.data ?? []);
      } else {
        setError(res.error ?? "Failed to load email history.");
      }
    } catch {
      setError("Unexpected error loading history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading email history…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <AlertCircle className="h-6 w-6 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
        <Button size="sm" variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
        <History className="h-8 w-8 opacity-40" />
        <p className="text-sm">No emails sent yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{emails.length} email blast{emails.length !== 1 ? "s" : ""} sent</p>
        <Button size="sm" variant="ghost" onClick={load} className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>
      {emails.map((e) => (
        <EmailHistoryRow key={e.id} email={e} />
      ))}
    </div>
  );
}

export function ContactsTable({ clients, agents }: ContactsTableProps) {
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [emailDialog, setEmailDialog] = useState<{ open: boolean; target: "clients" | "agents" | "all" | null }>({ open: false, target: null });
  const [emailForm, setEmailForm] = useState({ subject: "", message: "" });
  const [isSending, startSending] = useTransition();

  const toggleClient = (id: string) =>
    setSelectedClients((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAllClients = (ids: string[], checked: boolean) =>
    setSelectedClients((prev) => { const s = new Set(prev); ids.forEach((id) => checked ? s.add(id) : s.delete(id)); return s; });

  const toggleAgent = (id: string) =>
    setSelectedAgents((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAllAgents = (ids: string[], checked: boolean) =>
    setSelectedAgents((prev) => { const s = new Set(prev); ids.forEach((id) => checked ? s.add(id) : s.delete(id)); return s; });

  const openEmailDialog = (target: "clients" | "agents" | "all") => {
    if (target !== "all") {
      const count = target === "clients" ? selectedClients.size : selectedAgents.size;
      if (count === 0) { toast.error("Select at least one recipient first."); return; }
    }
    setEmailDialog({ open: true, target });
    setEmailForm({ subject: "", message: "" });
  };

  const handleSendEmail = () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    let recipients: string[] = [];
    if (emailDialog.target === "all") {
      recipients = [...clients, ...agents].map((c) => c.email);
    } else if (emailDialog.target === "clients") {
      recipients = clients.filter((c) => selectedClients.has(c.id)).map((c) => c.email);
    } else if (emailDialog.target === "agents") {
      recipients = agents.filter((c) => selectedAgents.has(c.id)).map((c) => c.email);
    }

    if (recipients.length === 0) {
      toast.error("No recipients to send to.");
      return;
    }

    startSending(async () => {
      try {
        const result = await sendBulkEmail({
          recipients,
          subject: emailForm.subject,
          message: emailForm.message,
        });

        if (result.success) {
          toast.success(`Sent to ${result.sent || recipients.length} recipients.`);
          setEmailDialog({ open: false, target: null });
        } else {
          toast.error(result.error || "Failed to send emails.");
        }
      } catch {
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="agents">Staff ({agents.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            Sent Emails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-500">
              {selectedClients.size > 0 ? `${selectedClients.size} selected` : "Select clients to message"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => exportToExcel(clients, "clients")}
              >
                <Download className="h-4 w-4" /> Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 opacity-50 cursor-not-allowed"
                disabled
                title="SMS coming soon"
              >
                <MessageSquare className="h-4 w-4" /> SMS (disabled)
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => openEmailDialog("clients")}
                disabled={selectedClients.size === 0}
              >
                <Mail className="h-4 w-4" /> Email Selected ({selectedClients.size})
              </Button>
              <Button
                size="sm"
                variant="default"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => openEmailDialog("all")}
                disabled={clients.length === 0 && agents.length === 0}
                title="Send to all clients and staff"
              >
                <Mail className="h-4 w-4" /> Send to All ({clients.length + agents.length})
              </Button>
            </div>
          </div>
          <ContactTable
            contacts={clients}
            selected={selectedClients}
            onToggle={toggleClient}
            onToggleAll={toggleAllClients}
          />
        </TabsContent>

        <TabsContent value="agents" className="mt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-500">
              {selectedAgents.size > 0 ? `${selectedAgents.size} selected` : "Select staff to message"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => exportToExcel(agents, "staff")}
              >
                <Download className="h-4 w-4" /> Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 opacity-50 cursor-not-allowed"
                disabled
                title="SMS coming soon"
              >
                <MessageSquare className="h-4 w-4" /> SMS (disabled)
              </Button>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => openEmailDialog("agents")}
                disabled={selectedAgents.size === 0}
              >
                <Mail className="h-4 w-4" /> Email Selected ({selectedAgents.size})
              </Button>
            </div>
          </div>
          <ContactTable
            contacts={agents}
            selected={selectedAgents}
            onToggle={toggleAgent}
            onToggleAll={toggleAllAgents}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EmailHistory />
        </TabsContent>
      </Tabs>

      <Dialog open={emailDialog.open} onOpenChange={(o) => !isSending && setEmailDialog({ open: o, target: emailDialog.target })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {emailDialog.target === "all"
                ? `Send to All (${clients.length + agents.length})`
                : emailDialog.target === "clients"
                  ? `Send to ${selectedClients.size} Client(s)`
                  : `Send to ${selectedAgents.size} Staff Member(s)`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Email subject…"
                disabled={isSending}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Message</Label>
              <RichTextEditor
                value={emailForm.message}
                onChange={(value) => setEmailForm({ ...emailForm, message: value })}
                placeholder="Write your message here..."
                disabled={isSending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialog({ open: false, target: null })} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending || !emailForm.subject || !emailForm.message} className="gap-2">
              <Send className="h-4 w-4" />
              {isSending ? "Sending…" : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
