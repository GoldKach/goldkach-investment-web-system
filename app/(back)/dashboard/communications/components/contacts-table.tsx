"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Download, Mail, MessageSquare, Search, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  role?: string;
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

export function ContactsTable({ clients, agents }: ContactsTableProps) {
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [emailDialog, setEmailDialog] = useState<{ open: boolean; target: "clients" | "agents" | null }>({ open: false, target: null });
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

  const openEmailDialog = (target: "clients" | "agents") => {
    const count = target === "clients" ? selectedClients.size : selectedAgents.size;
    if (count === 0) { toast.error("Select at least one recipient first."); return; }
    setEmailDialog({ open: true, target });
    setEmailForm({ subject: "", message: "" });
  };

  const handleSendEmail = () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    const pool = emailDialog.target === "clients" ? clients : agents;
    const selected = emailDialog.target === "clients" ? selectedClients : selectedAgents;
    const recipients = pool.filter((c) => selected.has(c.id)).map((c) => c.email);

    startSending(async () => {
      try {
        const res = await fetch("/api/communications/send-bulk-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipients, subject: emailForm.subject, message: emailForm.message }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Sent to ${data.sent} of ${data.total} recipients.`);
          setEmailDialog({ open: false, target: null });
        } else {
          toast.error(data.error || "Failed to send emails.");
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
          <TabsTrigger value="agents">Agents ({agents.length})</TabsTrigger>
        </TabsList>

        {/* ── Clients ── */}
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
            </div>
          </div>
          <ContactTable
            contacts={clients}
            selected={selectedClients}
            onToggle={toggleClient}
            onToggleAll={toggleAllClients}
          />
        </TabsContent>

        {/* ── Agents ── */}
        <TabsContent value="agents" className="mt-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-500">
              {selectedAgents.size > 0 ? `${selectedAgents.size} selected` : "Select agents to message"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => exportToExcel(agents, "agents")}
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
      </Tabs>

      {/* Email compose dialog */}
      <Dialog open={emailDialog.open} onOpenChange={(o) => !isSending && setEmailDialog({ open: o, target: emailDialog.target })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email to {emailDialog.target === "clients" ? `${selectedClients.size} client(s)` : `${selectedAgents.size} agent(s)`}
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
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Write your message here…"
                rows={6}
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
