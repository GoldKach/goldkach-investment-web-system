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
import type { Deposit } from "@/actions/deposits"

type Period   = "daily" | "weekly" | "monthly" | "quarterly" | "annually"
type DepType  = "all" | "MASTER" | "ALLOCATION"

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily",     label: "Daily" },
  { value: "weekly",    label: "Weekly" },
  { value: "monthly",   label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually",  label: "Annually" },
]

const DEP_TYPES: { value: DepType; label: string; color: string }[] = [
  { value: "all",        label: "All Deposits", color: "text-slate-600 dark:text-slate-300" },
  { value: "MASTER",     label: "External",     color: "text-blue-600 dark:text-blue-400" },
  { value: "ALLOCATION", label: "Allocations",  color: "text-purple-600 dark:text-purple-400" },
]

interface TrendPoint {
  label: string
  amount: number
  count:  number
}

function buildDaily(deposits: Deposit[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    const matching = deposits.filter(dep => (dep.createdAt ?? "").slice(0, 10) === key)
    points.push({ label, amount: matching.reduce((s, x) => s + x.amount, 0), count: matching.length })
  }
  return points
}

function buildWeekly(deposits: Deposit[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const weekEnd = new Date(now)
    weekEnd.setDate(now.getDate() - i * 7)
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)
    const startKey = weekStart.toISOString().slice(0, 10)
    const endKey   = weekEnd.toISOString().slice(0, 10)
    const label = weekStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
    const matching = deposits.filter(dep => {
      const ds = (dep.createdAt ?? "").slice(0, 10)
      return ds >= startKey && ds <= endKey
    })
    points.push({ label, amount: matching.reduce((s, x) => s + x.amount, 0), count: matching.length })
  }
  return points
}

function buildMonthly(deposits: Deposit[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year  = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const key   = `${year}-${month}`
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    const matching = deposits.filter(dep => (dep.createdAt ?? "").slice(0, 7) === key)
    points.push({ label, amount: matching.reduce((s, x) => s + x.amount, 0), count: matching.length })
  }
  return points
}

function buildQuarterly(deposits: Deposit[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const now = new Date()
  const currentQ = Math.floor(now.getMonth() / 3)
  for (let i = 7; i >= 0; i--) {
    let q = currentQ - i
    let year = now.getFullYear()
    while (q < 0) { q += 4; year-- }
    const startMonth = q * 3
    const endMonth   = startMonth + 2
    const startKey = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`
    const endKey   = new Date(year, endMonth + 1, 0).toISOString().slice(0, 10)
    const label    = `Q${q + 1} ${year}`
    const matching = deposits.filter(dep => {
      const ds = (dep.createdAt ?? "").slice(0, 10)
      return ds >= startKey && ds <= endKey
    })
    points.push({ label, amount: matching.reduce((s, x) => s + x.amount, 0), count: matching.length })
  }
  return points
}

function buildAnnually(deposits: Deposit[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const now = new Date()
  for (let i = 4; i >= 0; i--) {
    const year  = now.getFullYear() - i
    const matching = deposits.filter(dep => (dep.createdAt ?? "").slice(0, 4) === String(year))
    points.push({ label: String(year), amount: matching.reduce((s, x) => s + x.amount, 0), count: matching.length })
  }
  return points
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

export function DepositTrendChart({ deposits }: { deposits: Deposit[] }) {
  const [period,  setPeriod]  = useState<Period>("monthly")
  const [depType, setDepType] = useState<DepType>("all")

  const filteredByType = useMemo(
    () => depType === "all" ? deposits : deposits.filter(d => d.depositTarget === depType),
    [deposits, depType],
  )

  const data = useMemo<TrendPoint[]>(() => {
    switch (period) {
      case "daily":     return buildDaily(filteredByType)
      case "weekly":    return buildWeekly(filteredByType)
      case "quarterly": return buildQuarterly(filteredByType)
      case "annually":  return buildAnnually(filteredByType)
      default:          return buildMonthly(filteredByType)
    }
  }, [filteredByType, period])

  const hasData = data.some(d => d.amount > 0 || d.count > 0)

  return (
    <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3">
          {/* Top row: title + period selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-slate-900 dark:text-white text-base">Deposit Trend</CardTitle>
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

          {/* Bottom row: deposit type tabs */}
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 pb-0">
            {DEP_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDepType(value)}
                className={[
                  "px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-colors",
                  depType === value
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                ].join(" ")}
              >
                {label}
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({value === "all"
                    ? deposits.length
                    : deposits.filter(d => d.depositTarget === value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-52 text-slate-400 text-sm">
            No deposit data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
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
                fill="url(#gradAmount)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                yAxisId="count"
                type="monotone"
                dataKey="count"
                name="No. of Deposits"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#gradCount)"
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
