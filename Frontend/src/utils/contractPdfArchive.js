import { buildRentContractArchiveHtml, buildSaleContractArchiveHtml } from "./buildContractDocumentFile";
import { htmlDocumentStringToPdfFile } from "./contractHtmlToPdf";

function pdfFilename(prefix, contractId, docStatus) {
  const safeId = String(contractId ?? "unknown").replace(/[^\w-]/g, "") || "unknown";
  const tag = docStatus === "مؤكد" ? "مؤكد" : "مسودة";
  return `${prefix}-${safeId}-${tag}.pdf`;
}

export async function saleContractToPdfFile(form, contractId, docStatus) {
  const html = buildSaleContractArchiveHtml(form, contractId, docStatus);
  return htmlDocumentStringToPdfFile(html, pdfFilename("عقد-بيع", contractId, docStatus));
}

export async function rentContractToPdfFile(form, contractId, docStatus) {
  const html = buildRentContractArchiveHtml(form, contractId, docStatus);
  return htmlDocumentStringToPdfFile(html, pdfFilename("عقد-إيجار", contractId, docStatus));
}
