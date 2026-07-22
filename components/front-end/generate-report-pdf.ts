import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/** Historical per-asset snapshot stored at report generation time */
interface AssetSnapshot {
  assetId:     string;
  symbol:      string;
  description: string;
  stock:       number;
  costPerShare: number;
  costPrice:   number;
  closePrice:  number;  // price at the time the report was generated
  closeValue:  number;
  lossGain:    number;
}

interface ReportData {
  id: string;
  userPortfolioId: string;
  reportDate: string;
  totalCostPrice: number;
  totalCloseValue: number;
  totalLossGain: number;
  totalPercentage: number;
  totalFees: number;
  netAssetValue: number;
  bankCost: number;
  transactionCost: number;
  cashAtBank: number;
  /** Historical per-asset prices captured when this report was generated. Always use these over live userAssets prices. */
  assetSnapshots?: AssetSnapshot[];
  assetBreakdown?: Array<{
    assetClass: string;
    holdings: number;
    totalCashValue: number;
    percentage: number;
  }>;
  userPortfolio?: {
    id: string;
    userId?: string;
    portfolioId?: string;
    customName?: string;
    portfolio?: { name: string };
    userAssets?: Array<{
      assetId?: string;
      stock: number;
      allocationPercentage: number;
      costPerShare: number;
      costPrice: number;
      closeValue: number;
      lossGain: number;
      asset?: {
        symbol?: string;
        description?: string;
        closePrice?: number;
      };
    }>;
  };
}

interface UserData {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  masterWallet?: {
    accountNumber?: string | null;
    bankFee?: number | null;
    transactionFee?: number | null;
    feeAtBank?: number | null;
    totalFees?: number | null;
  } | null;
}

export interface DepositFeeSummary {
  totalBankCost: number;
  totalTransactionCost: number;
  totalCashAtBank: number;
  totalFees: number;
  depositCount: number;
}

const loadLogoImage = (): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(new Image());
    img.src = "/logos/GoldKach-Logo-New-1.jpg";
  });
};

const addPageBorderAndLogo = async (doc: jsPDF) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setDrawColor(25, 51, 136);
  doc.setLineWidth(4);
  doc.rect(5, 5, pageW - 10, pageH - 10, "S");

  const logoImg = await loadLogoImage();
  const logoLoaded = logoImg.naturalWidth > 0;

  if (logoLoaded) {
    doc.addImage(logoImg, "JPEG", 10, 10, 45, 35);
  } else {
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 45, 35, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 51, 136);
    doc.text("GoldKach", 15, 25);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(41, 128, 185);
    doc.text("Unlocking Global Investments", 15, 32);
  }

  // Logo watermark centred on page
  if (logoLoaded) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = logoImg.naturalWidth;
      canvas.height = logoImg.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(logoImg, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const wmH = 48;
        const wmW = wmH * (logoImg.naturalWidth / logoImg.naturalHeight);
        const x = (pageW - wmW) / 2;
        const y = (pageH - wmH) / 2;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { GState } = require("jspdf");
        doc.saveGraphicsState();
        doc.setGState(new GState({ opacity: 0.06 }));
        doc.addImage(dataUrl, "JPEG", x, y, wmW, wmH);
        doc.restoreGraphicsState();
      }
    } catch {
      // GState not available — skip watermark silently
    }
  }

  doc.setTextColor(0, 0, 0);
};

export async function generatePerformanceReportPDF(
  report: ReportData,
  user: UserData,
  displayName: string,
  feeSummary?: DepositFeeSummary
): Promise<jsPDF> {
  const doc = new jsPDF("portrait");

  const walletData = user?.masterWallet;
  const bankCost = feeSummary?.totalBankCost ?? report.bankCost ?? walletData?.bankFee ?? 0;
  const transactionCost = feeSummary?.totalTransactionCost ?? report.transactionCost ?? walletData?.transactionFee ?? 0;
  const cashAtBank = feeSummary?.totalCashAtBank ?? report.cashAtBank ?? walletData?.feeAtBank ?? 0;
  const totalFees = feeSummary?.totalFees ?? report.totalFees ?? walletData?.totalFees ?? 0;
  const accountNumber = walletData?.accountNumber ?? report.userPortfolio?.id?.slice(-8).toUpperCase() ?? "N/A";

  const portfolioName = report.userPortfolio?.portfolio?.name ?? report.userPortfolio?.customName ?? "N/A";
  const reportDateFormatted = fmtDate(report.reportDate);

  const reportDateObj = new Date(report.reportDate);
  const quarter = Math.floor(reportDateObj.getMonth() / 3) + 1;
  const year = reportDateObj.getFullYear();
  const reportingPeriod = `Q${quarter} ${year}`;

  await addPageBorderAndLogo(doc);

  doc.setFillColor(25, 51, 136);
  doc.rect(70, 15, 130, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("GoldKach Performance Report", 135, 27, { align: "center" });
  doc.setTextColor(0, 0, 0);

  let currentY = 50;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 90, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Client Information", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;
  doc.setFontSize(10);

  const clientInfo = [
    ["Client Name:", displayName],
    ["Fund Name:", portfolioName],
    ["Account Number:", accountNumber],
    ["Reporting Period:", reportingPeriod],
    ["Report Date:", reportDateFormatted],
  ];

  clientInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, currentY);
    currentY += 6;
  });

  currentY += 5;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 90, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Performance Snapshot", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;

  const performanceData = [
    [reportingPeriod, `${report.totalPercentage >= 0 ? "+" : ""}${report.totalPercentage.toFixed(2)}%`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Period", "Portfolio Return"]],
    body: performanceData,
    theme: "grid",
    headStyles: {
      fillColor: [220, 230, 241],
      textColor: [25, 51, 136],
      fontSize: 10,
      fontStyle: "bold",
      halign: "left",
    },
    bodyStyles: {
      fillColor: [230, 236, 245],
      fontSize: 10,
      halign: "right",
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 45 },
      1: { halign: "right", cellWidth: 45, fontStyle: "bold" },
    },
    margin: { left: 20 },
    tableWidth: 90,
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 90, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Asset Allocation", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;

  if (report.assetBreakdown && report.assetBreakdown.length > 0) {
    const totalValue = report.assetBreakdown.reduce((sum, a) => sum + a.totalCashValue, 0);
    const totalWithCash = totalValue + cashAtBank;

    const assetAllocationData = report.assetBreakdown.map((asset) => {
      // Replace CASH row's totalCashValue with the actual cashAtBank value
      const isCash = asset.assetClass === "CASH";
      const cashValue = isCash ? cashAtBank : asset.totalCashValue;
      const pct = totalWithCash > 0 ? (cashValue / totalWithCash) * 100 : asset.percentage;
      return [
        asset.assetClass,
        isCash ? (cashAtBank > 0 ? "1" : "0") : asset.holdings.toString(),
        fmt(cashValue),
        `${pct.toFixed(2)}%`,
      ];
    });

    const totalHoldings = report.assetBreakdown.reduce((sum, a) => sum + (a.assetClass === "CASH" ? (cashAtBank > 0 ? 1 : 0) : a.holdings), 0);
    assetAllocationData.push(["Total", totalHoldings.toString(), fmt(totalWithCash), "100.00%"]);

    autoTable(doc, {
      startY: currentY,
      head: [["Asset Class", "Holdings", "Total Cash Value", "%"]],
      body: assetAllocationData,
      theme: "grid",
      headStyles: {
        fillColor: [25, 51, 136],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        halign: "right",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: 15, right: 15 },
      didParseCell: function (data) {
        if (data.row.index === assetAllocationData.length - 1 && data.section === "body") {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 230, 230];
        }
      },
    });
  }

  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.addPage();
  await addPageBorderAndLogo(doc);

  currentY = 50;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 120, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Portfolio Holdings", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;

  // Prefer historical snapshots (stored at report generation time).
  // Fall back to live userAssets only if no snapshots exist (legacy reports).
  const snapshots = report.assetSnapshots ?? [];
  const liveUserAssets = report.userPortfolio?.userAssets ?? [];

  // Build allocationPercentage lookup from live assets (config value, doesn't change with price)
  const allocPctMap = new Map(
    liveUserAssets.map((ua) => [ua.assetId ?? ua.asset?.symbol ?? "", ua.allocationPercentage])
  );

  const sourceAssets: Array<{
    symbol: string; description: string; stock: number;
    allocationPct: number; costPerShare: number; costPrice: number;
    closePrice: number; closeValue: number; lossGain: number;
  }> = snapshots.length > 0
    ? snapshots.map((s) => ({
        symbol:       s.symbol      || "N/A",
        description:  s.description || "N/A",
        stock:        s.stock,
        allocationPct: allocPctMap.get(s.assetId) ?? 0,
        costPerShare: s.costPerShare,
        costPrice:    s.costPrice,
        closePrice:   s.closePrice,   // historical price at report date
        closeValue:   s.closeValue,   // historical value at report date
        lossGain:     s.lossGain,     // historical gain/loss at report date
      }))
    : liveUserAssets.map((ua) => ({
        symbol:       ua.asset?.symbol      || "N/A",
        description:  ua.asset?.description || "N/A",
        stock:        ua.stock,
        allocationPct: ua.allocationPercentage,
        costPerShare: ua.costPerShare,
        costPrice:    ua.costPrice,
        closePrice:   ua.asset?.closePrice ?? 0,   // live fallback
        closeValue:   ua.closeValue,
        lossGain:     ua.lossGain,
      }));

  if (sourceAssets.length > 0) {
    const positionsData = sourceAssets.map((a) => [
      a.symbol,
      a.description,
      a.stock.toFixed(2),
      `${a.allocationPct.toFixed(0)}%`,
      fmt(a.costPerShare),
      fmt(a.costPrice),
      fmt(a.closePrice),
      fmt(a.closeValue),
      fmt(a.lossGain),
    ]);

    const subTotalCostPrice  = sourceAssets.reduce((sum, a) => sum + a.costPrice,  0);
    const subTotalCloseValue = sourceAssets.reduce((sum, a) => sum + a.closeValue, 0);
    const subTotalGainLoss   = sourceAssets.reduce((sum, a) => sum + a.lossGain,   0);

    positionsData.push(["Sub Total", "", "", "", "", fmt(subTotalCostPrice), "", fmt(subTotalCloseValue), fmt(subTotalGainLoss)]);

    autoTable(doc, {
      startY: currentY,
      head: [["Symbol", "Description", "Stocks", "Allocation", "Cost Per\nShare", "Cost Price", "Close Price", "Close\nValue", "UrL/G"]],
      body: positionsData,
      theme: "grid",
      headStyles: {
        fillColor: [25, 51, 136],
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 1.5,
      },
      columnStyles: {
        0: { cellWidth: 14, halign: "left" },
        1: { cellWidth: 28, halign: "left" },
        2: { cellWidth: 18, halign: "right" },
        3: { cellWidth: 16, halign: "center" },
        4: { cellWidth: 20, halign: "right" },
        5: { cellWidth: 24, halign: "right" },
        6: { cellWidth: 22, halign: "right" },
        7: { cellWidth: 22, halign: "right" },
        8: { cellWidth: 23, halign: "right" },
      },
      margin: { left: 15, right: 15 },
      didParseCell: function (data) {
        if (data.row.index === positionsData.length - 1 && data.section === "body") {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 230, 230];
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    const costsData = [
      ["Bank Cost", fmt(bankCost)],
      ["Transaction Cost", fmt(transactionCost)],
      ["Cash at Bank", fmt(cashAtBank)],
      ["Sub Total", fmt(totalFees)],
      ["Total", fmt(report.totalCloseValue + totalFees)],
    ];

    autoTable(doc, {
      startY: currentY,
      body: costsData,
      theme: "grid",
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80, fontStyle: "bold", halign: "left" },
        1: { cellWidth: 80, halign: "right", fontStyle: "bold" },
      },
      margin: { left: 15 },
      didParseCell: function (data) {
        if (data.row.index === costsData.length - 1) {
          data.cell.styles.fillColor = [25, 51, 136];
          data.cell.styles.textColor = [255, 255, 255];
        }
        if (data.row.index === costsData.length - 2) {
          data.cell.styles.fillColor = [230, 230, 230];
        }
      },
    });
  }

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > 200) {
    doc.addPage();
    await addPageBorderAndLogo(doc);
    currentY = 50;
  }

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 120, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Market Commentary", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Market Commentary – ${year}`, 15, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const commentary = `In ${year}, technology equities delivered strong performance, led by the semiconductor sector. The iShares Semiconductor ETF (SOXX) significantly outperformed broader tech markets, benefiting from sustained demand for AI infrastructure, data centres and advanced chip manufacturing. Meanwhile, the Invesco QQQ Trust (QQQ) posted solid gains, supported by resilient earnings from mega-cap technology leaders across software, cloud computing and digital services.

Overall, the portfolio demonstrated the benefits of combining high-growth sector exposure with broad technology diversification, capturing upside from structural tech trends while managing risk through balanced allocation.`;

  const commentaryLines = doc.splitTextToSize(commentary, 180);
  doc.text(commentaryLines, 15, currentY);

  doc.addPage();
  await addPageBorderAndLogo(doc);

  currentY = 50;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 70, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Definitions", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;

  const definitions = [
    {
      term: "Symbol (Ticker):",
      definition: "A unique abbreviation used to identify a publicly traded security on a stock exchange. For example, AAPL is the ticker symbol for Apple Inc.",
    },
    {
      term: "Cost Per Share:",
      definition: "The average price paid to acquire one share of a security, including any commissions or transaction fees.",
    },
    {
      term: "Cost Price:",
      definition: "The total amount paid for a security or group of securities. This is calculated as:\nCost Price = Number of Shares × Cost Per Share",
    },
    {
      term: "Close Price:",
      definition: "The last price at which a security was traded during a regular trading session on a given day. It represents the market value at market close.",
    },
    {
      term: "Close Value:",
      definition: "The market value of your holding based on the latest closing price. This is calculated as:\nClose Value = Number of Shares × Close Price",
    },
    {
      term: "UrL/G:",
      definition: "The unrealised profit or loss on a holding, calculated as the difference between its current market value and its original cost. This is 'unrealised' because the position hasn't been sold yet.\nUrL/G = Close Value – Cost Price",
    },
    {
      term: "Reallocation:",
      definition: "Reallocation in a portfolio statement refers to the process of adjusting the distribution of assets within an investment portfolio. This is typically done to maintain a desired asset allocation, respond to market changes, or align the portfolio with updated investment goals or risk tolerance.",
    },
  ];

  doc.setFontSize(9);
  for (const item of definitions) {
    if (currentY > 250) {
      doc.addPage();
      await addPageBorderAndLogo(doc);
      currentY = 50;
    }

    doc.setFont("helvetica", "bold");
    doc.text(item.term, 15, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    const defLines = doc.splitTextToSize(item.definition, 180);
    doc.text(defLines, 15, currentY);
    currentY += defLines.length * 4 + 6;
  }

  currentY += 5;
  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 70, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Regulation", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("GoldKach Uganda Limited is regulated by the Capital Markets Authority of Uganda as a Fund", 15, currentY);
  doc.text("Manager. Licence No. GKUL 2526 (FM)", 15, currentY + 5);

  currentY += 15;
  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 70, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Address", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const addressLines = [
    "3rd Floor Kanjokya House",
    "Plot 90 Kanjokya Street",
    "P.O.Box 500094",
    "Kampala, Uganda",
  ];
  addressLines.forEach((line) => {
    doc.text(line, 15, currentY);
    currentY += 5;
  });

  doc.addPage();
  await addPageBorderAndLogo(doc);

  currentY = 50;

  doc.setFillColor(25, 51, 136);
  doc.rect(15, currentY, 70, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Disclaimer", 20, currentY + 7);
  doc.setTextColor(0, 0, 0);

  currentY += 15;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const disclaimer = `Past performance is not a reliable indicator of future results. Portfolio returns are provided for information purposes only and reflect historical performance over the stated period. Performance may be influenced by market conditions, currency movements, fees, and other external factors. The value of investments may fluctuate over time. This information does not constitute investment advice or a solicitation to buy or sell any financial instrument. Investors should consider their individual circumstances and seek independent professional advice where appropriate.`;

  const disclaimerLines = doc.splitTextToSize(disclaimer, 180);
  doc.text(disclaimerLines, 15, currentY);

  return doc;
}
