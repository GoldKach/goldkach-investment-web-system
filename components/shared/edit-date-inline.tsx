"use client";

import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditDateInlineProps {
  label: string;
  value: string;                               // ISO string to display
  onSave: (isoDate: string) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
}

export function EditDateInline({ label, value, onSave, disabled }: EditDateInlineProps) {
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [draft,   setDraft]     = useState("");

  function startEdit() {
    // Convert ISO → datetime-local format (YYYY-MM-DDTHH:mm)
    setDraft(new Date(value).toISOString().slice(0, 16));
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const iso = new Date(draft).toISOString();
      const res = await onSave(iso);
      if (res.success) {
        toast.success(`${label} updated`);
        setEditing(false);
      } else {
        toast.error(res.error ?? `Failed to update ${label}`);
      }
    } catch {
      toast.error(`Failed to update ${label}`);
    } finally {
      setSaving(false);
    }
  }

  const displayValue = new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  if (!editing) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white text-sm font-medium">{displayValue}</span>
          {!disabled && (
            <button
              onClick={startEdit}
              className="text-muted-foreground hover:text-blue-500 transition-colors p-0.5 rounded"
              title={`Edit ${label}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Input
          type="datetime-local"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={saving}
          className="h-8 text-sm flex-1"
          autoFocus
        />
        <button
          onClick={save}
          disabled={saving || !draft}
          className="flex items-center justify-center h-8 w-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
          title="Save"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={cancel}
          disabled={saving}
          className="flex items-center justify-center h-8 w-8 rounded-md border border-border hover:bg-muted text-muted-foreground transition-colors"
          title="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
