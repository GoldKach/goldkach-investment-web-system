// components/back/portfolio-assets-client.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import {
  createPortfolioAsset,
  updatePortfolioAsset,
  deletePortfolioAsset,
  type PortfolioAssetDTO,
  type CreatePortfolioAssetInput,
  type UpdatePortfolioAssetInput,
} from "@/actions/portfolioassets";
import type { Asset } from "@/actions/assets";
import type { PortfolioDTO } from "@/actions/portfolios";

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
  BarChart3,
  Layers,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  Tag,
  Percent,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Brand tokens — navy #2B2F77 / blue #3B82F6                                */
/* -------------------------------------------------------------------------- */

type Props = {
  initialItems:  PortfolioAssetDTO[];
  allAssets:     Asset[];
  allPortfolios: PortfolioDTO[];
};

type FormState = {
  portfolioId:                 string;
  assetId:                     string;
  defaultAllocationPercentage: string;
  defaultCostPerShare:         string;
};

const EMPTY_FORM: FormState = {
  portfolioId:                 "",
  assetId:                     "",
  defaultAllocationPercentage: "0",
  defaultCostPerShare:         "0",
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
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const fmt$ = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

const fmtPct = (v: number) => `${Number(v).toFixed(2)}%`;

/* -------------------------------------------------------------------------- */
/*  View dialog                                                                 */
/* -------------------------------------------------------------------------- */

function ViewDialog({
  item,
  open,
  onClose,
  onEdit,
  onDelete,
}: {
  item:     PortfolioAssetDTO | null;
  open:     boolean;
  onClose:  () => void;
  onEdit:   () => void;
  onDelete: () => void;
}) {
  if (!item) return null;

  const gainLoss    = (item.asset?.closePrice ?? 0) - item.defaultCostPerShare;
  const gainLossPct = item.defaultCostPerShare > 0
    ? (gainLoss / item.defaultCostPerShare) * 100
    : 0;
  const isPositive = gainLoss >= 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-black text-[#2B2F77] dark:text-[#3B82F6] font-mono">
                {(item.asset?.symbol ?? "??").slice(0, 2)}
              </span>
            </div>
            <span className="font-black font-mono">{item.asset?.symbol ?? "—"}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {item.portfolio?.name ?? "—"} · {item.asset?.description ?? ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          {/* Price performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Close Price</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {fmt$(item.asset?.closePrice ?? 0)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                {isPositive
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                <span className="text-xs text-slate-500 dark:text-slate-400">vs Default Cost</span>
              </div>
              <p className={`text-base font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {isPositive ? "+" : ""}{fmtPct(gainLossPct)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Default Alloc %",  value: fmtPct(item.defaultAllocationPercentage), icon: Percent    },
            
              { label: "Asset Class",       value: item.asset?.assetClass ?? "—",            icon: BarChart3  },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-[#2B2F77]/5 dark:bg-[#3B82F6]/5 border border-[#2B2F77]/15 dark:border-[#3B82F6]/15 rounded-xl p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-[#2B2F77] dark:text-[#3B82F6]">Template defaults — </span>
              when a client enrolls in this portfolio, these values are used as the starting allocation and cost basis. Clients can have their own overrides.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={onEdit}
              className="flex-1 h-9 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-sm font-semibold"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit Defaults
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              className="h-9 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Remove
            </Button>
          </div>
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
  item,
  allAssets,
  allPortfolios,
  onClose,
  onSaved,
}: {
  open:          boolean;
  mode:          "create" | "edit";
  item:          PortfolioAssetDTO | null;
  allAssets:     Asset[];
  allPortfolios: PortfolioDTO[];
  onClose:       () => void;
  onSaved:       (p: PortfolioAssetDTO) => void;
}) {
  const [form, setForm]   = useState<FormState>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              portfolioId:                 item.portfolioId,
              assetId:                     item.assetId,
              defaultAllocationPercentage: String(item.defaultAllocationPercentage ?? 0),
              defaultCostPerShare:         String(item.defaultCostPerShare ?? 0),
            }
          : EMPTY_FORM
      );
    }
  }, [open, item]);

  // Live preview of selected asset
  const selectedAsset = allAssets.find((a) => a.id === form.assetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.portfolioId || !form.assetId) {
      toast.error("Portfolio and asset are required.");
      return;
    }
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createPortfolioAsset({
              portfolioId:                 form.portfolioId,
              assetId:                     form.assetId,
              defaultAllocationPercentage: parseFloat(form.defaultAllocationPercentage) || 0,
              defaultCostPerShare:         parseFloat(form.defaultCostPerShare) || 0,
            } as CreatePortfolioAssetInput)
          : await updatePortfolioAsset(item!.id, {
              defaultAllocationPercentage: parseFloat(form.defaultAllocationPercentage) || 0,
              defaultCostPerShare:         parseFloat(form.defaultCostPerShare) || 0,
            } as UpdatePortfolioAssetInput);

      if (!res.success || !res.data) {
        toast.error(res.error ?? "Failed to save.");
        return;
      }
      toast.success(mode === "create" ? "Asset added to portfolio." : "Defaults updated.");
      onSaved(res.data);
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white">
            {mode === "create" ? "Add Asset to Portfolio" : "Edit Default Values"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {mode === "create"
              ? "Link an asset to a portfolio template with default allocation and cost."
              : `Update default allocation and cost for ${item?.asset?.symbol ?? "this asset"}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          {/* Portfolio selector — disabled in edit */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Portfolio Template <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={form.portfolioId}
              onValueChange={(v) => setForm((p) => ({ ...p, portfolioId: v }))}
              disabled={mode === "edit"}
            >
              <SelectTrigger className={`${inputCls} ${mode === "edit" ? "opacity-60" : ""}`}>
                <SelectValue placeholder="Select portfolio" />
              </SelectTrigger>
              <SelectContent className={selectContentCls}>
                {allPortfolios.map((p) => (
                  <SelectItem key={p.id} value={p.id} className={selectItemCls}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asset selector — disabled in edit */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Asset <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={form.assetId}
              onValueChange={(v) => setForm((p) => ({ ...p, assetId: v }))}
              disabled={mode === "edit"}
            >
              <SelectTrigger className={`${inputCls} ${mode === "edit" ? "opacity-60" : ""}`}>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className={selectContentCls}>
                {allAssets.map((a) => (
                  <SelectItem key={a.id} value={a.id} className={selectItemCls}>
                    <span className="font-mono font-bold text-[#3B82F6]">{a.symbol}</span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400 text-xs">— {a.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Live asset preview */}
            {selectedAsset && (
              <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-200 dark:border-[#2B2F77]/30 rounded-xl px-3 py-2 flex items-center gap-4">
                <div>
                  <span className="text-xs text-slate-400">Sector</span>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{selectedAsset.sector}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Close Price</span>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmt$(selectedAsset.closePrice)}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Asset Class</span>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{selectedAsset.assetClass ?? "—"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Default values */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Default Alloc %
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0.00"
                value={form.defaultAllocationPercentage}
                onChange={(e) => setForm((p) => ({ ...p, defaultAllocationPercentage: e.target.value }))}
                className={inputCls}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">Suggested % for clients</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Default Cost/Share
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.defaultCostPerShare}
                onChange={(e) => setForm((p) => ({ ...p, defaultCostPerShare: e.target.value }))}
                className={inputCls}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">Suggested cost basis</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9"
            >
              {isPending
                ? mode === "create" ? "Adding..." : "Saving..."
                : mode === "create" ? "Add to Portfolio" : "Save Changes"}
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
/*  Delete dialog                                                               */
/* -------------------------------------------------------------------------- */

function DeleteDialog({
  item,
  open,
  onClose,
  onDeleted,
}: {
  item:      PortfolioAssetDTO | null;
  open:      boolean;
  onClose:   () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!item) return;
    startTransition(async () => {
      const res = await deletePortfolioAsset(item.id);
      if (!res.success) {
        toast.error(res.error ?? "Failed to remove asset.");
        return;
      }
      toast.success(`${item.asset?.symbol ?? "Asset"} removed from portfolio.`);
      onDeleted(item.id);
      onClose();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-rose-500" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            Remove Asset from Portfolio
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            Remove{" "}
            <span className="font-bold font-mono text-slate-700 dark:text-slate-200">
              {item?.asset?.symbol}
            </span>{" "}
            from{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {item?.portfolio?.name}
            </span>
            ? This only removes the template link — existing client positions are not affected. This cannot be undone.
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
            {isPending ? "Removing..." : "Remove Asset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export default function PortfolioAssetsClient({
  initialItems,
  allAssets,
  allPortfolios,
}: Props) {
  const [items,      setItems]      = useState<PortfolioAssetDTO[]>(initialItems);
  const [query,      setQuery]      = useState("");
  const [formOpen,   setFormOpen]   = useState(false);
  const [formMode,   setFormMode]   = useState<"create" | "edit">("create");
  const [selected,   setSelected]   = useState<PortfolioAssetDTO | null>(null);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openCreate = () => { setSelected(null); setFormMode("create"); setFormOpen(true); };
  const openEdit   = (i: PortfolioAssetDTO) => { setSelected(i); setFormMode("edit"); setFormOpen(true); };
  const openView   = (i: PortfolioAssetDTO) => { setSelected(i); setViewOpen(true); };
  const openDelete = (i: PortfolioAssetDTO) => { setSelected(i); setDeleteOpen(true); };

  const handleSaved = (saved: PortfolioAssetDTO) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };

  const handleDeleted = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const filtered = query.trim()
    ? items.filter((i) =>
        (i.asset?.symbol ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (i.asset?.description ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (i.portfolio?.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (i.asset?.sector ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (i.asset?.assetClass ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b1f]">

      {/* Header */}
      <div className="bg-white dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white dark:text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Portfolio Asset Templates
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length} asset–portfolio link{items.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9 shadow-lg shadow-[#2B2F77]/20 dark:shadow-[#3B82F6]/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Asset to Portfolio
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Links",    value: items.length,                                                  color: "text-[#3B82F6]" },
            { label: "Portfolios",     value: new Set(items.map((i) => i.portfolioId)).size,                 color: "text-[#2B2F77] dark:text-[#3B82F6]" },
            { label: "Unique Assets",  value: new Set(items.map((i) => i.assetId)).size,                    color: "text-violet-600 dark:text-violet-400" },
            { label: "Avg Alloc %",    value: items.length > 0
                ? `${(items.reduce((s, i) => s + i.defaultAllocationPercentage, 0) / items.length).toFixed(1)}%`
                : "0%",                                                                                       color: "text-emerald-600 dark:text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol, portfolio, sector or asset class…"
            className="w-full h-10 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-[#2B2F77]/40 bg-white dark:bg-[#0f1135] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center mb-4">
                <Layers className="w-7 h-7 text-[#2B2F77] dark:text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {query ? "No results found" : "No asset links yet"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                {query
                  ? "Try a different search term."
                  : "Add assets to portfolio templates to define default allocations."}
              </p>
              {!query && (
                <Button
                  onClick={openCreate}
                  className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white h-9 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Asset to Portfolio
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                  {[
                    { label: "Asset",         cls: "px-6 w-[20%]" },
                    { label: "Portfolio",      cls: "" },
                    { label: "Class",          cls: "" },
                    { label: "Default Alloc %", cls: "text-right" },
                    { label: "Close Price",    cls: "text-right" },
                    { label: "vs Default",     cls: "text-right" },
                    { label: "Actions",        cls: "text-right pr-6" },
                  ].map(({ label, cls }) => (
                    <TableHead key={label} className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${cls}`}>
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item, i) => {
                  const closePrice = item.asset?.closePrice ?? 0;
                  const gainLoss   = closePrice - item.defaultCostPerShare;
                  const gainPct    = item.defaultCostPerShare > 0 ? (gainLoss / item.defaultCostPerShare) * 100 : 0;
                  const isPos      = gainLoss >= 0;

                  return (
                    <TableRow
                      key={item.id}
                      className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${
                        i === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      {/* Asset symbol */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-black text-[#2B2F77] dark:text-[#3B82F6] font-mono leading-none">
                              {(item.asset?.symbol ?? "??").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                              {item.asset?.symbol ?? "—"}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                              {item.asset?.description ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Portfolio */}
                      <TableCell className="py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                          {item.portfolio?.name ?? "—"}
                        </span>
                      </TableCell>

                      {/* Asset class */}
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 text-[#2B2F77] dark:text-[#3B82F6] border border-[#2B2F77]/20 dark:border-[#3B82F6]/20">
                          {item.asset?.assetClass ?? "—"}
                        </span>
                      </TableCell>

                      {/* Default alloc % */}
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {fmtPct(item.defaultAllocationPercentage)}
                        </span>
                      </TableCell>

                      {/* Close price */}
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {fmt$(closePrice)}
                        </span>
                      </TableCell>

                      {/* vs default */}
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPos
                            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span className={`text-sm font-medium ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {isPos ? "+" : ""}{fmtPct(gainPct)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openView(item)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(item)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#2B2F77] dark:hover:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openDelete(item)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10" title="Remove">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {items.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
            {query.trim()
              ? `Showing ${filtered.length} of ${items.length} link${items.length !== 1 ? "s" : ""}`
              : `Showing ${items.length} link${items.length !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {/* Dialogs */}
      <FormDialog
        open={formOpen}
        mode={formMode}
        item={selected}
        allAssets={allAssets}
        allPortfolios={allPortfolios}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
      <ViewDialog
        item={selected}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onEdit={() => { setViewOpen(false); setFormMode("edit"); setFormOpen(true); }}
        onDelete={() => { setViewOpen(false); setDeleteOpen(true); }}
      />
      <DeleteDialog
        item={selected}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}