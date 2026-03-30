"use client";

type Period = "daily" | "weekly" | "monthly";

interface PeriodFilterProps {
  value: Period;
  onChange: (p: Period) => void;
}

const options: { label: string; value: Period }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-[#2B2F77]/30 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-[#2B2F77] dark:bg-[#3B82F6] text-white"
              : "bg-white dark:bg-[#0a0d24] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2B2F77]/20"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
