import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * يحوّل مستند HTML كامل (سلسلة) إلى ملف PDF عبر iframe خفي + html2canvas + jsPDF.
 */
export async function htmlDocumentStringToPdfFile(htmlString, filename) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;min-height:3200px;border:0;opacity:0;pointer-events:none;overflow:visible";
  document.body.appendChild(iframe);

  const idoc = iframe.contentDocument;
  idoc.open();
  idoc.write(htmlString);
  idoc.close();

  await new Promise((resolve) => {
    if (iframe.contentDocument.readyState === "complete") resolve();
    else iframe.onload = () => resolve();
  });

  await Promise.all([
    document.fonts.ready.catch(() => {}),
    idoc.fonts?.ready?.catch?.(() => {}) ?? Promise.resolve(),
  ]);
  // Wait for Arabic fonts to fully render (Google Fonts needs extra time in iframe)
  await new Promise((r) => setTimeout(r, 1200));

  const body = idoc.body;
  body.style.background = "#ffffff";

  const canvas = await html2canvas(body, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    windowWidth: Math.max(body.scrollWidth, 794),
    windowHeight: body.scrollHeight,
    onclone: (clonedDoc) => {
      const b = clonedDoc.body;
      if (b) {
        b.style.background = "#ffffff";
        b.style.color = "#1a1a1a";
      }
    },
  });

  document.body.removeChild(iframe);

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  // Scale to fit the full content on exactly one A4 page
  const naturalW = pageW;
  const naturalH = (canvas.height * naturalW) / canvas.width;
  const scale = naturalH > pageH ? pageH / naturalH : 1;
  const drawW = naturalW * scale;
  const drawH = naturalH * scale;
  const offsetX = (pageW - drawW) / 2;
  const offsetY = (pageH - drawH) / 2;

  pdf.addImage(imgData, "JPEG", offsetX, offsetY, drawW, drawH);

  const blob = pdf.output("blob");
  return new File([blob], filename, { type: "application/pdf" });
}
