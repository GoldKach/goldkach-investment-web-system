"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Calendar, Eye } from "lucide-react"
import { ReportPdfViewer } from "@/components/user/report-pdf-viewer"

interface Report {
  id: string
  date: string
  type: "daily" | "monthly" | "yearly"
  totalDeposits: number
  totalWithdrawals: number
  netFlow: number
  transactionCount: number
  createdAt: string
}

const sampleReports: Report[] = [
  {
    id: "1",
    date: "November 19, 2024",
    type: "daily",
    totalDeposits: 1500,
    totalWithdrawals: 800,
    netFlow: 700,
    transactionCount: 8,
    createdAt: "2024-11-19",
  },
  {
    id: "2",
    date: "November 18, 2024",
    type: "daily",
    totalDeposits: 2000,
    totalWithdrawals: 1200,
    netFlow: 800,
    transactionCount: 12,
    createdAt: "2024-11-18",
  },
  {
    id: "3",
    date: "November 2024",
    type: "monthly",
    totalDeposits: 35000,
    totalWithdrawals: 18000,
    netFlow: 17000,
    transactionCount: 145,
    createdAt: "2024-11-01",
  },
  {
    id: "4",
    date: "October 2024",
    type: "monthly",
    totalDeposits: 32000,
    totalWithdrawals: 16500,
    netFlow: 15500,
    transactionCount: 132,
    createdAt: "2024-10-01",
  },
  {
    id: "5",
    date: "2024",
    type: "yearly",
    totalDeposits: 150000,
    totalWithdrawals: 78000,
    netFlow: 72000,
    transactionCount: 892,
    createdAt: "2024-01-01",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [selectedType, setSelectedType] = useState<"all" | "daily" | "monthly" | "yearly">("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = reports.filter((report) => {
    if (selectedType !== "all" && report.type !== selectedType) return false
    if (selectedDate && report.createdAt !== selectedDate) return false
    return true
  })

  const generateReport = () => {
    if (!selectedDate && selectedType === "all") {
      alert("Please select a date and report type")
      return
    }

    const newReport: Report = {
      id: Math.random().toString(),
      date: selectedDate || new Date().toLocaleDateString(),
      type: selectedType === "all" ? "daily" : selectedType,
      totalDeposits: Math.floor(Math.random() * 50000) + 1000,
      totalWithdrawals: Math.floor(Math.random() * 30000) + 500,
      netFlow: 0,
      transactionCount: Math.floor(Math.random() * 200) + 10,
      createdAt: selectedDate || new Date().toISOString().split("T")[0],
    }
    newReport.netFlow = newReport.totalDeposits - newReport.totalWithdrawals

    setReports([newReport, ...reports])
    setSelectedDate("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
            <p className="text-slate-400">Generate and view financial reports</p>
          </div>

          {/* Generate Report Section */}
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
            <h2 className="text-white font-semibold mb-4">Generate Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Report Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Select Type</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={generateReport} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                  onClick={() => (window.location.href = "/")}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-lg">Available Reports</h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{report.date}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">Generated on {report.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setSelectedReport(report)}
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Total Deposits</p>
                      <p className="text-white font-semibold text-lg">${report.totalDeposits.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Total Withdrawals</p>
                      <p className="text-white font-semibold text-lg">${report.totalWithdrawals.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Net Flow</p>
                      <p className={`font-semibold text-lg ${report.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ${report.netFlow.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Transactions</p>
                      <p className="text-white font-semibold text-lg">{report.transactionCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReportPdfViewer report={selectedReport!} isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} />
    </main>
  )
}
