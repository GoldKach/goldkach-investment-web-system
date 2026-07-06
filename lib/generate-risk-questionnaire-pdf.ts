import { RISK_QUESTIONS, computeRiskProfile, type RiskAnswers } from "@/lib/risk-questionnaire"

// Brand colours — navy from logo + sky blue from logo (replaces gold)
const NAVY    = [25, 51, 136] as const   // #193388 — dark navy diamond
const SKYBLUE = [0, 176, 240] as const   // #00B0F0 — sky blue from logo
const WHITE   = [255, 255, 255] as const
const DARK    = [20, 20, 20] as const
const GRAY    = [110, 110, 110] as const
const LGRAY   = [180, 180, 180] as const
const BGGRAY  = [248, 248, 252] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any

interface LogoInfo {
  dataUrl: string
  aspectRatio: number   // naturalWidth / naturalHeight
}

async function loadLogo(): Promise<LogoInfo | null> {
  try {
    const res = await fetch("/logos/GoldKach-Logo-New-1.png")
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    // Measure natural dimensions so we can maintain aspect ratio
    const aspectRatio = await new Promise<number>((resolve) => {
      const img = new window.Image()
      img.onload = () => resolve(img.naturalWidth / img.naturalHeight)
      img.onerror = () => resolve(1)   // fallback 1:1
      img.src = dataUrl
    })
    return { dataUrl, aspectRatio }
  } catch {
    return null
  }
}

function drawCheckbox(doc: Doc, x: number, y: number, checked: boolean, size = 3.2) {
  doc.setDrawColor(60, 60, 60)
  doc.setLineWidth(0.3)
  doc.rect(x, y - size + 0.5, size, size)
  if (checked) {
    doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2])
    doc.setLineWidth(0.7)
    doc.line(x + 0.4, y - size / 2 + 0.5, x + size / 2, y - 0.2)
    doc.line(x + size / 2, y - 0.2, x + size - 0.3, y - size + 0.8)
  }
}

function addPageHeader(doc: Doc, pageW: number, margin: number, logo: LogoInfo | null) {
  // Sky-blue top rule
  doc.setDrawColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.setLineWidth(0.7)
  doc.line(margin, 11, pageW - margin, 11)

  if (logo) {
    // Fixed height = 9 mm; width calculated from natural aspect ratio
    const logoH = 9
    const logoW = logoH * logo.aspectRatio
    doc.addImage(logo.dataUrl, "PNG", margin, 1.2, logoW, logoH)
  } else {
    doc.setFontSize(8.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2])
    doc.text("GoldKach Uganda Limited", margin, 8)
  }

  // Right: document title
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text("Investor Risk Profile Questionnaire", pageW - margin, 8, { align: "right" })

  // Sky-blue bottom rule
  doc.setDrawColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.setLineWidth(0.3)
  doc.line(margin, 12, pageW - margin, 12)
}

function addWatermark(doc: Doc, pageW: number, pageH: number, logo: LogoInfo | null) {
  if (!logo) return
  const wmH = 38
  const wmW = wmH * logo.aspectRatio
  const x = (pageW - wmW) / 2
  const y = (pageH - wmH) / 2
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GState } = require("jspdf")
    doc.saveGraphicsState()
    doc.setGState(new GState({ opacity: 0.05 }))
    doc.addImage(logo.dataUrl, "PNG", x, y, wmW, wmH)
    doc.restoreGraphicsState()
  } catch {
    // GState not available — skip watermark
  }
}

function addPageFooter(doc: Doc, pageW: number, pageH: number, margin: number, page: number, total: number) {
  doc.setDrawColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.setLineWidth(0.3)
  doc.line(margin, pageH - 12, pageW - margin, pageH - 12)

  doc.setFontSize(7)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text(
    "Confidential — For GoldKach Uganda Limited internal and CMA suitability assessment purposes",
    margin, pageH - 8
  )
  doc.text(`Page ${page} of ${total}`, pageW - margin, pageH - 8, { align: "right" })
}

export async function generateRiskQuestionnairePdf(opts: {
  clientName: string
  accountNumber?: string | null
  advisorName?: string | null
  answers: RiskAnswers
  riskProfile?: string | null
  suggestedStrategy?: string | null
  advisorOverride?: boolean | null
  advisorOverrideProfile?: string | null
  advisorOverrideReason?: string | null
  consentConfirmed?: boolean
}) {
  const { default: jsPDF } = await import("jspdf")

  const {
    clientName, accountNumber, advisorName, answers,
    advisorOverride, advisorOverrideProfile, advisorOverrideReason,
    consentConfirmed = false,
  } = opts

  const { profile } = computeRiskProfile(answers)

  const logo = await loadLogo()

  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentW = pageW - margin * 2

  // ── PAGE 1 ─────────────────────────────────────────────────────
  addPageHeader(doc, pageW, margin, logo)
  addWatermark(doc, pageW, pageH, logo)
  let y = 20

  // Main title
  doc.setFontSize(17)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  doc.text("GoldKach Investor Risk Questionnaire", margin, y)
  y += 5

  // Subtitle
  doc.setFontSize(8.5)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  const subtitleLines = doc.splitTextToSize(
    "A simple set of questions to help us understand your comfort with risk, so we can suggest an investment approach that suits you.",
    contentW
  )
  doc.text(subtitleLines, margin, y)
  y += subtitleLines.length * 4.5 + 5

  // ── Client info table ──
  const infoRows: [string, string][] = [
    ["Client Name:", clientName],
    ["Account / Reference No.:", accountNumber ?? ""],
    ["Jurisdiction:", "Uganda"],
    ["Date:", new Date().toLocaleDateString("en-GB")],
    ["GoldKach Advisor:", advisorName ?? ""],
  ]
  const labelColW = 54
  const valueColW = contentW - labelColW
  const rowH = 6.5

  doc.setDrawColor(LGRAY[0], LGRAY[1], LGRAY[2])
  doc.setLineWidth(0.3)

  for (const [label, value] of infoRows) {
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    doc.rect(margin, y, labelColW, rowH, "FD")
    doc.rect(margin + labelColW, y, valueColW, rowH, "FD")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
    doc.text(label, margin + 2, y + 4.3)

    doc.setFont("helvetica", "normal")
    doc.text(value, margin + labelColW + 2, y + 4.3)

    y += rowH
  }
  y += 5

  // Instructions
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  const instrLines = doc.splitTextToSize(
    "How to fill this in: For each section below, the selected option is marked ☑. Each answer has a score next to it. " +
    "Add up all 10 section scores to get your total — this tells us your risk profile (see the Scoring Matrix near the end). " +
    "It should take about 5–10 minutes.",
    contentW
  )
  doc.text(instrLines, margin, y)
  y += instrLines.length * 4 + 6

  // ── Sections ───────────────────────────────────────────────────
  for (let i = 0; i < RISK_QUESTIONS.length; i++) {
    const q = RISK_QUESTIONS[i]
    const selectedScore = answers[q.id]

    const qLines = doc.splitTextToSize(q.question, contentW - 4)
    const needed = 7 + qLines.length * 4.5 + q.options.length * 6 + 6

    if (y + needed > pageH - 18) {
      doc.addPage()
      addPageHeader(doc, pageW, margin, logo)
      addWatermark(doc, pageW, pageH, logo)
      y = 20
    }

    // Navy section bar
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
    doc.rect(margin, y, contentW, 7, "F")
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(WHITE[0], WHITE[1], WHITE[2])
    doc.text(`${q.section}   ${q.title}`, margin + 3, y + 4.8)
    y += 7

    // Question
    doc.setFontSize(9)
    doc.setFont("helvetica", "bolditalic")
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
    doc.text(qLines, margin + 3, y + 4.5)
    y += qLines.length * 4.5 + 2

    // Options
    for (const opt of q.options) {
      const isSelected = opt.score === selectedScore
      drawCheckbox(doc, margin + 3, y + 3.5, isSelected)

      doc.setFont("helvetica", isSelected ? "bold" : "normal")
      doc.setFontSize(9)
      doc.setTextColor(DARK[0], DARK[1], DARK[2])
      doc.text(opt.label, margin + 8, y + 3.5)

      const lw = doc.getTextWidth(opt.label)
      doc.setFont("helvetica", "italic")
      doc.setFontSize(8.5)
      doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
      doc.text(`(${opt.score})`, margin + 8 + lw + 1.5, y + 3.5)

      y += 6
    }
    y += 4
  }

  // ── Your Score ─────────────────────────────────────────────────
  if (y + 30 > pageH - 18) {
    doc.addPage()
    addPageHeader(doc, pageW, margin, logo)
    addWatermark(doc, pageW, pageH, logo)
    y = 20
  }
  y += 2

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.text("Your Score", margin, y)
  y += 5

  const totalScore = Object.values(answers).reduce((s, v) => s + (v ?? 0), 0)
  const sc1 = 80, sc2 = 30, sc3 = 40, sc4 = contentW - sc1 - sc2 - sc3
  const sRowH = 8

  doc.setDrawColor(LGRAY[0], LGRAY[1], LGRAY[2])
  doc.setLineWidth(0.3)
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  doc.rect(margin, y, sc1, sRowH, "FD")
  doc.rect(margin + sc1, y, sc2, sRowH, "FD")
  doc.rect(margin + sc1 + sc2, y, sc3, sRowH, "FD")
  doc.rect(margin + sc1 + sc2 + sc3, y, sc4, sRowH, "FD")

  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  doc.text("Total Score (add up Sections 1–10):", margin + 2, y + 5.2)
  doc.setFont("helvetica", "bold")
  doc.text(`${totalScore} / 50`, margin + sc1 + 2, y + 5.2)
  doc.setFont("helvetica", "normal")
  doc.text("Your Risk Profile:", margin + sc1 + sc2 + 2, y + 5.2)
  doc.setFont("helvetica", "bold")
  doc.text(profile, margin + sc1 + sc2 + sc3 + 2, y + 5.2)
  y += sRowH + 7

  // ── Scoring Matrix ─────────────────────────────────────────────
  if (y + 40 > pageH - 18) {
    doc.addPage()
    addPageHeader(doc, pageW, margin, logo)
    addWatermark(doc, pageW, pageH, logo)
    y = 20
  }

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.text("Scoring Matrix", margin, y)
  y += 5

  const mc1 = 18, mc2 = 54, mc3 = contentW - mc1 - mc2
  const mRowH = 7.5

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
  doc.rect(margin, y, mc1, mRowH, "F")
  doc.rect(margin + mc1, y, mc2, mRowH, "F")
  doc.rect(margin + mc1 + mc2, y, mc3, mRowH, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2])
  doc.text("Score", margin + 2, y + 5)
  doc.text("Risk Profile", margin + mc1 + 2, y + 5)
  doc.text("What this means for you", margin + mc1 + mc2 + 2, y + 5)
  y += mRowH

  const matrixData: [string, string, string][] = [
    ["10–23", "Conservative (Income)",
      "You want to protect your money above all else, and prefer very little movement in value."],
    ["24–37", "Balanced (Income and Growth)",
      "You're comfortable with some ups and downs in exchange for growth over time."],
    ["38–50", "Growth",
      "You're aiming for the biggest growth and can accept noticeable swings in value, including temporary losses."],
  ]

  for (let i = 0; i < matrixData.length; i++) {
    const [scoreRange, profileLabel, desc] = matrixData[i]
    const isCurrent = profile.includes(profileLabel.split(" ")[0])
    const bg = i % 2 === 0 ? BGGRAY : WHITE

    doc.setFillColor(bg[0], bg[1], bg[2])
    doc.rect(margin, y, contentW, mRowH, "F")
    doc.setDrawColor(LGRAY[0], LGRAY[1], LGRAY[2])
    doc.setLineWidth(0.3)
    doc.rect(margin, y, mc1, mRowH)
    doc.rect(margin + mc1, y, mc2, mRowH)
    doc.rect(margin + mc1 + mc2, y, mc3, mRowH)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
    doc.text(scoreRange, margin + 2, y + 5)

    doc.setFont("helvetica", isCurrent ? "bold" : "normal")
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2])
    doc.text(profileLabel, margin + mc1 + 2, y + 5)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
    doc.text(doc.splitTextToSize(desc, mc3 - 4)[0], margin + mc1 + mc2 + 2, y + 5)

    y += mRowH
  }

  y += 4
  doc.setFontSize(7.5)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text("Highest possible total: 50 (10 questions × 5 points each).", margin, y)
  y += 7

  // ── Suggested Strategy ────────────────────────────────────────
  if (y + 40 > pageH - 18) {
    doc.addPage()
    addPageHeader(doc, pageW, margin, logo)
    addWatermark(doc, pageW, pageH, logo)
    y = 20
  }

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.text("Suggested Strategy Based on Your Risk Profile", margin, y)
  y += 5

  const str1 = 68, str2 = contentW - str1
  const strRowH = 7.5

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
  doc.rect(margin, y, str1, strRowH, "F")
  doc.rect(margin + str1, y, str2, strRowH, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2])
  doc.text("Risk Profile", margin + 2, y + 5)
  doc.text("Suggested Strategy", margin + str1 + 2, y + 5)
  y += strRowH

  const strategyRows: [string, string][] = [
    ["Conservative (Income)", "70% Income ETFs / 30% Growth ETFs"],
    ["Balanced (Income and Growth)", "50% Income ETFs / 50% Growth ETFs"],
    ["Growth", "100% Growth ETFs"],
  ]

  for (let i = 0; i < strategyRows.length; i++) {
    const [sp, ss] = strategyRows[i]
    const isCurrent = profile.includes(sp.split(" ")[0])
    const bg = i % 2 === 0 ? BGGRAY : WHITE

    doc.setFillColor(bg[0], bg[1], bg[2])
    doc.rect(margin, y, contentW, strRowH, "F")
    doc.setDrawColor(LGRAY[0], LGRAY[1], LGRAY[2])
    doc.setLineWidth(0.3)
    doc.rect(margin, y, str1, strRowH)
    doc.rect(margin + str1, y, str2, strRowH)

    doc.setFont("helvetica", isCurrent ? "bold" : "normal")
    doc.setFontSize(9)
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2])
    doc.text(sp, margin + 2, y + 5)

    doc.setFont("helvetica", isCurrent ? "bold" : "normal")
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
    doc.text(ss, margin + str1 + 2, y + 5)

    y += strRowH
  }
  y += 7

  // ── Advisor Override ──────────────────────────────────────────
  if (y + 44 > pageH - 18) {
    doc.addPage()
    addPageHeader(doc, pageW, margin, logo)
    addWatermark(doc, pageW, pageH, logo)
    y = 20
  }

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.text("Advisor Override (if needed)", margin, y)
  y += 5

  const overrideBoxH = advisorOverride === true && advisorOverrideReason ? 44 : 36

  doc.setFillColor(250, 250, 252)
  doc.setDrawColor(LGRAY[0], LGRAY[1], LGRAY[2])
  doc.setLineWidth(0.3)
  doc.rect(margin, y, contentW, overrideBoxH, "FD")

  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  const overrideDesc = doc.splitTextToSize(
    "If your GoldKach advisor believes a different risk profile is more appropriate than your calculated score, they will complete this section and explain why. Any change like this is reviewed under GoldKach Uganda Limited's suitability policy.",
    contentW - 6
  )
  doc.text(overrideDesc, margin + 3, y + 5)
  const overY = y + overrideDesc.length * 4 + 5

  const noChange = advisorOverride !== true
  const changeApplied = advisorOverride === true

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  drawCheckbox(doc, margin + 3, overY + 1, noChange)
  doc.text("No change — we'll use your calculated profile.", margin + 8, overY + 1)
  drawCheckbox(doc, margin + 3 + 84, overY + 1, changeApplied)
  doc.text("Change applied (advisor completes below).", margin + 8 + 84, overY + 1)

  const lineY = overY + 9
  doc.setFont("helvetica", "bold")
  doc.text("Adjusted Risk Profile:", margin + 3, lineY)
  doc.setDrawColor(120, 120, 120)
  doc.setLineWidth(0.4)
  doc.line(margin + 46, lineY + 1, margin + 105, lineY + 1)
  if (changeApplied && advisorOverrideProfile) {
    doc.setFont("helvetica", "normal")
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2])
    doc.text(advisorOverrideProfile, margin + 47, lineY)
    doc.setTextColor(DARK[0], DARK[1], DARK[2])
  }

  const lineY2 = lineY + 8
  doc.setFont("helvetica", "bold")
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  doc.text("Reason for the change:", margin + 3, lineY2)
  doc.setDrawColor(120, 120, 120)
  doc.setLineWidth(0.4)
  doc.line(margin + 46, lineY2 + 1, margin + contentW - 3, lineY2 + 1)
  if (changeApplied && advisorOverrideReason) {
    doc.setFont("helvetica", "normal")
    const rLines = doc.splitTextToSize(advisorOverrideReason, contentW - 52)
    doc.text(rLines[0], margin + 47, lineY2)
    if (rLines.length > 1) {
      doc.line(margin + 3, lineY2 + 9, margin + contentW - 3, lineY2 + 9 + 1)
      doc.text(rLines[1], margin + 3, lineY2 + 9)
    }
  }

  y += overrideBoxH + 7

  // ── Confirmation ──────────────────────────────────────────────
  if (y + 38 > pageH - 18) {
    doc.addPage()
    addPageHeader(doc, pageW, margin, logo)
    addWatermark(doc, pageW, pageH, logo)
    y = 20
  }
  y += 2

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(SKYBLUE[0], SKYBLUE[1], SKYBLUE[2])
  doc.text("Confirmation", margin, y)
  y += 5

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  const confirmLines = doc.splitTextToSize(
    "I understand that investment returns are not guaranteed, and that the value of my investment can go up or down. " +
    "I confirm that the answers I've given above are accurate and complete to the best of my knowledge. " +
    "I understand that GoldKach Uganda Limited will use my risk profile to help decide what investments are suitable for me.",
    contentW
  )
  doc.text(confirmLines, margin, y)
  y += confirmLines.length * 5 + 4

  drawCheckbox(doc, margin, y + 1, true)
  doc.text(
    "I agree that GoldKach Uganda Limited can keep this questionnaire on file, as required by regulators.",
    margin + 5, y + 1
  )
  y += 9

  doc.setFontSize(7.5)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  const closeLines = doc.splitTextToSize(
    "This questionnaire is designed to be easy for everyday investors to complete in 5–10 minutes. " +
    "Your risk profile should be reviewed at least once a year, or any time your finances, goals, or comfort with risk change significantly.",
    contentW
  )
  doc.text(closeLines, margin, y)

  // ── Footers on every page ─────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    addPageFooter(doc, pageW, pageH, margin, p, totalPages)
  }

  doc.save(`GoldKach_Investor_Risk_Questionnaire_${clientName.replace(/\s+/g, "_")}.pdf`)
}
