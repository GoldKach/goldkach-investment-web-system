"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, BarChart2, ChevronDown, ChevronUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { DepositsAnalyticsData } from "@/actions/deposits"

interface DepositsAnalyticsProps {
  analytics: DepositsAnalyticsData
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toLocaleString()}`

const fmtFull = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function PeriodCard({
  label,
  count,
  amount,
  color,
}: {
  label: string
  count: number
  amount: number
  color: string
}) {
  return (
    <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
      <CardContent className="pt-4 pb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{fmt(amount)}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {count} deposit{count !== 1 ? "s" : ""}
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
      <p className="text-green-600 dark:text-green-400 font-semibold">{fmtFull(payload[0]?.value ?? 0)}</p>
      <p className="text-slate-400 text-xs">{payload[0]?.payload?.count ?? 0} deposits</p>
    </div>
  )
}

type ChartTab = "daily" | "weekly" | "monthly"

export function DepositsAnalytics({ analytics }: DepositsAnalyticsProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState<ChartTab>("monthly")

  const { periods, daily, weekly, monthly } = analytics

  const chartData: Record<ChartTab, { label: string; amount: number; count: number }[]> = {
    daily:   daily,
    weekly:  weekly,
    monthly: monthly,
  }

  const chartLabels: Record<ChartTab, string> = {
    daily:   "Last 30 days",
    weekly:  "Last 12 weeks",
    monthly: "Last 12 months",
  }

  const periodCards = [
    { label: "Today",        color: "text-blue-600 dark:text-blue-400",   ...periods.today },
    { label: "This Week",    color: "text-indigo-600 dark:text-indigo-400", ...periods.thisWeek },
    { label: "This Month",   color: "text-violet-600 dark:text-violet-400", ...periods.thisMonth },
    { label: "Last 3 Months", color: "text-purple-600 dark:text-purple-400", ...periods.last3Months },
    { label: "Last Quarter", color: "text-fuchsia-600 dark:text-fuchsia-400", ...periods.lastQuarter },
    { label: "Last Year",    color: "text-green-600 dark:text-green-400",  ...periods.lastYear },
  ]

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Deposit Analytics</h2>
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

          {/* Chart */}
          <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {chartLabels[tab]} — Approved Deposits
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
              {chartData[tab].length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-slate-400">
                  <Calendar className="h-4 w-4 mr-2" /> No approved deposits in this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData[tab]} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
