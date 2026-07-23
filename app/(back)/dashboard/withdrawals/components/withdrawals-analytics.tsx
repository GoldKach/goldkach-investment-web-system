"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, Calendar, BarChart2, ChevronDown, ChevronUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { Withdrawal } from "@/actions/withdraws"

// ── helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toLocaleString()}`

const fmtFull = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function isoToday() { return new Date().toISOString().slice(0, 10) }

function periodRange(ws: Withdrawal[], from: string, to: string) {
  const matched = ws.filter(w => {
    const ds = (w.createdAt ?? "").slice(0, 10)
    return ds >= from && ds <= to && w.transactionStatus === "APPROVED"
  })
  return { count: matched.length, amount: matched.reduce((s, w) => s + w.amount, 0) }
}

function computePeriods(ws: Withdrawal[]) {
  const now     = new Date()
  const today   = isoToday()

  // This week (Sun–today)
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
  const weekStartStr = weekStart.toISOString().slice(0, 10)

  // This month
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`

  // Last 3 months
  const m3 = new Date(now); m3.setMonth(now.getMonth() - 3)
  const m3Str = m3.toISOString().slice(0, 10)

  // Last quarter (prev calendar quarter)
  const currentQ   = Math.floor(now.getMonth() / 3)
  const prevQStart = new Date(now.getFullYear(), (currentQ - 1) * 3, 1)
  const prevQEnd   = new Date(now.getFullYear(), currentQ * 3, 0)
  const prevQStartStr = prevQStart.toISOString().slice(0, 10)
  const prevQEndStr   = prevQEnd.toISOString().slice(0, 10)

  // Last year
  const lastYearStr = `${now.getFullYear() - 1}-01-01`
  const lastYearEnd = `${now.getFullYear() - 1}-12-31`

  return {
    today:       periodRange(ws, today, today),
    thisWeek:    periodRange(ws, weekStartStr, today),
    thisMonth:   periodRange(ws, monthStartStr, today),
    last3Months: periodRange(ws, m3Str, today),
    lastQuarter: periodRange(ws, prevQStartStr, prevQEndStr),
    lastYear:    periodRange(ws, lastYearStr, lastYearEnd),
  }
}

type ChartTab = "daily" | "weekly" | "monthly"

function buildChartData(ws: Withdrawal[], tab: ChartTab) {
  const now      = new Date()
  const approved = ws.filter(w => w.transactionStatus === "APPROVED")

  if (tab === "daily") {
    return Array.from({ length: 30 }, (_, i) => {
      const d     = new Date(now); d.setDate(now.getDate() - (29 - i))
      const key   = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
      const m     = approved.filter(w => (w.createdAt ?? "").slice(0, 10) === key)
      return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
    })
  }

  if (tab === "weekly") {
    return Array.from({ length: 12 }, (_, i) => {
      const weekEnd   = new Date(now); weekEnd.setDate(now.getDate() - i * 7)
      const weekStart = new Date(weekEnd); weekStart.setDate(weekEnd.getDate() - 6)
      const startKey  = weekStart.toISOString().slice(0, 10)
      const endKey    = weekEnd.toISOString().slice(0, 10)
      const label     = weekStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
      const m = approved.filter(w => { const ds = (w.createdAt ?? "").slice(0, 10); return ds >= startKey && ds <= endKey })
      return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
    }).reverse()
  }

  // monthly
  return Array.from({ length: 12 }, (_, i) => {
    const d     = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    const m     = approved.filter(w => (w.createdAt ?? "").slice(0, 7) === key)
    return { label, amount: m.reduce((s, w) => s + w.amount, 0), count: m.length }
  })
}

// ── subcomponents ────────────────────────────────────────────────────────────

function PeriodCard({ label, count, amount, color }: { label: string; count: number; amount: number; color: string }) {
  return (
    <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
      <CardContent className="pt-4 pb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{fmt(amount)}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {count} withdrawal{count !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      <p className="text-blue-600 dark:text-blue-400 font-semibold">{fmtFull(payload[0]?.value ?? 0)}</p>
      <p className="text-slate-400 text-xs">{payload[0]?.payload?.count ?? 0} withdrawals</p>
    </div>
  )
}

// ── main component ───────────────────────────────────────────────────────────

export function WithdrawalsAnalytics({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState<ChartTab>("monthly")

  const periods   = useMemo(() => computePeriods(withdrawals), [withdrawals])
  const chartData = useMemo(() => buildChartData(withdrawals, tab), [withdrawals, tab])

  const chartLabels: Record<ChartTab, string> = {
    daily:   "Last 30 days",
    weekly:  "Last 12 weeks",
    monthly: "Last 12 months",
  }

  const periodCards = [
    { label: "Today",         color: "text-blue-600 dark:text-blue-400",    ...periods.today },
    { label: "This Week",     color: "text-indigo-600 dark:text-indigo-400", ...periods.thisWeek },
    { label: "This Month",    color: "text-violet-600 dark:text-violet-400", ...periods.thisMonth },
    { label: "Last 3 Months", color: "text-purple-600 dark:text-purple-400", ...periods.last3Months },
    { label: "Last Quarter",  color: "text-fuchsia-600 dark:text-fuchsia-400", ...periods.lastQuarter },
    { label: "Last Year",     color: "text-green-600 dark:text-green-400",   ...periods.lastYear },
  ]

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Withdrawal Analytics</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(c => !c)}
          className="text-slate-500 dark:text-slate-400 h-8 gap-1"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          {collapsed ? "Show" : "Hide"}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Period stat cards */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {periodCards.map(c => (
              <PeriodCard key={c.label} label={c.label} count={c.count} amount={c.amount} color={c.color} />
            ))}
          </div>

          {/* Bar chart */}
          <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-slate-400" />
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {chartLabels[tab]} — Approved Withdrawals
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  {(["daily", "weekly", "monthly"] as ChartTab[]).map(t => (
                    <Button
                      key={t}
                      size="sm"
                      variant={tab === t ? "default" : "outline"}
                      onClick={() => setTab(t)}
                      className="h-7 text-xs capitalize"
                    >
                      {t === "daily" ? "Daily" : t === "weekly" ? "Weekly" : "Monthly"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chartData.every(d => d.amount === 0) ? (
                <div className="flex items-center justify-center h-48 text-sm text-slate-400">
                  <Calendar className="h-4 w-4 mr-2" /> No approved withdrawals in this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[stroke:#1e293b]" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={v => fmt(v)}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      width={56}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
