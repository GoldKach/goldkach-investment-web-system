




// // app/reports/reports-client.tsx (Client Component)
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Download, Calendar, Eye, TrendingUp, DollarSign, RefreshCw, Loader2 } from "lucide-react"
// import { listPerformanceReports, ListPerformanceReportsParams, PortfolioPerformanceReport } from "@/actions/portfolioPerformanceReports"
// import { listUserPortfolios } from "@/actions/user-portfolios"
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'


// // At the top of reports-client.tsx, update the interface
// interface ReportsClientProps {
//   user: {
//     id: string
//     firstName?: string
//     lastName?: string
//     name?: string
//     email?: string
//     wallet?: {
//       id: string
//       accountNumber: string
//       balance: number
//       bankFee: number
//       transactionFee: number
//       totalFees: number
//       feeAtBank: number
//       netAssetValue: number
//       status: string
//       createdAt?: string
//     } | null
//   } | null
//   initialReports: PortfolioPerformanceReport[]
//   initialPortfolioId: string | null
//   initialError?: string | null
// }


// interface Report {
//   id: string
//   date: string
//   type: "daily" | "monthly" | "yearly"
//   totalDeposits: number
//   totalWithdrawals: number
//   netFlow: number
//   transactionCount: number
//   createdAt: string
// }

// const sampleReports: Report[] = [
//   {
//     id: "1",
//     date: "November 19, 2024",
//     type: "daily",
//     totalDeposits: 1500,
//     totalWithdrawals: 800,
//     netFlow: 700,
//     transactionCount: 8,
//     createdAt: "2024-11-19",
//   },
//   {
//     id: "2",
//     date: "November 18, 2024",
//     type: "daily",
//     totalDeposits: 2000,
//     totalWithdrawals: 1200,
//     netFlow: 800,
//     transactionCount: 12,
//     createdAt: "2024-11-18",
//   },
//   {
//     id: "3",
//     date: "November 2024",
//     type: "monthly",
//     totalDeposits: 35000,
//     totalWithdrawals: 18000,
//     netFlow: 17000,
//     transactionCount: 145,
//     createdAt: "2024-11-01",
//   },
// ]

// type TabType = "financial" | "portfolio"



// export default function ReportsClient({ 
//   user, 
//   initialReports, 
//   initialPortfolioId,
//   initialError 
// }: ReportsClientProps) {
//   const [activeTab, setActiveTab] = useState<TabType>("portfolio") // Start with portfolio tab
//   const [reports, setReports] = useState<Report[]>(sampleReports)
//   const [portfolioReports, setPortfolioReports] = useState<PortfolioPerformanceReport[]>(initialReports)
//   const [selectedType, setSelectedType] = useState<"all" | "daily" | "monthly" | "yearly">("all")
//   const [selectedDate, setSelectedDate] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(initialError || null)
//   const [userPortfolioId, setUserPortfolioId] = useState<string | null>(initialPortfolioId)
//   const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

//   // Fetch portfolio reports when period changes
//   useEffect(() => {
//     if (userPortfolioId && activeTab === "portfolio") {
//       fetchPortfolioReports()
//     }
//   }, [selectedPeriod, activeTab])

//   const fetchPortfolioReports = async () => {
//     if (!userPortfolioId) return

//     try {
//       setLoading(true)
//       setError(null)

//       const params: ListPerformanceReportsParams = {
//         userPortfolioId,
//         period: selectedPeriod,
//       }

//       const result = await listPerformanceReports(params)

//       if (result.success && result.data) {
//         setPortfolioReports(result.data)
//       } else {
//         setError(result.error || "Failed to fetch portfolio reports")
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch portfolio reports")
//       console.error("Error fetching portfolio reports:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(value)
//   }


// const generatePDF = (report: PortfolioPerformanceReport) => {
//   const doc = new jsPDF('landscape')
  
//   // Extract wallet information with correct field mappings
//    const walletData = user?.wallet
//   const bankFee = walletData?.bankFee ?? 0           // Bank Costs
//   const transactionFee = walletData?.transactionFee ?? 0  // Transaction Cost
//   const feeAtBank = walletData?.feeAtBank ?? 0       // Cash at Bank
//   const totalFees = walletData?.totalFees ?? 0       // Total Fees
//   const accountNumber = walletData?.accountNumber ?? report.userPortfolio?.id?.slice(-8).toUpperCase() ?? 'N/A'
//   const netAssetValue = walletData?.netAssetValue ?? 0
  
  
//   // Title
//   doc.setFontSize(20)
//   doc.setFont('helvetica', 'bold')
//   doc.text('Portfolio Performance Report', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' })
  
//   // Client name - combine firstName and lastName if name is not available
//   const clientName = user?.name || 
//                      (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') ||
//                      user?.firstName || 
//                      'N/A'
  
//   const portfolioName = report.userPortfolio?.portfolio?.name || 'N/A'
//   const reportDateFormatted = formatDate(report.reportDate)
//   const generatedDate = formatDate(report.createdAt || new Date().toISOString())
  
//   // Portfolio Info Section
//   doc.setFontSize(11)
  
//   // Left column
//   doc.setFont('helvetica', 'bold')
//   doc.text('Client Name:', 14, 27)
//   doc.setFont('helvetica', 'normal')
//   doc.text(clientName, 50, 27)
  
//   doc.setFont('helvetica', 'bold')
//   doc.text('Portfolio:', 14, 33)
//   doc.setFont('helvetica', 'normal')
//   doc.text(portfolioName, 50, 33)
  
//   doc.setFont('helvetica', 'bold')
//   doc.text('Account Number:', 14, 39)
//   doc.setFont('helvetica', 'normal')
//   doc.text(accountNumber, 50, 39)
  
//   // Right column
//   doc.setFont('helvetica', 'bold')
//   doc.text('Report Date:', doc.internal.pageSize.getWidth() - 100, 27)
//   doc.setFont('helvetica', 'normal')
//   doc.text(reportDateFormatted, doc.internal.pageSize.getWidth() - 100, 33)
  
//   doc.setFont('helvetica', 'bold')
//   doc.text('Generated On:', doc.internal.pageSize.getWidth() - 100, 39)
//   doc.setFont('helvetica', 'normal')
//   doc.text(generatedDate, doc.internal.pageSize.getWidth() - 100, 45)
  
//   let currentY = 55

//   // Performance Summary Section
//   doc.setFontSize(14)
//   doc.setFont('helvetica', 'bold')
//   doc.setFillColor(41, 128, 185)
//   doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 8, 'F')
//   doc.setTextColor(255, 255, 255)
//   doc.text('Performance Summary', 16, currentY + 5.5)
//   doc.setTextColor(0, 0, 0)
  
//   currentY += 10

//   const summaryData = [
//     ['Cost Price', formatCurrency(report.totalCostPrice)],
//     ['Current Value', formatCurrency(report.totalCloseValue)],
//     ['Gain/Loss', formatCurrency(report.totalLossGain)],
//     ['Return %', `${report.totalPercentage >= 0 ? '+' : ''}${report.totalPercentage.toFixed(2)}%`],
//   ]
  
//   autoTable(doc, {
//     startY: currentY,
//     head: [['Metric', 'Value']],
//     body: summaryData,
//     theme: 'grid',
//     headStyles: { fillColor: [41, 128, 185], fontSize: 10, fontStyle: 'bold' },
//     styles: { fontSize: 9 },
//     margin: { left: 14, right: 14 }
//   })
  
//   currentY = (doc as any).lastAutoTable.finalY + 10

//   // Asset Class Allocation Section
//   doc.setFontSize(14)
//   doc.setFont('helvetica', 'bold')
//   doc.setFillColor(41, 128, 185)
//   doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 8, 'F')
//   doc.setTextColor(255, 255, 255)
//   doc.text('Asset Class Allocation', 16, currentY + 5.5)
//   doc.setTextColor(0, 0, 0)
  
//   currentY += 10

//   if (report.assetBreakdown && report.assetBreakdown.length > 0) {
//     const assetAllocationData = report.assetBreakdown
//       .map(asset => [
//         asset.assetClass,
//         asset.holdings.toString(),
//         formatCurrency(asset.totalCashValue),
//         `${asset.percentage.toFixed(2)}%`,
//       ])

//     const totalHoldings = report.assetBreakdown.reduce((sum, a) => sum + a.holdings, 0)
//     const totalValue = report.assetBreakdown.reduce((sum, a) => sum + a.totalCashValue, 0)
//     assetAllocationData.push(['Total', totalHoldings.toString(), formatCurrency(totalValue), '100.00%'])
    
//     autoTable(doc, {
//       startY: currentY,
//       head: [['Asset Class', 'Holdings', 'Total Cash Value', '%']],
//       body: assetAllocationData,
//       theme: 'grid',
//       headStyles: { fillColor: [41, 128, 185], fontSize: 10, fontStyle: 'bold' },
//       styles: { fontSize: 9 },
//       margin: { left: 14, right: 14 },
//       didParseCell: function(data) {
//         if (data.row.index === assetAllocationData.length - 1 && data.section === 'body') {
//           data.cell.styles.fontStyle = 'bold'
//           data.cell.styles.fillColor = [230, 230, 230]
//         }
//       }
//     })
    
//     currentY = (doc as any).lastAutoTable.finalY + 10
//   }

//   // Open Positions Section
//   if (report.userPortfolio?.userAssets && report.userPortfolio.userAssets.length > 0) {
//     doc.setFontSize(14)
//     doc.setFont('helvetica', 'bold')
//     doc.setFillColor(41, 128, 185)
//     doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 8, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.text(`${portfolioName} Open Positions`, 16, currentY + 5.5)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 10

//     const positionsData = report.userPortfolio.userAssets.map((userAsset) => {
//       const asset = userAsset.portfolioAsset?.asset
      
//       return [
//         asset?.symbol || 'N/A',
//         asset?.description || 'N/A',
//         asset?.sector || 'N/A',
//         userAsset.stock.toFixed(2),
//         `${(asset?.allocationPercentage || 0).toFixed(0)}%`,
//         formatCurrency(asset?.costPerShare || 0),
//         formatCurrency(userAsset.costPrice),
//         formatCurrency(asset?.closePrice || 0),
//         formatCurrency(userAsset.closeValue),
//         formatCurrency(userAsset.lossGain),
//       ]
//     })

//     const subTotalCostPrice = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.costPrice, 0)
//     const subTotalCloseValue = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.closeValue, 0)
//     const subTotalGainLoss = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.lossGain, 0)
    
//     positionsData.push([
//       'Sub Total',
//       '',
//       '',
//       '',
//       '',
//       '',
//       formatCurrency(subTotalCostPrice),
//       '',
//       formatCurrency(subTotalCloseValue),
//       formatCurrency(subTotalGainLoss),
//     ])

//     autoTable(doc, {
//       startY: currentY,
//       head: [[
//         'Symbol',
//         'Description',
//         'Sector',
//         'Stocks',
//         'Allocation',
//         'Cost Per Share',
//         'Cost Price',
//         'Close Price',
//         'Close Value',
//         'UnL/G'
//       ]],
//       body: positionsData,
//       theme: 'grid',
//       headStyles: { 
//         fillColor: [41, 128, 185], 
//         fontSize: 8, 
//         fontStyle: 'bold',
//         halign: 'center'
//       },
//       styles: { fontSize: 7, cellPadding: 2 },
//       columnStyles: {
//         0: { cellWidth: 20 },
//         1: { cellWidth: 40 },
//         2: { cellWidth: 35 },
//         3: { halign: 'right', cellWidth: 20 },
//         4: { halign: 'center', cellWidth: 20 },
//         5: { halign: 'right', cellWidth: 25 },
//         6: { halign: 'right', cellWidth: 25 },
//         7: { halign: 'right', cellWidth: 25 },
//         8: { halign: 'right', cellWidth: 25 },
//         9: { halign: 'right', cellWidth: 25 },
//       },
//       margin: { left: 14, right: 14 },
//       didParseCell: function(data) {
//         if (data.row.index === positionsData.length - 1 && data.section === 'body') {
//           data.cell.styles.fontStyle = 'bold'
//           data.cell.styles.fillColor = [230, 230, 230]
//         }
//       }
//     })
    
//     currentY = (doc as any).lastAutoTable.finalY + 10

//     // Bank Costs and Total Section - Using actual wallet data
//     // Calculate the final total: Portfolio Value + Total Fees
//     const portfolioValue = report.userPortfolio?.portfolioValue || 0
//     const finalTotal = portfolioValue + totalFees
    
//     const costsData = [
//       ['Bank Costs', formatCurrency(bankFee)],
//       ['Transaction Cost', formatCurrency(transactionFee)],
//       ['Cash at Bank', formatCurrency(feeAtBank)],
//       ['Sub Total', formatCurrency(totalFees)],
//       ['Total', formatCurrency(finalTotal)],
//     ]

//     autoTable(doc, {
//       startY: currentY,
//       body: costsData,
//       theme: 'grid',
//       styles: { fontSize: 9 },
//       columnStyles: {
//         0: { cellWidth: 60, fontStyle: 'bold' },
//         1: { cellWidth: 60, halign: 'right' },
//       },
//       margin: { left: 14 },
//       didParseCell: function(data) {
//         if (data.row.index === costsData.length - 1) {
//           data.cell.styles.fontStyle = 'bold'
//           data.cell.styles.fillColor = [41, 128, 185]
//           data.cell.styles.textColor = [255, 255, 255]
//         }
//         if (data.row.index === costsData.length - 2) {
//           data.cell.styles.fontStyle = 'bold'
//           data.cell.styles.fillColor = [230, 230, 230]
//         }
//       }
//     })
//   }
  
//   // Footer with page numbers and client info
//   const pageCount = doc.getNumberOfPages()
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i)
//     doc.setFontSize(8)
//     doc.setFont('helvetica', 'normal')
//     doc.setTextColor(128, 128, 128)
    
//     // Left footer - Client info
//     doc.text(
//       `${clientName} | Account: ${accountNumber}`,
//       14,
//       doc.internal.pageSize.getHeight() - 10
//     )
    
//     // Center footer - Page numbers
//     doc.text(
//       `Page ${i} of ${pageCount}`,
//       doc.internal.pageSize.getWidth() / 2,
//       doc.internal.pageSize.getHeight() - 10,
//       { align: 'center' }
//     )
    
//     // Right footer - Generation date
//     doc.text(
//       `Generated: ${new Date().toLocaleDateString()}`,
//       doc.internal.pageSize.getWidth() - 14,
//       doc.internal.pageSize.getHeight() - 10,
//       { align: 'right' }
//     )
//   }
  
//   return doc
// }

// const handleViewPDF = (report: PortfolioPerformanceReport) => {
//   const doc = generatePDF(report)
//   const pdfBlob = doc.output('blob')
//   const pdfUrl = URL.createObjectURL(pdfBlob)
//   window.open(pdfUrl, '_blank')
// }

// const handleDownloadPDF = (report: PortfolioPerformanceReport) => {
//   const doc = generatePDF(report)
//   const userName = report.userPortfolio?.user?.name?.replace(/\s+/g, '-') || 'client'
//   const reportDate = new Date(report.reportDate).toISOString().split('T')[0]
//   const fileName = `portfolio-report-${userName}-${reportDate}.pdf`
//   doc.save(fileName)
// }

//   const filteredReports = reports.filter((report) => {
//     if (selectedType !== "all" && report.type !== selectedType) return false
//     if (selectedDate && report.createdAt !== selectedDate) return false
//     return true
//   })

//   const generateReport = () => {
//     if (!selectedDate && selectedType === "all") {
//       alert("Please select a date and report type")
//       return
//     }

//     const newReport: Report = {
//       id: Math.random().toString(),
//       date: selectedDate || new Date().toLocaleDateString(),
//       type: selectedType === "all" ? "daily" : selectedType,
//       totalDeposits: Math.floor(Math.random() * 50000) + 1000,
//       totalWithdrawals: Math.floor(Math.random() * 30000) + 500,
//       netFlow: 0,
//       transactionCount: Math.floor(Math.random() * 200) + 10,
//       createdAt: selectedDate || new Date().toISOString().split("T")[0],
//     }
//     newReport.netFlow = newReport.totalDeposits - newReport.totalWithdrawals

//     setReports([newReport, ...reports])
//     setSelectedDate("")
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="space-y-8">
//           {/* Header */}
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
//             <p className="text-slate-400">
//               Welcome back, {user?.name || user?.firstName || "User"}! Generate and view your financial reports
//             </p>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-2 border-b border-slate-700">
//             <button
//               onClick={() => setActiveTab("financial")}
//               className={`px-6 py-3 font-medium transition-colors relative ${
//                 activeTab === "financial"
//                   ? "text-blue-400"
//                   : "text-slate-400 hover:text-slate-300"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <DollarSign className="w-4 h-4" />
//                 Financial Reports
//               </div>
//               {activeTab === "financial" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab("portfolio")}
//               className={`px-6 py-3 font-medium transition-colors relative ${
//                 activeTab === "portfolio"
//                   ? "text-blue-400"
//                   : "text-slate-400 hover:text-slate-300"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 Portfolio Performance
//               </div>
//               {activeTab === "portfolio" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
//               )}
//             </button>
//           </div>

//           {/* Financial Reports Tab */}
//           {activeTab === "financial" && (
//             <>
//               {/* Generate Report Section */}
//               <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
//                 <h2 className="text-white font-semibold mb-4">Generate Financial Report</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm text-slate-400">Report Type</label>
//                     <select
//                       value={selectedType}
//                       onChange={(e) => setSelectedType(e.target.value as any)}
//                       className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="all">Select Type</option>
//                       <option value="daily">Daily</option>
//                       <option value="monthly">Monthly</option>
//                       <option value="yearly">Yearly</option>
//                     </select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm text-slate-400">Date</label>
//                     <input
//                       type="date"
//                       value={selectedDate}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                       className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div className="flex items-end">
//                     <Button onClick={generateReport} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       Generate
//                     </Button>
//                   </div>

//                   <div className="flex items-end">
//                     <Button
//                       variant="outline"
//                       className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                       onClick={() => (window.location.href = "/")}
//                     >
//                       Back to Home
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Financial Reports List */}
//               <div className="space-y-4">
//                 <h2 className="text-white font-semibold text-lg">Available Financial Reports</h2>
//                 <div className="grid grid-cols-1 gap-4">
//                   {filteredReports.map((report) => (
//                     <div
//                       key={report.id}
//                       className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-white font-semibold text-lg">{report.date}</h3>
//                             <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
//                               {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
//                             </span>
//                           </div>
//                           <p className="text-slate-400 text-sm">Generated on {report.createdAt}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                           >
//                             <Eye className="w-4 h-4 mr-2" />
//                             View PDF
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                           >
//                             <Download className="w-4 h-4 mr-2" />
//                             Download
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Total Deposits</p>
//                           <p className="text-white font-semibold text-lg">${report.totalDeposits.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Total Withdrawals</p>
//                           <p className="text-white font-semibold text-lg">${report.totalWithdrawals.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Net Flow</p>
//                           <p className={`font-semibold text-lg ${report.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
//                             ${report.netFlow.toLocaleString()}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Transactions</p>
//                           <p className="text-white font-semibold text-lg">{report.transactionCount}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Portfolio Performance Tab */}
//           {activeTab === "portfolio" && (
//             <div className="space-y-4">
//               {/* Filter and Refresh Section */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <h2 className="text-white font-semibold text-lg">Portfolio Performance Reports</h2>
//                   <select
//                     value={selectedPeriod}
//                     onChange={(e) => setSelectedPeriod(e.target.value as "daily" | "weekly" | "monthly")}
//                     className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="daily">Daily</option>
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <p className="text-slate-400 text-sm">Auto-generated every 2 minutes</p>
//                   <Button
//                     onClick={fetchPortfolioReports}
//                     disabled={loading}
//                     size="sm"
//                     variant="outline"
//                     className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                   >
//                     {loading ? (
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     ) : (
//                       <RefreshCw className="w-4 h-4 mr-2" />
//                     )}
//                     Refresh
//                   </Button>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="border border-red-700 rounded-lg p-4 bg-red-900/20">
//                   <p className="text-red-400 text-sm">{error}</p>
//                 </div>
//               )}

//               {/* Loading State */}
//               {loading && portfolioReports.length === 0 && (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
//                 </div>
//               )}

//               {/* No Reports Message */}
//               {!loading && portfolioReports.length === 0 && !error && (
//                 <div className="border border-slate-700 rounded-lg p-12 bg-slate-900/50 text-center">
//                   <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
//                   <h3 className="text-white font-semibold text-lg mb-2">No Reports Yet</h3>
//                   <p className="text-slate-400 text-sm">
//                     Portfolio performance reports will appear here once generated.
//                   </p>
//                 </div>
//               )}

//               {/* Reports List */}
//               {!loading && portfolioReports.length > 0 && (
//                 <div className="grid grid-cols-1 gap-4">
//                   {portfolioReports.map((report) => (
//                     <div
//                       key={report.id}
//                       className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-white font-semibold text-lg">
//                               {report.userPortfolio?.portfolio?.name || "Portfolio"}
//                             </h3>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               report.totalLossGain >= 0 
//                                 ? "bg-green-500/20 text-green-400" 
//                                 : "bg-red-500/20 text-red-400"
//                             }`}>
//                               {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
//                             </span>
//                           </div>
//                           <p className="text-slate-400 text-sm">{formatDate(report.reportDate)}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             onClick={() => handleViewPDF(report)}
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                           >
//                             <Eye className="w-4 h-4 mr-2" />
//                             View PDF
//                           </Button>
//                           <Button
//                             onClick={() => handleDownloadPDF(report)}
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//                           >
//                             <Download className="w-4 h-4 mr-2" />
//                             Download
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700 mb-4">
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Net Asset Value</p>
//                           <p className="text-white font-semibold text-lg">{formatCurrency(report.totalCostPrice)}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Current Value</p>
//                           <p className="text-white font-semibold text-lg">{formatCurrency(report.totalCloseValue)}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Gain/Loss</p>
//                           <p className={`font-semibold text-lg ${
//                             report.totalLossGain >= 0 ? "text-green-400" : "text-red-400"
//                           }`}>
//                             {formatCurrency(report.totalLossGain)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-slate-400 text-sm mb-1">Return %</p>
//                           <p className={`font-semibold text-lg ${
//                             report.totalPercentage >= 0 ? "text-green-400" : "text-red-400"
//                           }`}>
//                             {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
//                           </p>
//                         </div>
//                       </div>

//                       {/* Asset Breakdown */}
//                       {report.assetBreakdown && report.assetBreakdown.length > 0 && (
//                         <div className="pt-4 border-t border-slate-700">
//                           <h4 className="text-white text-sm font-semibold mb-3">Asset Breakdown</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
//                             {report.assetBreakdown
//                               .filter(asset => asset.totalCashValue > 0) // Only show assets with value
//                               .map((asset) => (
//                               <div key={asset.assetClass} className="bg-slate-800/50 rounded-lg p-3">
//                                 <p className="text-slate-400 text-xs mb-1">{asset.assetClass}</p>
//                                 <p className="text-white font-semibold">{formatCurrency(asset.totalCashValue)}</p>
//                                 <p className="text-slate-400 text-xs mt-1">
//                                   {asset.holdings} holdings • {asset.percentage.toFixed(1)}%
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }




// app/reports/reports-client.tsx (Client Component)
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Calendar, Eye, TrendingUp, DollarSign, RefreshCw, Loader2 } from "lucide-react"
import { listPerformanceReports, ListPerformanceReportsParams, PortfolioPerformanceReport } from "@/actions/portfolioPerformanceReports"
import { listUserPortfolios } from "@/actions/user-portfolios"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


// At the top of reports-client.tsx, update the interface
interface ReportsClientProps {
  user: {
    id: string
    firstName?: string
    lastName?: string
    name?: string
    email?: string
    wallet?: {
      id: string
      accountNumber: string
      balance: number
      bankFee: number
      transactionFee: number
      totalFees: number
      feeAtBank: number
      netAssetValue: number
      status: string
      createdAt?: string
    } | null
  } | null
  initialReports: PortfolioPerformanceReport[]
  initialPortfolioId: string | null
  initialError?: string | null
}


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
]

type TabType = "financial" | "portfolio"



export default function ReportsClient({ 
  user, 
  initialReports, 
  initialPortfolioId,
  initialError 
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("portfolio") // Start with portfolio tab
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [portfolioReports, setPortfolioReports] = useState<PortfolioPerformanceReport[]>(initialReports)
  const [selectedType, setSelectedType] = useState<"all" | "daily" | "monthly" | "yearly">("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [userPortfolioId, setUserPortfolioId] = useState<string | null>(initialPortfolioId)
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  // Fetch portfolio reports when period changes
  useEffect(() => {
    if (userPortfolioId && activeTab === "portfolio") {
      fetchPortfolioReports()
    }
  }, [selectedPeriod, activeTab])

  const fetchPortfolioReports = async () => {
    if (!userPortfolioId) return

    try {
      setLoading(true)
      setError(null)

      const params: ListPerformanceReportsParams = {
        userPortfolioId,
        period: selectedPeriod,
      }

      const result = await listPerformanceReports(params)

      if (result.success && result.data) {
        setPortfolioReports(result.data)
      } else {
        setError(result.error || "Failed to fetch portfolio reports")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch portfolio reports")
      console.error("Error fetching portfolio reports:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }


const generatePDF = (report: PortfolioPerformanceReport) => {
  const doc = new jsPDF('portrait')
  
  // Extract wallet information with correct field mappings
  const walletData = user?.wallet
  const bankFee = walletData?.bankFee ?? 0           // Bank Costs
  const transactionFee = walletData?.transactionFee ?? 0  // Transaction Cost
  const feeAtBank = walletData?.feeAtBank ?? 0       // Cash at Bank
  const totalFees = walletData?.totalFees ?? 0       // Total Fees
  const accountNumber = walletData?.accountNumber ?? report.userPortfolio?.id?.slice(-8).toUpperCase() ?? 'N/A'
  const netAssetValue = walletData?.netAssetValue ?? 0
  
  
  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Portfolio Performance Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' })
  
  // Client name - combine firstName and lastName if name is not available
  const clientName = user?.name || 
                     (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                     user?.firstName || 
                     'N/A'
  
  const portfolioName = report.userPortfolio?.portfolio?.name || 'N/A'
  const reportDateFormatted = formatDate(report.reportDate)
  const generatedDate = formatDate(report.createdAt || new Date().toISOString())
  
  // Portfolio Info Section
  doc.setFontSize(10)
  
  // Left column
  doc.setFont('helvetica', 'bold')
  doc.text('Client Name:', 14, 35)
  doc.setFont('helvetica', 'normal')
  doc.text(clientName, 50, 35)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Portfolio:', 14, 42)
  doc.setFont('helvetica', 'normal')
  doc.text(portfolioName, 50, 42)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Account Number:', 14, 49)
  doc.setFont('helvetica', 'normal')
  doc.text(accountNumber, 50, 49)
  
  // Right column
  doc.setFont('helvetica', 'bold')
  doc.text('Report Date:', 110, 35)
  doc.setFont('helvetica', 'normal')
  doc.text(reportDateFormatted, 110, 42)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Generated On:', 110, 49)
  doc.setFont('helvetica', 'normal')
  doc.text(generatedDate, 110, 56)
  
  let currentY = 65

  // Performance Summary Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(41, 128, 185)
  doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 7, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Performance Summary', 16, currentY + 5)
  doc.setTextColor(0, 0, 0)
  
  currentY += 9

  const summaryData = [
    ['Cost Price', formatCurrency(report.totalCostPrice)],
    ['Current Value', formatCurrency(report.totalCloseValue)],
    ['Gain/Loss', formatCurrency(report.totalLossGain)],
    ['Return %', `${report.totalPercentage >= 0 ? '+' : ''}${report.totalPercentage.toFixed(2)}%`],
  ]
  
  autoTable(doc, {
    startY: currentY,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], fontSize: 9, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  })
  
  currentY = (doc as any).lastAutoTable.finalY + 8

  // Asset Class Allocation Section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(41, 128, 185)
  doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 7, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Asset Class Allocation', 16, currentY + 5)
  doc.setTextColor(0, 0, 0)
  
  currentY += 9

  if (report.assetBreakdown && report.assetBreakdown.length > 0) {
    const assetAllocationData = report.assetBreakdown
      .map(asset => [
        asset.assetClass,
        asset.holdings.toString(),
        formatCurrency(asset.totalCashValue),
        `${asset.percentage.toFixed(2)}%`,
      ])

    const totalHoldings = report.assetBreakdown.reduce((sum, a) => sum + a.holdings, 0)
    const totalValue = report.assetBreakdown.reduce((sum, a) => sum + a.totalCashValue, 0)
    assetAllocationData.push(['Total', totalHoldings.toString(), formatCurrency(totalValue), '100.00%'])
    
    autoTable(doc, {
      startY: currentY,
      head: [['Asset Class', 'Holdings', 'Total Cash Value', '%']],
      body: assetAllocationData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
      didParseCell: function(data) {
        if (data.row.index === assetAllocationData.length - 1 && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [230, 230, 230]
        }
      }
    })
    
    currentY = (doc as any).lastAutoTable.finalY + 8
  }

  // Bank Costs and Total Section - on first page
  const portfolioValue = report.userPortfolio?.portfolioValue || 0
  const finalTotal = portfolioValue + totalFees
  
  const costsData = [
    ['Bank Costs', formatCurrency(bankFee)],
    ['Transaction Cost', formatCurrency(transactionFee)],
    ['Cash at Bank', formatCurrency(feeAtBank)],
    ['Sub Total', formatCurrency(totalFees)],
    ['Total', formatCurrency(finalTotal)],
  ]

  autoTable(doc, {
    startY: currentY,
    body: costsData,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 80, halign: 'right' },
    },
    margin: { left: 14 },
    didParseCell: function(data) {
      if (data.row.index === costsData.length - 1) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fillColor = [41, 128, 185]
        data.cell.styles.textColor = [255, 255, 255]
      }
      if (data.row.index === costsData.length - 2) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fillColor = [230, 230, 230]
      }
    }
  })

  // Open Positions Section - START ON NEW PAGE (PAGE 2)
  if (report.userPortfolio?.userAssets && report.userPortfolio.userAssets.length > 0) {
    doc.addPage()
    currentY = 20
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(41, 128, 185)
    doc.rect(14, currentY, doc.internal.pageSize.getWidth() - 28, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(`${portfolioName} Open Positions`, 16, currentY + 5)
    doc.setTextColor(0, 0, 0)
    
    currentY += 9

    const positionsData = report.userPortfolio.userAssets.map((userAsset) => {
      const asset = userAsset.portfolioAsset?.asset
      
      return [
        asset?.symbol || 'N/A',
        asset?.description || 'N/A',
        asset?.sector || 'N/A',
        userAsset.stock.toFixed(2),
        `${(asset?.allocationPercentage || 0).toFixed(0)}%`,
        formatCurrency(asset?.costPerShare || 0),
        formatCurrency(userAsset.costPrice),
        formatCurrency(asset?.closePrice || 0),
        formatCurrency(userAsset.closeValue),
        formatCurrency(userAsset.lossGain),
      ]
    })

    const subTotalCostPrice = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.costPrice, 0)
    const subTotalCloseValue = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.closeValue, 0)
    const subTotalGainLoss = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.lossGain, 0)
    
    positionsData.push([
      'Sub Total',
      '',
      '',
      '',
      '',
      '',
      formatCurrency(subTotalCostPrice),
      '',
      formatCurrency(subTotalCloseValue),
      formatCurrency(subTotalGainLoss),
    ])

    autoTable(doc, {
      startY: currentY,
      head: [[
        'Symbol',
        'Description',
        'Sector',
        'Stocks',
        'Alloc.',
        'Cost/Share',
        'Cost Price',
        'Close Price',
        'Close Value',
        'UrL/G'
      ]],
      body: positionsData,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185], 
        fontSize: 6.5, 
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1
      },
      styles: { 
        fontSize: 6.5, 
        cellPadding: 1,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'left' },      // Symbol
        1: { cellWidth: 28, halign: 'left' },      // Description
        2: { cellWidth: 22, halign: 'left' },      // Sector
        3: { cellWidth: 14, halign: 'right' },     // Stocks
        4: { cellWidth: 12, halign: 'center' },    // Allocation
        5: { cellWidth: 18, halign: 'right' },     // Cost Per Share
        6: { cellWidth: 18, halign: 'right' },     // Cost Price
        7: { cellWidth: 18, halign: 'right' },     // Close Price
        8: { cellWidth: 18, halign: 'right' },     // Close Value
        9: { cellWidth: 19, halign: 'right' },     // UrL/G
      },
      margin: { left: 14, right: 14 },
      didParseCell: function(data) {
        if (data.row.index === positionsData.length - 1 && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [230, 230, 230]
        }
      }
    })
  }

  // DEFINITIONS PAGE (LAST PAGE)
  doc.addPage()
  
  // GoldKach Logo/Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(41, 128, 185)
  doc.text('GoldKach', 14, 25)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Unleashing Global Investments', 14, 32)
  
  // Definitions Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Definitions', 14, 45)
  
  const definitions = [
    {
      term: 'Symbol (Ticker):',
      definition: 'A unique abbreviation used to identify a publicly traded security on a stock exchange. For example, AAPL is the ticker symbol for Apple Inc.'
    },
    {
      term: 'Cost Per Share:',
      definition: 'The average price paid to acquire one share of a security, including any commissions or transaction fees.'
    },
    {
      term: 'Cost Price:',
      definition: 'The total amount paid for a security or group of securities. This is calculated as:\nCost Price = Number of Shares × Cost Per Share'
    },
    {
      term: 'Close Price:',
      definition: 'The last price at which a security was traded during a regular trading session on a given day. It represents the market value at market close.'
    },
    {
      term: 'Close Value:',
      definition: 'The market value of your holding based on the latest closing price. This is calculated as:\nClose Value = Number of Shares × Close Price'
    },
    {
      term: 'UrL/G',
      definition: 'The unrealised profit or loss on a holding, calculated as the difference between its current market value and its original cost. This is "unrealised" because the position hasn\'t been sold yet.\nUrL/G = Close Value - Cost Price'
    },
    {
      term: 'Reallocation:',
      definition: 'Reallocation in a portfolio statement refers to the process of adjusting the distribution of assets within an investment portfolio. This is typically done to maintain a desired asset allocation, respond to market changes, or align the portfolio with updated investment goals or risk tolerance.'
    }
  ]
  
  let yPosition = 52
  doc.setFontSize(9)
  
  definitions.forEach((item) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    
    // Term (bold)
    doc.setFont('helvetica', 'bold')
    doc.text(item.term, 14, yPosition)
    yPosition += 5
    
    // Definition (normal, wrapped)
    doc.setFont('helvetica', 'normal')
    const splitDefinition = doc.splitTextToSize(item.definition, 180)
    doc.text(splitDefinition, 14, yPosition)
    yPosition += (splitDefinition.length * 4.5) + 5
  })
  
  // Add regulatory information at bottom of definitions page
  yPosition += 5
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  
  const regulatoryInfo = [
    'GoldKach is regulated by the Capital Markets Authority (CMA) Licence No. GKUL 2526 (FM)',
    'Address: 3rd Floor Kanjokya House',
    '              Plot 90 Kanjokya Street',
    '              P.O. BOX 500094 Kampala Uganda',
    'Email: info@goldkach.com',
    'Website: www.goldkach.com'
  ]
  
  regulatoryInfo.forEach((line) => {
    if (yPosition > 280) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(line, 14, yPosition)
    yPosition += 4
  })
  
  // Footer with page numbers on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    
    // Left footer - Client info
    doc.text(
      `${clientName} | Account: ${accountNumber}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    )
    
    // Center footer - Page numbers
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
    
    // Right footer - Generation date
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    )
  }
  
  return doc
}

const handleViewPDF = (report: PortfolioPerformanceReport) => {
  const doc = generatePDF(report)
  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}

const handleDownloadPDF = (report: PortfolioPerformanceReport) => {
  const doc = generatePDF(report)
  const userName = report.userPortfolio?.user?.name?.replace(/\s+/g, '-') || 'client'
  const reportDate = new Date(report.reportDate).toISOString().split('T')[0]
  const fileName = `portfolio-report-${userName}-${reportDate}.pdf`
  doc.save(fileName)
}

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
            <p className="text-slate-400">
              Welcome back, {user?.name || user?.firstName || "User"}! Generate and view your financial reports
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700">
            <button
              onClick={() => setActiveTab("financial")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "financial"
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Financial Reports
              </div>
              {activeTab === "financial" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "portfolio"
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Portfolio Performance
              </div>
              {activeTab === "portfolio" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          </div>

          {/* Financial Reports Tab */}
          {activeTab === "financial" && (
            <>
              {/* Generate Report Section */}
              <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
                <h2 className="text-white font-semibold mb-4">Generate Financial Report</h2>
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

              {/* Financial Reports List */}
              <div className="space-y-4">
                <h2 className="text-white font-semibold text-lg">Available Financial Reports</h2>
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
            </>
          )}

          {/* Portfolio Performance Tab */}
          {activeTab === "portfolio" && (
            <div className="space-y-4">
              {/* Filter and Refresh Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-white font-semibold text-lg">Portfolio Performance Reports</h2>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as "daily" | "weekly" | "monthly")}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 text-sm">Auto-generated every 2 minutes</p>
                  <Button
                    onClick={fetchPortfolioReports}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="border border-red-700 rounded-lg p-4 bg-red-900/20">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && portfolioReports.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              )}

              {/* No Reports Message */}
              {!loading && portfolioReports.length === 0 && !error && (
                <div className="border border-slate-700 rounded-lg p-12 bg-slate-900/50 text-center">
                  <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">No Reports Yet</h3>
                  <p className="text-slate-400 text-sm">
                    Portfolio performance reports will appear here once generated.
                  </p>
                </div>
              )}

              {/* Reports List */}
              {!loading && portfolioReports.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {portfolioReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              {report.userPortfolio?.portfolio?.name || "Portfolio"}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.totalLossGain >= 0 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm">{formatDate(report.reportDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewPDF(report)}
                            variant="outline"
                            size="sm"
                            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View PDF
                          </Button>
                          <Button
                            onClick={() => handleDownloadPDF(report)}
                            variant="outline"
                            size="sm"
                            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700 mb-4">
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Net Asset Value</p>
                          <p className="text-white font-semibold text-lg">{formatCurrency(report.totalCostPrice)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Current Value</p>
                          <p className="text-white font-semibold text-lg">{formatCurrency(report.totalCloseValue)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Gain/Loss</p>
                          <p className={`font-semibold text-lg ${
                            report.totalLossGain >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {formatCurrency(report.totalLossGain)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Return %</p>
                          <p className={`font-semibold text-lg ${
                            report.totalPercentage >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {/* Asset Breakdown */}
                      {report.assetBreakdown && report.assetBreakdown.length > 0 && (
                        <div className="pt-4 border-t border-slate-700">
                          <h4 className="text-white text-sm font-semibold mb-3">Asset Breakdown</h4>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                            {report.assetBreakdown
                              .filter(asset => asset.totalCashValue > 0) // Only show assets with value
                              .map((asset) => (
                              <div key={asset.assetClass} className="bg-slate-800/50 rounded-lg p-3">
                                <p className="text-slate-400 text-xs mb-1">{asset.assetClass}</p>
                                <p className="text-white font-semibold">{formatCurrency(asset.totalCashValue)}</p>
                                <p className="text-slate-400 text-xs mt-1">
                                  {asset.holdings} holdings • {asset.percentage.toFixed(1)}%
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}