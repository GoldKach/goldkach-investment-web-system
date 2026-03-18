// components/back/portfolios-client.tsx
"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  type PortfolioDTO,
  type CreatePortfolioInput,
} from "@/actions/portfolios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
  Layers,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Brand tokens                                                                */
/*  Primary navy : #2B2F77  (dark: #1a1f5e)                                   */
/*  Accent blue  : #3B82F6                                                     */
/*  Surface dark : #0f1135 / #161b4a                                           */
/* -------------------------------------------------------------------------- */

type Props = { initialPortfolios: PortfolioDTO[] };

type FormState = {
  name: string;
  description: string;
  timeHorizon: string;
  riskTolerance: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  timeHorizon: "",
  riskTolerance: "",
};

/* -------------------------------------------------------------------------- */
/*  Shared style tokens                                                         */
/* -------------------------------------------------------------------------- */

const inputCls =
  "bg-slate-50 dark:bg-[#161b4a]/60 border-slate-200 dark:border-[#2B2F77]/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-[#3B82F6]/30 focus-visible:border-[#3B82F6]";

const selectContentCls =
  "bg-white dark:bg-[#0f1135] border-slate-200 dark:border-[#2B2F77]/50";

const selectItemCls =
  "text-slate-900 dark:text-white focus:bg-[#3B82F6]/10 focus:text-[#3B82F6]";

/* -------------------------------------------------------------------------- */
/*  Risk badge                                                                  */
/* -------------------------------------------------------------------------- */

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low:    "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/15  text-amber-600  dark:text-amber-400  border-amber-500/30",
    High:   "bg-rose-500/15   text-rose-600   dark:text-rose-400   border-rose-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        map[risk] ?? "bg-slate-500/15 text-slate-500 border-slate-500/30"
      }`}
    >
      <Shield className="w-3 h-3" />
      {risk}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  View dialog                                                                 */
/* -------------------------------------------------------------------------- */

function ViewDialog({
  portfolio,
  open,
  onClose,
}: {
  portfolio: PortfolioDTO | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!portfolio) return null;
  const assets = portfolio.assets ?? [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
            </div>
            {portfolio.name}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Portfolio details and asset allocation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {portfolio.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#161b4a]/60 rounded-xl p-3 border border-slate-100 dark:border-[#2B2F77]/30">
              {portfolio.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Time Horizon",   value: portfolio.timeHorizon,                icon: Clock      },
              { label: "Risk Tolerance", value: portfolio.riskTolerance,              icon: Shield     },
              { label: "Allocation",     value: `${portfolio.allocationPercentage}%`, icon: TrendingUp },
              { label: "Total Assets",   value: `${assets.length} assets`,            icon: Layers     },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 rounded-xl p-3 border border-slate-100 dark:border-[#2B2F77]/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {assets.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
                Asset Allocation
              </p>
              <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-[#161b4a]/60 border-b border-slate-200 dark:border-[#2B2F77]/40 hover:bg-slate-50 dark:hover:bg-[#161b4a]/60">
                      <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2 px-3">Symbol</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">Description</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2 text-right">Alloc %</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-2 text-right pr-3">Cost/Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((pa) => (
                      <TableRow
                        key={pa.id}
                        className="border-b border-slate-100 dark:border-[#2B2F77]/30 last:border-0 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40"
                      >
                        <TableCell className="py-2 px-3">
                          <span className="text-xs font-bold text-[#3B82F6] font-mono">{pa.asset.symbol}</span>
                        </TableCell>
                        <TableCell className="py-2">
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[140px] block">{pa.asset.description}</span>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{pa.defaultAllocationPercentage}%</span>
                        </TableCell>
                        <TableCell className="py-2 text-right pr-3">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">${pa.defaultCostPerShare.toFixed(2)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form dialog (create + edit)                                                 */
/* -------------------------------------------------------------------------- */

function FormDialog({
  open,
  mode,
  portfolio,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: "create" | "edit";
  portfolio: PortfolioDTO | null;
  onClose: () => void;
  onSaved: (p: PortfolioDTO) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (open) {
      setForm(
        portfolio
          ? {
              name:          portfolio.name,
              description:   portfolio.description ?? "",
              timeHorizon:   portfolio.timeHorizon,
              riskTolerance: portfolio.riskTolerance,
            }
          : EMPTY_FORM
      );
    }
  }, [open, portfolio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.timeHorizon || !form.riskTolerance) {
      toast.error("Please fill in all required fields.");
      return;
    }
    startTransition(async () => {
      const payload: CreatePortfolioInput = {
        name:                 form.name.trim(),
        description:          form.description.trim() || undefined,
        timeHorizon:          form.timeHorizon,
        riskTolerance:        form.riskTolerance,
        allocationPercentage: 100,
      };
      const res =
        mode === "create"
          ? await createPortfolio(payload)
          : await updatePortfolio(portfolio!.id, payload);

      if (!res.success || !res.data) {
        toast.error(res.error ?? "Failed to save portfolio.");
        return;
      }
      toast.success(mode === "create" ? "Portfolio created." : "Portfolio updated.");
      onSaved(res.data);
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white">
            {mode === "create" ? "Create Portfolio" : "Edit Portfolio"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {mode === "create"
              ? "Define a new investment portfolio template."
              : `Update details for ${portfolio?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Portfolio Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              placeholder="e.g., Growth Portfolio"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Description
            </Label>
            <Textarea
              placeholder="Describe the portfolio strategy and goals"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Time Horizon <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={form.timeHorizon}
                onValueChange={(v) => setForm((p) => ({ ...p, timeHorizon: v }))}
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select horizon" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {["Short-term (1-5 years)", "Medium-term (5-10 years)", "Long-term (10+ years)"].map((v) => (
                    <SelectItem key={v} value={v} className={selectItemCls}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Risk Tolerance <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={form.riskTolerance}
                onValueChange={(v) => setForm((p) => ({ ...p, riskTolerance: v }))}
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select risk" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {["Low", "Medium", "High"].map((v) => (
                    <SelectItem key={v} value={v} className={selectItemCls}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9"
            >
              {isPending
                ? mode === "create" ? "Creating..." : "Saving..."
                : mode === "create" ? "Create Portfolio" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-9 border-slate-200 dark:border-[#2B2F77]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161b4a]/60"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Delete confirm dialog                                                       */
/* -------------------------------------------------------------------------- */

function DeleteDialog({
  portfolio,
  open,
  onClose,
  onDeleted,
}: {
  portfolio: PortfolioDTO | null;
  open: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!portfolio) return;
    startTransition(async () => {
      const res = await deletePortfolio(portfolio.id);
      if (!res.success) {
        toast.error(res.error ?? "Failed to delete portfolio.");
        return;
      }
      toast.success("Portfolio deleted.");
      onDeleted(portfolio.id);
      onClose();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-rose-500" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            Delete Portfolio
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {portfolio?.name}
            </span>
            ? This will remove all associated assets and user enrollments. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="border-slate-200 dark:border-[#2B2F77]/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161b4a]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isPending ? "Deleting..." : "Delete Portfolio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main client component                                                       */
/* -------------------------------------------------------------------------- */

export default function PortfoliosClient({ initialPortfolios }: Props) {
  const [portfolios, setPortfolios] = useState<PortfolioDTO[]>(initialPortfolios);
  const [formOpen,   setFormOpen]   = useState(false);
  const [formMode,   setFormMode]   = useState<"create" | "edit">("create");
  const [selected,   setSelected]   = useState<PortfolioDTO | null>(null);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openCreate = () => { setSelected(null); setFormMode("create"); setFormOpen(true); };
  const openEdit   = (p: PortfolioDTO) => { setSelected(p); setFormMode("edit"); setFormOpen(true); };
  const openView   = (p: PortfolioDTO) => { setSelected(p); setViewOpen(true); };
  const openDelete = (p: PortfolioDTO) => { setSelected(p); setDeleteOpen(true); };

  const handleSaved = (saved: PortfolioDTO) => {
    setPortfolios((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };

  const handleDeleted = (id: string) =>
    setPortfolios((prev) => prev.filter((p) => p.id !== id));

  const stats = [
    { label: "Total",       value: portfolios.length,                                           color: "text-[#3B82F6]" },
    { label: "Low Risk",    value: portfolios.filter((p) => p.riskTolerance === "Low").length,  color: "text-emerald-500 dark:text-emerald-400" },
    { label: "Medium Risk", value: portfolios.filter((p) => p.riskTolerance === "Medium").length, color: "text-amber-500 dark:text-amber-400" },
    { label: "High Risk",   value: portfolios.filter((p) => p.riskTolerance === "High").length, color: "text-rose-500 dark:text-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">

      {/* Header */}
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white dark:text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Portfolio Templates
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>

          <Button
            onClick={openCreate}
            className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9 shadow-lg shadow-[#2B2F77]/20 dark:shadow-[#3B82F6]/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Portfolio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">

          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-[#2B2F77] dark:text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No portfolios yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                Create your first portfolio template to start enrolling clients.
              </p>
              <Button
                onClick={openCreate}
                className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white h-9 text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Portfolio
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                  <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3.5 w-[35%]">
                    Portfolio
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5">
                    Time Horizon
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5">
                    Risk
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 text-center">
                    Assets
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {portfolios.map((p, i) => (
                  <TableRow
                    key={p.id}
                    className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${
                      i === portfolios.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Name + description */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                          <BarChart3 className="w-3.5 h-3.5 text-[#2B2F77] dark:text-[#3B82F6]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {p.name}
                          </p>
                          {p.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[220px] mt-0.5">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Time horizon */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {p.timeHorizon}
                        </span>
                      </div>
                    </TableCell>

                    {/* Risk badge */}
                    <TableCell className="py-4">
                      <RiskBadge risk={p.riskTolerance} />
                    </TableCell>

                    {/* Asset count */}
                    <TableCell className="py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 rounded-full px-2.5 py-1">
                        <Layers className="w-3 h-3 text-[#2B2F77] dark:text-[#3B82F6]" />
                        <span className="text-xs font-semibold text-[#2B2F77] dark:text-[#3B82F6]">
                          {p.assets?.length ?? 0}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openView(p)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-[#2B2F77] dark:hover:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDelete(p)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {portfolios.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
            Showing {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Dialogs */}
      <FormDialog
        open={formOpen}
        mode={formMode}
        portfolio={selected}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
      <ViewDialog
        portfolio={selected}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
      />
      <DeleteDialog
        portfolio={selected}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}