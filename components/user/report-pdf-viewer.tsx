"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

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

interface ReportPdfViewerProps {
  report: Report
  isOpen: boolean
  onClose: () => void
}

export function ReportPdfViewer({ report, isOpen, onClose }: ReportPdfViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async () => {
    setIsDownloading(true)
    try {
      const element = document.getElementById(`report-content-${report.id}`)
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: "#0f172a",
        scale: 2,
      })

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Report-${report.date}-${report.type}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white">{report.date} Report</h2>
          <div className="flex items-center gap-3">
            <Button onClick={downloadPdf} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </Button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div id={`report-content-${report.id}`} className="bg-slate-900 p-12 rounded-lg border border-slate-700">
            {/* Report Header */}
            <div className="mb-12 pb-8 border-b border-slate-700">
              <h1 className="text-3xl font-bold text-white mb-2">Financial Report</h1>
              <p className="text-slate-400">
                {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report for {report.date}
              </p>
              <p className="text-slate-500 text-sm mt-4">Generated on {new Date().toLocaleString()}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Deposits</p>
                <p className="text-white font-bold text-2xl">${report.totalDeposits.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Withdrawals</p>
                <p className="text-white font-bold text-2xl">${report.totalWithdrawals.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Net Flow</p>
                <p className={`font-bold text-2xl ${report.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${report.netFlow.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Transactions</p>
                <p className="text-white font-bold text-2xl">{report.transactionCount}</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Report Details</h2>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-slate-300 font-semibold mb-4">Deposits Summary</h3>
                  <div className="space-y-2 text-slate-400">
                    <p>
                      Total Amount:{" "}
                      <span className="text-white font-semibold">${report.totalDeposits.toLocaleString()}</span>
                    </p>
                    <p>
                      Average Transaction:{" "}
                      <span className="text-white font-semibold">
                        ${(report.totalDeposits / Math.max(report.transactionCount / 2, 1)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-300 font-semibold mb-4">Withdrawals Summary</h3>
                  <div className="space-y-2 text-slate-400">
                    <p>
                      Total Amount:{" "}
                      <span className="text-white font-semibold">${report.totalWithdrawals.toLocaleString()}</span>
                    </p>
                    <p>
                      Average Transaction:{" "}
                      <span className="text-white font-semibold">
                        ${(report.totalWithdrawals / Math.max(report.transactionCount / 2, 1)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
              <p>This is an official financial report. Please keep for your records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
