// components/back/asset-management.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import {
  createAsset,
  updateAsset,
  deleteAsset,
  type Asset,
  type AssetCreateInput,
  type AssetUpdateInput,
} from "@/actions/assets";

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
  TrendingDown,
  BarChart3,
  DollarSign,
  Layers,
  Tag,
  Calendar,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Brand tokens — navy #2B2F77 / blue #3B82F6                                */
/* -------------------------------------------------------------------------- */

type AssetClass = "EQUITIES" | "ETFS" | "REITS" | "BONDS" | "CASH" | "OTHERS";

type Props = { initialAssets: Asset[] };

type FormState = {
  symbol: string;
  description: string;
  sector: string;
  assetClass: AssetClass;
  defaultAllocationPercentage: string;
  defaultCostPerShare: string;
  closePrice: string;
};

const EMPTY_FORM: FormState = {
  symbol: "",
  description: "",
  sector: "",
  assetClass: "EQUITIES",
  defaultAllocationPercentage: "0",
  defaultCostPerShare: "0",
  closePrice: "0",
};

const ASSET_CLASSES: { value: AssetClass; label: string }[] = [
  { value: "EQUITIES", label: "Equities" },
  { value: "ETFS",     label: "ETFs"     },
  { value: "REITS",    label: "REITs"    },
  { value: "BONDS",    label: "Bonds"    },
  { value: "CASH",     label: "Cash"     },
  { value: "OTHERS",   label: "Others"   },
];

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

const fmtPct = (v: number) => `${v.toFixed(2)}%`;

const fmtDate = (s: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(s));

function AssetClassBadge({ cls }: { cls?: string }) {
  const map: Record<string, string> = {
    EQUITIES: "bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 text-[#2B2F77] dark:text-[#3B82F6] border-[#2B2F77]/20 dark:border-[#3B82F6]/20",
    ETFS:     "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    REITS:    "bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20",
    BONDS:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    CASH:     "bg-slate-500/10  text-slate-600  dark:text-slate-400  border-slate-500/20",
    OTHERS:   "bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[cls ?? ""] ?? map.OTHERS}`}>
      {cls ?? "N/A"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  View dialog                                                                 */
/* -------------------------------------------------------------------------- */

function ViewDialog({
  asset,
  open,
  onClose,
  onEdit,
  onDelete,
}: {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!asset) return null;
  const gainLoss    = asset.closePrice - asset.defaultCostPerShare;
  const gainLossPct = asset.defaultCostPerShare > 0 ? (gainLoss / asset.defaultCostPerShare) * 100 : 0;
  const isPositive  = gainLoss >= 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center">
              <span className="text-xs font-black text-[#2B2F77] dark:text-[#3B82F6] font-mono leading-none">
                {asset.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <span className="font-black font-mono">{asset.symbol}</span>
              <AssetClassBadge cls={asset.assetClass} />
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {asset.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Price cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Current Price</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{fmt$(asset.closePrice)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                {isPositive
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                <span className="text-xs text-slate-500 dark:text-slate-400">Performance</span>
              </div>
              <p className={`text-lg font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {isPositive ? "+" : ""}{fmtPct(gainLossPct)}
              </p>
              <p className={`text-xs ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                {isPositive ? "+" : ""}{fmt$(gainLoss)}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              
              { label: "Default Allocation %", value: fmtPct(asset.defaultAllocationPercentage), icon: Layers     },
              { label: "Sector",               value: asset.sector,                               icon: Tag        },
              { label: "Asset Class",          value: asset.assetClass ?? "N/A",                  icon: BarChart3  },
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

          {/* Dates */}
          {(asset.createdAt || asset.updatedAt) && (
            <div className="grid grid-cols-2 gap-3">
              {asset.createdAt && (
                <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Created</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmtDate(asset.createdAt)}</p>
                </div>
              )}
              {asset.updatedAt && (
                <div className="bg-slate-50 dark:bg-[#161b4a]/60 border border-slate-100 dark:border-[#2B2F77]/30 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <RefreshCw className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Updated</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{fmtDate(asset.updatedAt)}</p>
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div className="bg-[#2B2F77]/5 dark:bg-[#3B82F6]/5 border border-[#2B2F77]/15 dark:border-[#3B82F6]/15 rounded-xl p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-[#2B2F77] dark:text-[#3B82F6]">Note: </span>
              These are template defaults. Users can customise their own allocation and cost basis when enrolling.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={onEdit}
              className="flex-1 h-9 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-sm font-semibold"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit Asset
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              className="h-9 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
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
  asset,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: "create" | "edit";
  asset: Asset | null;
  onClose: () => void;
  onSaved: (a: Asset) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setForm(
        asset
          ? {
              symbol:                      asset.symbol,
              description:                 asset.description,
              sector:                      asset.sector,
              assetClass:                  (asset.assetClass as AssetClass) ?? "EQUITIES",
              defaultAllocationPercentage: String(asset.defaultAllocationPercentage ?? 0),
              defaultCostPerShare:         String(asset.defaultCostPerShare ?? 0),
              closePrice:                  String(asset.closePrice ?? 0),
            }
          : EMPTY_FORM
      );
    }
  }, [open, asset]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symbol.trim() || !form.description.trim() || !form.sector.trim()) {
      toast.error("Symbol, description and sector are required.");
      return;
    }
    startTransition(async () => {
      const payload = {
        symbol:                      form.symbol.trim().toUpperCase(),
        description:                 form.description.trim(),
        sector:                      form.sector.trim(),
        assetClass:                  form.assetClass,
        defaultAllocationPercentage: parseFloat(form.defaultAllocationPercentage) || 0,
        defaultCostPerShare:         parseFloat(form.defaultCostPerShare) || 0,
        closePrice:                  parseFloat(form.closePrice) || 0,
      };

      const res =
        mode === "create"
          ? await createAsset(payload as AssetCreateInput)
          : await updateAsset(asset!.id, payload as AssetUpdateInput);

      if (!res.success || !res.data) {
        toast.error(res.error ?? "Failed to save asset.");
        return;
      }
      toast.success(mode === "create" ? "Asset created." : "Asset updated.");
      onSaved(res.data);
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-[#2B2F77] via-[#3B82F6] to-[#2B2F77]" />

        <DialogHeader className="pt-2">
          <DialogTitle className="text-slate-900 dark:text-white">
            {mode === "create" ? "Add New Asset" : "Edit Asset"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {mode === "create"
              ? "Create a new asset with default allocation and cost values."
              : `Update details for ${asset?.symbol}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          {/* Symbol */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Symbol <span className="text-rose-500">*</span>
            </Label>
            <Input
              placeholder="e.g., AAPL"
              value={form.symbol}
              onChange={set("symbol")}
              required
              className={`${inputCls} font-mono uppercase`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              Description <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              placeholder="e.g., Apple Inc."
              value={form.description}
              onChange={set("description")}
              required
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Sector + Asset Class */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Sector <span className="text-rose-500">*</span>
              </Label>
              <Input
                placeholder="e.g., Technology"
                value={form.sector}
                onChange={set("sector")}
                required
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Asset Class <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={form.assetClass}
                onValueChange={(v) => setForm((p) => ({ ...p, assetClass: v as AssetClass }))}
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  {ASSET_CLASSES.map(({ value, label }) => (
                    <SelectItem key={value} value={value} className={selectItemCls}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Numeric fields */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "defaultAllocationPercentage" as const, label: "Default Alloc %", hint: "Suggested %" },
              
              { key: "closePrice"                   as const, label: "Current Price",  hint: "Market price" },
            ].map(({ key, label, hint }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 text-sm font-medium">{label}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form[key]}
                  onChange={set(key)}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9"
            >
              {isPending
                ? mode === "create" ? "Creating..." : "Saving..."
                : mode === "create" ? "Create Asset" : "Save Changes"}
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
  asset,
  open,
  onClose,
  onDeleted,
}: {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!asset) return;
    startTransition(async () => {
      const res = await deleteAsset(asset.id);
      if (!res.success) {
        toast.error(res.error ?? "Failed to delete asset.");
        return;
      }
      toast.success(`${asset.symbol} deleted.`);
      onDeleted(asset.id);
      onClose();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50">
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-rose-500" />
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            Delete Asset
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-bold font-mono text-slate-700 dark:text-slate-200">
              {asset?.symbol}
            </span>{" "}
            ({asset?.description})? This will remove it from all portfolios and affect any user allocations. This cannot be undone.
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
            {isPending ? "Deleting..." : "Delete Asset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                              */
/* -------------------------------------------------------------------------- */

export function AssetManagement({ initialAssets }: Props) {
  const [assets,     setAssets]     = useState<Asset[]>(initialAssets);
  const [formOpen,   setFormOpen]   = useState(false);
  const [formMode,   setFormMode]   = useState<"create" | "edit">("create");
  const [selected,   setSelected]   = useState<Asset | null>(null);
  const [viewOpen,   setViewOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [query,      setQuery]      = useState("");

  const openCreate = () => { setSelected(null); setFormMode("create"); setFormOpen(true); };
  const openEdit   = (a: Asset) => { setSelected(a); setFormMode("edit"); setFormOpen(true); };
  const openView   = (a: Asset) => { setSelected(a); setViewOpen(true); };
  const openDelete = (a: Asset) => { setSelected(a); setDeleteOpen(true); };

  const handleSaved = (saved: Asset) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };

  const handleDeleted = (id: string) => setAssets((prev) => prev.filter((a) => a.id !== id));

  const byClass = (cls: AssetClass) => assets.filter((a) => a.assetClass === cls).length;

  const filtered = query.trim()
    ? assets.filter((a) =>
        a.symbol.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.sector.toLowerCase().includes(query.toLowerCase()) ||
        (a.assetClass ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : assets;

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
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Assets</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {assets.length} asset{assets.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold h-9 shadow-lg shadow-[#2B2F77]/20 dark:shadow-[#3B82F6]/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Asset
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Assets", value: assets.length,      color: "text-[#3B82F6]" },
            { label: "Equities",     value: byClass("EQUITIES"), color: "text-[#2B2F77] dark:text-[#3B82F6]" },
            { label: "ETFs",         value: byClass("ETFS"),     color: "text-violet-600 dark:text-violet-400" },
            { label: "Bonds",        value: byClass("BONDS"),    color: "text-emerald-600 dark:text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/30 rounded-2xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol, description, sector or class…"
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
                <BarChart3 className="w-7 h-7 text-[#2B2F77] dark:text-[#3B82F6]" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">No assets yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                Add your first asset to start building portfolio templates.
              </p>
              <Button
                onClick={openCreate}
                className="bg-[#2B2F77] hover:bg-[#1a1f5e] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white h-9 text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Asset
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-[#0a0d24] border-b border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-50 dark:hover:bg-[#0a0d24]">
                  {["Symbol", "Description", "Sector", "Class", "Default Alloc %", "Close Price", "Performance", "Actions"].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-3.5 ${i === 0 ? "px-6" : ""} ${i >= 4 ? "text-right" : ""} ${i === 8 ? "pr-6" : ""}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((a, i) => {
                  const gainLoss    = a.closePrice - a.defaultCostPerShare;
                  const gainLossPct = a.defaultCostPerShare > 0 ? (gainLoss / a.defaultCostPerShare) * 100 : 0;
                  const isPositive  = gainLoss >= 0;

                  return (
                    <TableRow
                      key={a.id}
                      className={`border-b border-slate-100 dark:border-[#2B2F77]/20 hover:bg-slate-50 dark:hover:bg-[#161b4a]/40 transition-colors ${
                        i === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      {/* Symbol */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#2B2F77]/10 dark:bg-[#3B82F6]/10 border border-[#2B2F77]/20 dark:border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-black text-[#2B2F77] dark:text-[#3B82F6] font-mono leading-none">
                              {a.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                            {a.symbol}
                          </span>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="py-4 max-w-[180px]">
                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate block">
                          {a.description}
                        </span>
                      </TableCell>

                      {/* Sector */}
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#161b4a]/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2B2F77]/30">
                          {a.sector}
                        </span>
                      </TableCell>

                      {/* Asset class */}
                      <TableCell className="py-4">
                        <AssetClassBadge cls={a.assetClass} />
                      </TableCell>

                      {/* Default alloc */}
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {fmtPct(a.defaultAllocationPercentage)}
                        </span>
                      </TableCell>

                      {/* Close price */}
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {fmt$(a.closePrice)}
                        </span>
                      </TableCell>

                      {/* Performance */}
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPositive
                            ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span className={`text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {isPositive ? "+" : ""}{fmtPct(gainLossPct)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openView(a)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(a)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-[#2B2F77] dark:hover:text-[#3B82F6] hover:bg-[#2B2F77]/10 dark:hover:bg-[#3B82F6]/10" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openDelete(a)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10" title="Delete">
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

        {assets.length > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
            {query.trim()
              ? `Showing ${filtered.length} of ${assets.length} asset${assets.length !== 1 ? "s" : ""}`
              : `Showing ${assets.length} asset${assets.length !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {/* Dialogs */}
      <FormDialog
        open={formOpen}
        mode={formMode}
        asset={selected}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
      <ViewDialog
        asset={selected}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onEdit={() => { setViewOpen(false); setFormMode("edit"); setFormOpen(true); }}
        onDelete={() => { setViewOpen(false); setDeleteOpen(true); }}
      />
      <DeleteDialog
        asset={selected}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}