"use client"

import { useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Withdrawal } from "@/actions/withdraws"

type Period   = "daily" | "weekly" | "monthly" | "quarterly" | "annually"
type WType    = "all" | "HARD_WITHDRAWAL" | "REDEMPTION"

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily",     label: "Daily" },
  { value: "weekly",    label: "Weekly" },
  { value: "monthly",   label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually",  label: "Annually" },
]

const W_TYPES: { value: WType; label: string }[] = [
  { value: "all",              label: "All Withdrawals" },
  { value: "HARD_WITHDRAWAL",  label: "Cash Outs" },
  { value: "REDEMPTION",       label: "Redemptions" },
]

interface TrendPoint {
  label: string
  amount: number
  count:  number
}

function buildDaily(ws: Withdrawal[]): TrendPoint[] {
  const now = new Date()
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (29 - i))
    const key   = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    const m = ws.filter(w => (w.createdAt ?? "").slice(0, 10) === key)
    return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  })
}

function buildWeekly(ws: Withdrawal[]): TrendPoint[] {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const weekEnd   = new Date(now); weekEnd.setDate(now.getDate() - i * 7)
    const weekStart = new Date(weekEnd); weekStart.setDate(weekEnd.getDate() - 6)
    const startKey  = weekStart.toISOString().slice(0, 10)
    const endKey    = weekEnd.toISOString().slice(0, 10)
    const label     = weekStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    const m = ws.filter(w => { const ds = (w.createdAt ?? "").slice(0, 10); return ds >= startKey && ds <= endKey })
    return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  }).reverse()
}

function buildMonthly(ws: Withdrawal[]): TrendPoint[] {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d     = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    const m = ws.filter(w => (w.createdAt ?? "").slice(0, 7) === key)
    return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  })
}

function buildQuarterly(ws: Withdrawal[]): TrendPoint[] {
  const now      = new Date()
  const currentQ = Math.floor(now.getMonth() / 3)
  return Array.from({ length: 8 }, (_, i) => {
    let q = currentQ - (7 - i); let year = now.getFullYear()
    while (q < 0) { q += 4; year-- }
    const startMonth = q * 3
    const endMonth   = startMonth + 2
    const startKey   = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`
    const endKey     = new Date(year, endMonth + 1, 0).toISOString().slice(0, 10)
    const label      = `Q${q + 1} ${year}`
    const m = ws.filter(w => { const ds = (w.createdAt ?? "").slice(0, 10); return ds >= startKey && ds <= endKey })
    return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  })
}

function buildAnnually(ws: Withdrawal[]): TrendPoint[] {
  const now = new Date()
  return Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - (4 - i)
    const m    = ws.filter(w => (w.createdAt ?? "").slice(0, 4) === String(year))
    return { label: String(year), amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  })
}

function formatAmount(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {p.dataKey === "amount" ? `$${Number(p.value).toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WithdrawalTrendChart({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const [period,  setPeriod]  = useState<Period>("monthly")
  const [wType,   setWType]   = useState<WType>("all")

  const filtered = useMemo(
    () => wType === "all" ? withdrawals : withdrawals.filter(w => w.withdrawalType === wType),
    [withdrawals, wType],
  )

  const data = useMemo<TrendPoint[]>(() => {
    switch (period) {
      case "daily":     return buildDaily(filtered)
      case "weekly":    return buildWeekly(filtered)
      case "quarterly": return buildQuarterly(filtered)
      case "annually":  return buildAnnually(filtered)
      default:          return buildMonthly(filtered)
    }
  }, [filtered, period])

  const hasData = data.some(d => d.amount > 0 || d.count > 0)

  return (
    <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3">
          {/* Title + period selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-slate-900 dark:text-white text-base">Withdrawal Trend</CardTitle>
            <div className="flex gap-1 flex-wrap">
              {PERIODS.map(({ value, label }) => (
                <Button
                  key={value}
                  size="sm"
                  variant={period === value ? "default" : "outline"}
                  onClick={() => setPeriod(value)}
                  className={
                    period === value
                      ? "h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "h-7 text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Withdrawal type tabs */}
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
            {W_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setWType(value)}
                className={[
                  "px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-colors",
                  wType === value
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                ].join(" ")}
              >
                {label}
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({value === "all"
                    ? withdrawals.length
                    : withdrawals.filter(w => w.withdrawalType === value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-52 text-slate-400 text-sm">
            No withdrawal data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradWAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradWCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700/50" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-slate-500 dark:text-slate-400"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="amount"
                orientation="left"
                tickFormatter={formatAmount}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-slate-500 dark:text-slate-400"
                tickLine={false}
                axisLine={false}
                width={55}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-slate-500 dark:text-slate-400"
                tickLine={false}
                axisLine={false}
                width={30}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => (
                  <span className="text-slate-600 dark:text-slate-400">{value}</span>
                )}
              />
              <Area
                yAxisId="amount"
                type="monotone"
                dataKey="amount"
                name="Total Amount"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradWAmount)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                yAxisId="count"
                type="monotone"
                dataKey="count"
                name="No. of Withdrawals"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#gradWCount)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
