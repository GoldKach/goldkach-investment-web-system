

// // components/front-end/reports-client.tsx
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Download, Eye, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { listPerformanceReports, ListPerformanceReportsParams, PortfolioPerformanceReport } from "@/actions/portfolioPerformanceReports"

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

// type TabType = "portfolio"

// export default function ReportsClient({ 
//   user, 
//   initialReports, 
//   initialPortfolioId,
//   initialError 
// }: ReportsClientProps) {
//   const [activeTab, setActiveTab] = useState<TabType>("portfolio")
//   const [portfolioReports, setPortfolioReports] = useState<PortfolioPerformanceReport[]>(initialReports)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(initialError || null)
//   const [userPortfolioId, setUserPortfolioId] = useState<string | null>(initialPortfolioId)
//   const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

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

//   const loadLogoImage = (): Promise<HTMLImageElement> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image()
//       img.crossOrigin = 'anonymous'
//       img.onload = () => resolve(img)
//       img.onerror = () => reject(new Error('Failed to load logo'))
//       img.src = '/logos/GoldKach-Logo-New-1.jpg'
//     })
//   }

//   const addPageBorderAndLogo = async (doc: jsPDF) => {
//     // Add blue border around entire page
//     doc.setDrawColor(25, 51, 136) // GoldKach blue
//     doc.setLineWidth(4)
//     doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, 'S')
    
//     // Add GoldKach logo from public directory
//     try {
//       const logoImg = await loadLogoImage()
//       doc.addImage(logoImg, 'JPEG', 10, 10, 45, 35)
//     } catch (error) {
//       // Fallback to text if image fails to load
//       console.error('Logo loading failed, using text fallback:', error)
//       doc.setFillColor(255, 255, 255)
//       doc.rect(10, 10, 45, 35, 'F')
      
//       doc.setFontSize(14)
//       doc.setFont('helvetica', 'bold')
//       doc.setTextColor(25, 51, 136)
//       doc.text('GoldKach', 15, 25)
      
//       doc.setFontSize(7)
//       doc.setFont('helvetica', 'normal')
//       doc.setTextColor(41, 128, 185)
//       doc.text('Unlocking Global Investments', 15, 32)
//     }
    
//     doc.setTextColor(0, 0, 0)
//   }

//   const generatePDF = async (report: PortfolioPerformanceReport) => {
//     const doc = new jsPDF('portrait')
    
//     const walletData = user?.wallet
//     const bankFee = walletData?.bankFee ?? 0
//     const transactionFee = walletData?.transactionFee ?? 0
//     const feeAtBank = walletData?.feeAtBank ?? 0
//     const totalFees = walletData?.totalFees ?? 0
//     const accountNumber = walletData?.accountNumber ?? report.userPortfolio?.id?.slice(-8).toUpperCase() ?? 'N/A'
    
//     const clientName = user?.name || 
//                        (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') ||
//                        user?.firstName || 
//                        'N/A'
    
//     const portfolioName = report.userPortfolio?.portfolio?.name || 'N/A'
//     const reportDateFormatted = new Date(report.reportDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    
//     const reportDateObj = new Date(report.reportDate)
//     const quarter = Math.floor(reportDateObj.getMonth() / 3) + 1
//     const year = reportDateObj.getFullYear()
//     const reportingPeriod = `Q${quarter} ${year}`
    
//     // PAGE 1
//     await addPageBorderAndLogo(doc)
    
//     // Main Title Box
//     doc.setFillColor(25, 51, 136)
//     doc.rect(70, 15, 130, 20, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(16)
//     doc.setFont('helvetica', 'bold')
//     doc.text('GoldKach Performance Report', 135, 27, { align: 'center' })
//     doc.setTextColor(0, 0, 0)
    
//     let currentY = 50
    
//     // CLIENT INFORMATION
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 90, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Client Information', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
//     doc.setFontSize(10)
    
//     const clientInfo = [
//       ['Client Name:', clientName],
//       ['Fund Name:', portfolioName],
//       ['Account Number:', accountNumber],
//       ['Reporting Period:', reportingPeriod],
//       ['Report Date:', reportDateFormatted]
//     ]
    
//     clientInfo.forEach(([label, value]) => {
//       doc.setFont('helvetica', 'bold')
//       doc.text(label, 20, currentY)
//       doc.setFont('helvetica', 'normal')
//       doc.text(value, 60, currentY)
//       currentY += 6
//     })
    
//     currentY += 5
    
//     // PERFORMANCE SNAPSHOT
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 90, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Performance Snapshot', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
    
//     const performanceData = [
//       [reportingPeriod, `${report.totalPercentage >= 0 ? '+' : ''}${report.totalPercentage.toFixed(2)}%`]
//     ]
    
//     autoTable(doc, {
//       startY: currentY,
//       head: [['Period', 'Portfolio Return']],
//       body: performanceData,
//       theme: 'grid',
//       headStyles: { 
//         fillColor: [220, 230, 241],
//         textColor: [25, 51, 136],
//         fontSize: 10,
//         fontStyle: 'bold',
//         halign: 'left'
//       },
//       bodyStyles: {
//         fillColor: [230, 236, 245],
//         fontSize: 10,
//         halign: 'right'
//       },
//       columnStyles: {
//         0: { halign: 'left', cellWidth: 45 },
//         1: { halign: 'right', cellWidth: 45, fontStyle: 'bold' }
//       },
//       margin: { left: 20 },
//       tableWidth: 90
//     })
    
//     currentY = (doc as any).lastAutoTable.finalY + 10
    
//     // ASSET ALLOCATION
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 90, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Asset Allocation', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
    
//     if (report.assetBreakdown && report.assetBreakdown.length > 0) {
//       const assetAllocationData = report.assetBreakdown.map(asset => [
//         asset.assetClass,
//         asset.holdings.toString(),
//         formatCurrency(asset.totalCashValue),
//         `${asset.percentage.toFixed(2)}%`
//       ])
      
//       const totalHoldings = report.assetBreakdown.reduce((sum, a) => sum + a.holdings, 0)
//       const totalValue = report.assetBreakdown.reduce((sum, a) => sum + a.totalCashValue, 0)
//       assetAllocationData.push(['Total', totalHoldings.toString(), formatCurrency(totalValue), '100.00%'])
      
//       autoTable(doc, {
//         startY: currentY,
//         head: [['Asset Class', 'Holdings', 'Total Cash Value', '%']],
//         body: assetAllocationData,
//         theme: 'grid',
//         headStyles: { 
//           fillColor: [25, 51, 136],
//           textColor: [255, 255, 255],
//           fontSize: 9,
//           fontStyle: 'bold',
//           halign: 'center'
//         },
//         bodyStyles: {
//           fontSize: 9,
//           halign: 'right'
//         },
//         columnStyles: {
//           0: { halign: 'left' },
//           1: { halign: 'center' },
//           2: { halign: 'right' },
//           3: { halign: 'right' }
//         },
//         margin: { left: 15, right: 15 },
//         didParseCell: function(data) {
//           if (data.row.index === assetAllocationData.length - 1 && data.section === 'body') {
//             data.cell.styles.fontStyle = 'bold'
//             data.cell.styles.fillColor = [230, 230, 230]
//           }
//         }
//       })
//     }
    
//     // PAGE 2
//     doc.addPage()
//     await addPageBorderAndLogo(doc)
    
//     currentY = 50
    
//     // PORTFOLIO HOLDINGS
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 120, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Portfolio Holdings', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
    
//     if (report.userPortfolio?.userAssets && report.userPortfolio.userAssets.length > 0) {
//       const positionsData = report.userPortfolio.userAssets.map((userAsset) => {
//         const asset = userAsset.asset
        
//         return [
//           asset?.symbol || 'N/A',
//           asset?.description || 'N/A',
//           // asset?.sector || 'N/A',
//           userAsset.stock.toFixed(2),
//           `${userAsset.allocationPercentage.toFixed(0)}%`,
//           formatCurrency(userAsset.costPerShare),
//           formatCurrency(userAsset.costPrice),
//           formatCurrency(asset?.closePrice || 0),
//           formatCurrency(userAsset.closeValue),
//           formatCurrency(userAsset.lossGain)
//         ]
//       })
      
//       const subTotalCostPrice = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.costPrice, 0)
//       const subTotalCloseValue = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.closeValue, 0)
//       const subTotalGainLoss = report.userPortfolio.userAssets.reduce((sum, a) => sum + a.lossGain, 0)
      
//       positionsData.push([
//         'Sub Total',
//         '',
//         '',
//         '',
//         '',
//         '',
//         formatCurrency(subTotalCostPrice),
//         '',
//         formatCurrency(subTotalCloseValue),
//         formatCurrency(subTotalGainLoss)
//       ])
      
//       autoTable(doc, {
//         startY: currentY,
//         head: [[
//           'Symbol',
//           'Description',
//           // 'Sector',
//           'Stocks',
//           'Allocation',
//           'Cost Per\nShare',
//           'Cost Price',
//           'Close Price',
//           'Close\nValue',
//           'UrL/G'
//         ]],
//         body: positionsData,
//         theme: 'grid',
//         headStyles: {
//           fillColor: [25, 51, 136],
//           textColor: [255, 255, 255],
//           fontSize: 7,
//           fontStyle: 'bold',
//           halign: 'center',
//           cellPadding: 1.5
//         },
//         bodyStyles: {
//           fontSize: 7,
//           cellPadding: 1.5
//         },
//         columnStyles: {
//           0: { cellWidth: 15, halign: 'left' },
//           1: { cellWidth: 30, halign: 'left' },
//           2: { cellWidth: 25, halign: 'left' },
//           3: { cellWidth: 18, halign: 'right' },
//           4: { cellWidth: 15, halign: 'center' },
//           5: { cellWidth: 18, halign: 'right' },
//           6: { cellWidth: 20, halign: 'right' },
//           7: { cellWidth: 18, halign: 'right' },
//           8: { cellWidth: 18, halign: 'right' },
//           9: { cellWidth: 18, halign: 'right' }
//         },
//         margin: { left: 15, right: 15 },
//         didParseCell: function(data) {
//           if (data.row.index === positionsData.length - 1 && data.section === 'body') {
//             data.cell.styles.fontStyle = 'bold'
//             data.cell.styles.fillColor = [230, 230, 230]
//           }
//         }
//       })
      
//       currentY = (doc as any).lastAutoTable.finalY + 8
      
//       const costsData = [
//         ['Bank Costs', formatCurrency(bankFee)],
//         ['Transaction Cost', formatCurrency(transactionFee)],
//         ['Cash at Bank', formatCurrency(feeAtBank)],
//         ['Sub Total', formatCurrency(totalFees)],
//         ['Total', formatCurrency(report.totalCloseValue + totalFees)]
//       ]
      
//       autoTable(doc, {
//         startY: currentY,
//         body: costsData,
//         theme: 'grid',
//         bodyStyles: {
//           fontSize: 9
//         },
//         columnStyles: {
//           0: { cellWidth: 80, fontStyle: 'bold', halign: 'left' },
//           1: { cellWidth: 80, halign: 'right', fontStyle: 'bold' }
//         },
//         margin: { left: 15 },
//         didParseCell: function(data) {
//           if (data.row.index === costsData.length - 1) {
//             data.cell.styles.fillColor = [25, 51, 136]
//             data.cell.styles.textColor = [255, 255, 255]
//           }
//           if (data.row.index === costsData.length - 2) {
//             data.cell.styles.fillColor = [230, 230, 230]
//           }
//         }
//       })
//     }
    
//     currentY = (doc as any).lastAutoTable.finalY + 10
    
//     // MARKET COMMENTARY
//     if (currentY > 200) {
//       doc.addPage()
//       await addPageBorderAndLogo(doc)
//       currentY = 50
//     }
    
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 120, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Market Commentary', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
    
//     doc.setFontSize(10)
//     doc.setFont('helvetica', 'bold')
//     doc.text(`Market Commentary – ${year}`, 15, currentY)
    
//     currentY += 8
//     doc.setFontSize(9)
//     doc.setFont('helvetica', 'normal')
    
//     const commentary = `In ${year}, technology equities delivered strong performance, led by the semiconductor sector. The iShares Semiconductor ETF (SOXX) significantly outperformed broader tech markets, benefiting from sustained demand for AI infrastructure, data centres and advanced chip manufacturing. Meanwhile, the Invesco QQQ Trust (QQQ) posted solid gains, supported by resilient earnings from mega-cap technology leaders across software, cloud computing and digital services.

// Overall, the portfolio demonstrated the benefits of combining high-growth sector exposure with broad technology diversification, capturing upside from structural tech trends while managing risk through balanced allocation.`
    
//     const commentaryLines = doc.splitTextToSize(commentary, 180)
//     doc.text(commentaryLines, 15, currentY)
    
//     // PAGE 3 - DEFINITIONS
//     doc.addPage()
//     await addPageBorderAndLogo(doc)
    
//     currentY = 50
    
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 70, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Definitions', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
    
//     const definitions = [
//       {
//         term: 'Symbol (Ticker):',
//         definition: 'A unique abbreviation used to identify a publicly traded security on a stock exchange. For example, AAPL is the ticker symbol for Apple Inc.'
//       },
//       {
//         term: 'Cost Per Share:',
//         definition: 'The average price paid to acquire one share of a security, including any commissions or transaction fees.'
//       },
//       {
//         term: 'Cost Price:',
//         definition: 'The total amount paid for a security or group of securities. This is calculated as:\nCost Price = Number of Shares × Cost Per Share'
//       },
//       {
//         term: 'Close Price:',
//         definition: 'The last price at which a security was traded during a regular trading session on a given day. It represents the market value at market close.'
//       },
//       {
//         term: 'Close Value:',
//         definition: 'The market value of your holding based on the latest closing price. This is calculated as:\nClose Value = Number of Shares × Close Price'
//       },
//       {
//         term: 'UrL/G:',
//         definition: 'The unrealised profit or loss on a holding, calculated as the difference between its current market value and its original cost. This is "unrealised" because the position hasn\'t been sold yet.\nUrL/G = Close Value – Cost Price'
//       },
//       {
//         term: 'Reallocation:',
//         definition: 'Reallocation in a portfolio statement refers to the process of adjusting the distribution of assets within an investment portfolio. This is typically done to maintain a desired asset allocation, respond to market changes, or align the portfolio with updated investment goals or risk tolerance.'
//       }
//     ]
    
//     doc.setFontSize(9)
//     for (const item of definitions) {
//       if (currentY > 250) {
//         doc.addPage()
//         await addPageBorderAndLogo(doc)
//         currentY = 50
//       }
      
//       doc.setFont('helvetica', 'bold')
//       doc.text(item.term, 15, currentY)
//       currentY += 5
      
//       doc.setFont('helvetica', 'normal')
//       const defLines = doc.splitTextToSize(item.definition, 180)
//       doc.text(defLines, 15, currentY)
//       currentY += (defLines.length * 4) + 6
//     }
    
//     // REGULATION
//     currentY += 5
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 70, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Regulation', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
//     doc.setFontSize(9)
//     doc.setFont('helvetica', 'normal')
//     doc.text('GoldKach Uganda Limited is regulated by the Capital Markets Authority of Uganda as a Fund', 15, currentY)
//     doc.text('Manager. Licence No. GKUL 2526 (FM)', 15, currentY + 5)
    
//     // ADDRESS
//     currentY += 15
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 70, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Address', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
//     doc.setFontSize(9)
//     doc.setFont('helvetica', 'normal')
//     const addressLines = [
//       '3rd Floor Kanjokya House',
//       'Plot 90 Kanjokya Street',
//       'P.O.Box 500094',
//       'Kampala, Uganda'
//     ]
//     addressLines.forEach(line => {
//       doc.text(line, 15, currentY)
//       currentY += 5
//     })
    
//     // PAGE 4 - DISCLAIMER
//     doc.addPage()
//     await addPageBorderAndLogo(doc)
    
//     currentY = 50
    
//     doc.setFillColor(25, 51, 136)
//     doc.rect(15, currentY, 70, 10, 'F')
//     doc.setTextColor(255, 255, 255)
//     doc.setFontSize(12)
//     doc.setFont('helvetica', 'bold')
//     doc.text('Disclaimer', 20, currentY + 7)
//     doc.setTextColor(0, 0, 0)
    
//     currentY += 15
//     doc.setFontSize(9)
//     doc.setFont('helvetica', 'normal')
    
//     const disclaimer = `Past performance is not a reliable indicator of future results. Portfolio returns are provided for information purposes only and reflect historical performance over the stated period. Performance may be influenced by market conditions, currency movements, fees, and other external factors. The value of investments may fluctuate over time. This information does not constitute investment advice or a solicitation to buy or sell any financial instrument. Investors should consider their individual circumstances and seek independent professional advice where appropriate.`
    
//     const disclaimerLines = doc.splitTextToSize(disclaimer, 180)
//     doc.text(disclaimerLines, 15, currentY)
    
//     return doc
//   }

//   const handleViewPDF = async (report: PortfolioPerformanceReport) => {
//     const doc = await generatePDF(report)
//     const pdfBlob = doc.output('blob')
//     const pdfUrl = URL.createObjectURL(pdfBlob)
//     window.open(pdfUrl, '_blank')
//   }

//   const handleDownloadPDF = async (report: PortfolioPerformanceReport) => {
//     const doc = await generatePDF(report)
//     const userName = report.userPortfolio?.user?.name?.replace(/\s+/g, '-') || 'client'
//     const reportDate = new Date(report.reportDate).toISOString().split('T')[0]
//     const fileName = `portfolio-report-${userName}-${reportDate}.pdf`
//     doc.save(fileName)
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 transition-colors duration-200">
//       <div className="max-w-6xl mx-auto">
//         <div className="space-y-8">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Reports</h1>
//             <p className="text-slate-600 dark:text-slate-400">
//               Welcome back, {user?.name || user?.firstName || "User"}! View your portfolio performance reports
//             </p>
//           </div>

//           <div className="flex gap-2 border-b border-slate-300 dark:border-slate-700">
//             <button
//               onClick={() => setActiveTab("portfolio")}
//               className={`px-6 py-3 font-medium transition-colors relative ${
//                 activeTab === "portfolio"
//                   ? "text-blue-600 dark:text-blue-400"
//                   : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 Portfolio Performance
//               </div>
//               {activeTab === "portfolio" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
//               )}
//             </button>
//           </div>

//           {activeTab === "portfolio" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <h2 className="text-slate-900 dark:text-white font-semibold text-lg">Portfolio Performance Reports</h2>
//                   <select
//                     value={selectedPeriod}
//                     onChange={(e) => setSelectedPeriod(e.target.value as "daily" | "weekly" | "monthly")}
//                     className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="daily">Daily</option>
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <p className="text-slate-600 dark:text-slate-400 text-sm">Auto-generated every 24 hours</p>
//                   <Button
//                     onClick={fetchPortfolioReports}
//                     disabled={loading}
//                     size="sm"
//                     variant="outline"
//                     className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
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

//               {error && (
//                 <div className="border border-red-300 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
//                   <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
//                 </div>
//               )}

//               {loading && portfolioReports.length === 0 && (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
//                 </div>
//               )}

//               {!loading && portfolioReports.length === 0 && !error && (
//                 <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-12 bg-white dark:bg-slate-900/50 text-center shadow-sm dark:shadow-none">
//                   <TrendingUp className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
//                   <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">No Reports Yet</h3>
//                   <p className="text-slate-600 dark:text-slate-400 text-sm">
//                     Portfolio performance reports will appear here once generated.
//                   </p>
//                 </div>
//               )}

//               {!loading && portfolioReports.length > 0 && (
//                 <div className="grid grid-cols-1 gap-4">
//                   {portfolioReports.map((report) => (
//                     <div
//                       key={report.id}
//                       className="border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/70 transition-colors shadow-sm dark:shadow-none"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-slate-900 dark:text-white font-semibold text-lg">
//                               {report.userPortfolio?.portfolio?.name || "Portfolio"}
//                             </h3>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               report.totalLossGain >= 0 
//                                 ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" 
//                                 : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
//                             }`}>
//                               {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
//                             </span>
//                           </div>
//                           <p className="text-slate-600 dark:text-slate-400 text-sm">{formatDate(report.reportDate)}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             onClick={() => handleViewPDF(report)}
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
//                           >
//                             <Eye className="w-4 h-4 mr-2" />
//                             View PDF
//                           </Button>
//                           <Button
//                             onClick={() => handleDownloadPDF(report)}
//                             variant="outline"
//                             size="sm"
//                             className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
//                           >
//                             <Download className="w-4 h-4 mr-2" />
//                             Download
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-300 dark:border-slate-700 mb-4">
//                         <div>
//                           <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Net Asset Value</p>
//                           <p className="text-slate-900 dark:text-white font-semibold text-lg">{formatCurrency(report.totalCostPrice)}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Current Value</p>
//                           <p className="text-slate-900 dark:text-white font-semibold text-lg">{formatCurrency(report.totalCloseValue)}</p>
//                         </div>
//                         <div>
//                           <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Gain/Loss</p>
//                           <p className={`font-semibold text-lg ${
//                             report.totalLossGain >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//                           }`}>
//                             {formatCurrency(report.totalLossGain)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Return %</p>
//                           <p className={`font-semibold text-lg ${
//                             report.totalPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//                           }`}>
//                             {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
//                           </p>
//                         </div>
//                       </div>

//                       {report.assetBreakdown && report.assetBreakdown.length > 0 && (
//                         <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
//                           <h4 className="text-slate-900 dark:text-white text-sm font-semibold mb-3">Asset Breakdown</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
//                             {report.assetBreakdown
//                               .filter((asset: any) => asset.totalCashValue > 0)
//                               .map((asset: any) => (
//                               <div key={asset.assetClass} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3">
//                                 <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">{asset.assetClass}</p>
//                                 <p className="text-slate-900 dark:text-white font-semibold">{formatCurrency(asset.totalCashValue)}</p>
//                                 <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
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


// components/front-end/reports-client.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { listPerformanceReports, ListPerformanceReportsParams, PortfolioPerformanceReport } from "@/actions/portfolioPerformanceReports"

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

type TabType = "portfolio"

export default function ReportsClient({ 
  user, 
  initialReports, 
  initialPortfolioId,
  initialError 
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("portfolio")
  const [portfolioReports, setPortfolioReports] = useState<PortfolioPerformanceReport[]>(initialReports)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [userPortfolioId, setUserPortfolioId] = useState<string | null>(initialPortfolioId)
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

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

  const loadLogoImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load logo'))
      img.src = '/logos/GoldKach-Logo-New-1.jpg'
    })
  }

  const addPageBorderAndLogo = async (doc: jsPDF) => {
    // Add blue border around entire page
    doc.setDrawColor(25, 51, 136) // GoldKach blue
    doc.setLineWidth(4)
    doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, 'S')
    
    // Add GoldKach logo from public directory
    try {
      const logoImg = await loadLogoImage()
      doc.addImage(logoImg, 'JPEG', 10, 10, 45, 35)
    } catch (error) {
      // Fallback to text if image fails to load
      console.error('Logo loading failed, using text fallback:', error)
      doc.setFillColor(255, 255, 255)
      doc.rect(10, 10, 45, 35, 'F')
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(25, 51, 136)
      doc.text('GoldKach', 15, 25)
      
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(41, 128, 185)
      doc.text('Unlocking Global Investments', 15, 32)
    }
    
    doc.setTextColor(0, 0, 0)
  }

  const generatePDF = async (report: PortfolioPerformanceReport) => {
    const doc = new jsPDF('portrait')
    
    const walletData = user?.wallet
    const bankFee = walletData?.bankFee ?? 0
    const transactionFee = walletData?.transactionFee ?? 0
    const feeAtBank = walletData?.feeAtBank ?? 0
    const totalFees = walletData?.totalFees ?? 0
    const accountNumber = walletData?.accountNumber ?? report.userPortfolio?.id?.slice(-8).toUpperCase() ?? 'N/A'
    
    const clientName = user?.name || 
                       (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                       user?.firstName || 
                       'N/A'
    
    const portfolioName = report.userPortfolio?.portfolio?.name || 'N/A'
    const reportDateFormatted = new Date(report.reportDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    
    const reportDateObj = new Date(report.reportDate)
    const quarter = Math.floor(reportDateObj.getMonth() / 3) + 1
    const year = reportDateObj.getFullYear()
    const reportingPeriod = `Q${quarter} ${year}`
    
    // PAGE 1
    await addPageBorderAndLogo(doc)
    
    // Main Title Box
    doc.setFillColor(25, 51, 136)
    doc.rect(70, 15, 130, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('GoldKach Performance Report', 135, 27, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    
    let currentY = 50
    
    // CLIENT INFORMATION
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 90, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Client Information', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    doc.setFontSize(10)
    
    const clientInfo = [
      ['Client Name:', clientName],
      ['Fund Name:', portfolioName],
      ['Account Number:', accountNumber],
      ['Reporting Period:', reportingPeriod],
      ['Report Date:', reportDateFormatted]
    ]
    
    clientInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, 20, currentY)
      doc.setFont('helvetica', 'normal')
      doc.text(value, 60, currentY)
      currentY += 6
    })
    
    currentY += 5
    
    // PERFORMANCE SNAPSHOT
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 90, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Performance Snapshot', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    
    const performanceData = [
      [reportingPeriod, `${report.totalPercentage >= 0 ? '+' : ''}${report.totalPercentage.toFixed(2)}%`]
    ]
    
    autoTable(doc, {
      startY: currentY,
      head: [['Period', 'Portfolio Return']],
      body: performanceData,
      theme: 'grid',
      headStyles: { 
        fillColor: [220, 230, 241],
        textColor: [25, 51, 136],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left'
      },
      bodyStyles: {
        fillColor: [230, 236, 245],
        fontSize: 10,
        halign: 'right'
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 45 },
        1: { halign: 'right', cellWidth: 45, fontStyle: 'bold' }
      },
      margin: { left: 20 },
      tableWidth: 90
    })
    
    currentY = (doc as any).lastAutoTable.finalY + 10
    
    // ASSET ALLOCATION
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 90, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Asset Allocation', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    
    if (report.assetBreakdown && report.assetBreakdown.length > 0) {
      const assetAllocationData = report.assetBreakdown.map(asset => [
        asset.assetClass,
        asset.holdings.toString(),
        formatCurrency(asset.totalCashValue),
        `${asset.percentage.toFixed(2)}%`
      ])
      
      const totalHoldings = report.assetBreakdown.reduce((sum, a) => sum + a.holdings, 0)
      const totalValue = report.assetBreakdown.reduce((sum, a) => sum + a.totalCashValue, 0)
      assetAllocationData.push(['Total', totalHoldings.toString(), formatCurrency(totalValue), '100.00%'])
      
      autoTable(doc, {
        startY: currentY,
        head: [['Asset Class', 'Holdings', 'Total Cash Value', '%']],
        body: assetAllocationData,
        theme: 'grid',
        headStyles: { 
          fillColor: [25, 51, 136],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9,
          halign: 'right'
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        },
        margin: { left: 15, right: 15 },
        didParseCell: function(data) {
          if (data.row.index === assetAllocationData.length - 1 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fillColor = [230, 230, 230]
          }
        }
      })
    }
    
    // PAGE 2
    doc.addPage()
    await addPageBorderAndLogo(doc)
    
    currentY = 50
    
    // PORTFOLIO HOLDINGS
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 120, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Portfolio Holdings', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    
    if (report.userPortfolio?.userAssets && report.userPortfolio.userAssets.length > 0) {
      const positionsData = report.userPortfolio.userAssets.map((userAsset) => {
        const asset = userAsset.asset
        
        return [
          asset?.symbol || 'N/A',
          asset?.description || 'N/A',
          userAsset.stock.toFixed(2),
          `${userAsset.allocationPercentage.toFixed(0)}%`,
          formatCurrency(userAsset.costPerShare),
          formatCurrency(userAsset.costPrice),
          formatCurrency(asset?.closePrice || 0),
          formatCurrency(userAsset.closeValue),
          formatCurrency(userAsset.lossGain)
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
        formatCurrency(subTotalCostPrice),
        '',
        formatCurrency(subTotalCloseValue),
        formatCurrency(subTotalGainLoss)
      ])
      
      autoTable(doc, {
        startY: currentY,
        head: [[
          'Symbol',
          'Description',
          'Stocks',
          'Allocation',
          'Cost Per\nShare',
          'Cost Price',
          'Close Price',
          'Close\nValue',
          'UrL/G'
        ]],
        body: positionsData,
        theme: 'grid',
        headStyles: {
          fillColor: [25, 51, 136],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 1.5
        },
        bodyStyles: {
          fontSize: 7,
          cellPadding: 1.5
        },
        columnStyles: {
          0: { cellWidth: 14, halign: 'left' },   // Symbol       14
          1: { cellWidth: 28, halign: 'left' },   // Description  42
          2: { cellWidth: 18, halign: 'right' },  // Stocks       60
          3: { cellWidth: 16, halign: 'center' }, // Allocation   76
          4: { cellWidth: 20, halign: 'right' },  // Cost/Share   96
          5: { cellWidth: 24, halign: 'right' },  // Cost Price   120
          6: { cellWidth: 22, halign: 'right' },  // Close Price  142
          7: { cellWidth: 22, halign: 'right' },  // Close Value  164
          8: { cellWidth: 23, halign: 'right' },  // UrL/G        187 — fits in 180+margin
        },
        margin: { left: 15, right: 15 },
        didParseCell: function(data) {
          if (data.row.index === positionsData.length - 1 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fillColor = [230, 230, 230]
          }
        }
      })
      
      currentY = (doc as any).lastAutoTable.finalY + 8
      
      const costsData = [
        ['Bank Costs', formatCurrency(bankFee)],
        ['Transaction Cost', formatCurrency(transactionFee)],
        ['Cash at Bank', formatCurrency(feeAtBank)],
        ['Sub Total', formatCurrency(totalFees)],
        ['Total', formatCurrency(report.totalCloseValue + totalFees)]
      ]
      
      autoTable(doc, {
        startY: currentY,
        body: costsData,
        theme: 'grid',
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold', halign: 'left' },
          1: { cellWidth: 80, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15 },
        didParseCell: function(data) {
          if (data.row.index === costsData.length - 1) {
            data.cell.styles.fillColor = [25, 51, 136]
            data.cell.styles.textColor = [255, 255, 255]
          }
          if (data.row.index === costsData.length - 2) {
            data.cell.styles.fillColor = [230, 230, 230]
          }
        }
      })
    }
    
    currentY = (doc as any).lastAutoTable.finalY + 10
    
    // MARKET COMMENTARY
    if (currentY > 200) {
      doc.addPage()
      await addPageBorderAndLogo(doc)
      currentY = 50
    }
    
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 120, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Market Commentary', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Market Commentary – ${year}`, 15, currentY)
    
    currentY += 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    const commentary = `In ${year}, technology equities delivered strong performance, led by the semiconductor sector. The iShares Semiconductor ETF (SOXX) significantly outperformed broader tech markets, benefiting from sustained demand for AI infrastructure, data centres and advanced chip manufacturing. Meanwhile, the Invesco QQQ Trust (QQQ) posted solid gains, supported by resilient earnings from mega-cap technology leaders across software, cloud computing and digital services.

Overall, the portfolio demonstrated the benefits of combining high-growth sector exposure with broad technology diversification, capturing upside from structural tech trends while managing risk through balanced allocation.`
    
    const commentaryLines = doc.splitTextToSize(commentary, 180)
    doc.text(commentaryLines, 15, currentY)
    
    // PAGE 3 - DEFINITIONS
    doc.addPage()
    await addPageBorderAndLogo(doc)
    
    currentY = 50
    
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 70, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Definitions', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    
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
        term: 'UrL/G:',
        definition: 'The unrealised profit or loss on a holding, calculated as the difference between its current market value and its original cost. This is "unrealised" because the position hasn\'t been sold yet.\nUrL/G = Close Value – Cost Price'
      },
      {
        term: 'Reallocation:',
        definition: 'Reallocation in a portfolio statement refers to the process of adjusting the distribution of assets within an investment portfolio. This is typically done to maintain a desired asset allocation, respond to market changes, or align the portfolio with updated investment goals or risk tolerance.'
      }
    ]
    
    doc.setFontSize(9)
    for (const item of definitions) {
      if (currentY > 250) {
        doc.addPage()
        await addPageBorderAndLogo(doc)
        currentY = 50
      }
      
      doc.setFont('helvetica', 'bold')
      doc.text(item.term, 15, currentY)
      currentY += 5
      
      doc.setFont('helvetica', 'normal')
      const defLines = doc.splitTextToSize(item.definition, 180)
      doc.text(defLines, 15, currentY)
      currentY += (defLines.length * 4) + 6
    }
    
    // REGULATION
    currentY += 5
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 70, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Regulation', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('GoldKach Uganda Limited is regulated by the Capital Markets Authority of Uganda as a Fund', 15, currentY)
    doc.text('Manager. Licence No. GKUL 2526 (FM)', 15, currentY + 5)
    
    // ADDRESS
    currentY += 15
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 70, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Address', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const addressLines = [
      '3rd Floor Kanjokya House',
      'Plot 90 Kanjokya Street',
      'P.O.Box 500094',
      'Kampala, Uganda'
    ]
    addressLines.forEach(line => {
      doc.text(line, 15, currentY)
      currentY += 5
    })
    
    // PAGE 4 - DISCLAIMER
    doc.addPage()
    await addPageBorderAndLogo(doc)
    
    currentY = 50
    
    doc.setFillColor(25, 51, 136)
    doc.rect(15, currentY, 70, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Disclaimer', 20, currentY + 7)
    doc.setTextColor(0, 0, 0)
    
    currentY += 15
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    const disclaimer = `Past performance is not a reliable indicator of future results. Portfolio returns are provided for information purposes only and reflect historical performance over the stated period. Performance may be influenced by market conditions, currency movements, fees, and other external factors. The value of investments may fluctuate over time. This information does not constitute investment advice or a solicitation to buy or sell any financial instrument. Investors should consider their individual circumstances and seek independent professional advice where appropriate.`
    
    const disclaimerLines = doc.splitTextToSize(disclaimer, 180)
    doc.text(disclaimerLines, 15, currentY)
    
    return doc
  }

  const handleViewPDF = async (report: PortfolioPerformanceReport) => {
    const doc = await generatePDF(report)
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
  }

  const handleDownloadPDF = async (report: PortfolioPerformanceReport) => {
    const doc = await generatePDF(report)
    const userName = report.userPortfolio?.user?.name?.replace(/\s+/g, '-') || 'client'
    const reportDate = new Date(report.reportDate).toISOString().split('T')[0]
    const fileName = `portfolio-report-${userName}-${reportDate}.pdf`
    doc.save(fileName)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Reports</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome back, {user?.name || user?.firstName || "User"}! View your portfolio performance reports
            </p>
          </div>

          <div className="flex gap-2 border-b border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "portfolio"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Portfolio Performance
              </div>
              {activeTab === "portfolio" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>

          {activeTab === "portfolio" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-slate-900 dark:text-white font-semibold text-lg">Portfolio Performance Reports</h2>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as "daily" | "weekly" | "monthly")}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Auto-generated every 24 hours</p>
                  <Button
                    onClick={fetchPortfolioReports}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
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

              {error && (
                <div className="border border-red-300 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {loading && portfolioReports.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              )}

              {!loading && portfolioReports.length === 0 && !error && (
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-12 bg-white dark:bg-slate-900/50 text-center shadow-sm dark:shadow-none">
                  <TrendingUp className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">No Reports Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Portfolio performance reports will appear here once generated.
                  </p>
                </div>
              )}

              {!loading && portfolioReports.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {portfolioReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-slate-300 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/70 transition-colors shadow-sm dark:shadow-none"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-slate-900 dark:text-white font-semibold text-lg">
                              {report.userPortfolio?.portfolio?.name || "Portfolio"}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              report.totalLossGain >= 0 
                                ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" 
                                : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                            }`}>
                              {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">{formatDate(report.reportDate)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewPDF(report)}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View PDF
                          </Button>
                          <Button
                            onClick={() => handleDownloadPDF(report)}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-transparent"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-300 dark:border-slate-700 mb-4">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Net Asset Value</p>
                          <p className="text-slate-900 dark:text-white font-semibold text-lg">{formatCurrency(report.totalCostPrice)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Current Value</p>
                          <p className="text-slate-900 dark:text-white font-semibold text-lg">{formatCurrency(report.totalCloseValue)}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Gain/Loss</p>
                          <p className={`font-semibold text-lg ${
                            report.totalLossGain >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {formatCurrency(report.totalLossGain)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Return %</p>
                          <p className={`font-semibold text-lg ${
                            report.totalPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {report.totalPercentage >= 0 ? "+" : ""}{report.totalPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {report.assetBreakdown && report.assetBreakdown.length > 0 && (
                        <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                          <h4 className="text-slate-900 dark:text-white text-sm font-semibold mb-3">Asset Breakdown</h4>
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                            {report.assetBreakdown
                              .filter((asset: any) => asset.totalCashValue > 0)
                              .map((asset: any) => (
                              <div key={asset.assetClass} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3">
                                <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">{asset.assetClass}</p>
                                <p className="text-slate-900 dark:text-white font-semibold">{formatCurrency(asset.totalCashValue)}</p>
                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
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