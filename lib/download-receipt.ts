/**
 * Generates and downloads a PDF from a DOM element that uses only inline styles.
 *
 * html2canvas v1.x does not support oklch() CSS colors (used by Tailwind v3.3+).
 * To avoid that, we clone the element's HTML into a sandboxed iframe that has
 * NO external stylesheets — so html2canvas only sees the inline styles on the
 * receipt itself, which are plain hex/rgb values.
 */
export async function downloadReceiptPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const { default: jsPDF }       = await import("jspdf")
  const { default: html2canvas } = await import("html2canvas")

  // 1. Create an isolated iframe with no stylesheets
  const iframe = document.createElement("iframe")
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:700px;height:1200px;border:none;visibility:hidden;"
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument!
  doc.open()
  doc.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>` +
    `<body style="margin:0;padding:0;background:#fff;">${element.outerHTML}</body></html>`
  )
  doc.close()

  // 2. Wait for images inside the iframe to load
  const images = Array.from(doc.querySelectorAll("img"))
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) { resolve(); return }
          img.onload  = () => resolve()
          img.onerror = () => resolve() // don't block on broken images
        })
    )
  )

  // 3. Capture with html2canvas — no oklch in scope
  const target = doc.body.firstElementChild as HTMLElement ?? doc.body
  const canvas = await html2canvas(target, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 700,
  })

  document.body.removeChild(iframe)

  // 4. Build PDF
  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
  })
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
  pdf.save(filename)
}
