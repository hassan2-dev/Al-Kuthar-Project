import { buildRentContractArchiveHtml, buildSaleContractArchiveHtml } from "./buildContractDocumentFile";
import { htmlDocumentStringToPdfFile } from "./contractHtmlToPdf";

function sanitizeFilenamePart(value) {
  return String(value ?? "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    || "—";
}

export function buildContractPdfFilename(typeLabel, contractNumber, partyOne, partyTwo) {
  return `${sanitizeFilenamePart(typeLabel)} - ${sanitizeFilenamePart(contractNumber)} - ${sanitizeFilenamePart(partyOne)} - ${sanitizeFilenamePart(partyTwo)}.pdf`;
}

function legacyPdfFilename(prefix, contractId, docStatus) {
  const safeId = String(contractId ?? "unknown").replace(/[^\w-]/g, "") || "unknown";
  const tag = docStatus === "مؤكد" ? "مؤكد" : "مسودة";
  return `${prefix}-${safeId}-${tag}.pdf`;
}

export async function saleContractToPdfFile(form, contractId, docStatus, contractNumber) {
  const html = buildSaleContractArchiveHtml(form, contractId, docStatus);
  const filename = contractNumber
    ? buildContractPdfFilename(
        "عقد بيع",
        contractNumber,
        form.partyOneSeller || form.sellerName,
        form.partyTwoBuyer || form.buyerName,
      )
    : legacyPdfFilename("عقد-بيع", contractId, docStatus);
  return htmlDocumentStringToPdfFile(html, filename);
}

export async function rentContractToPdfFile(form, contractId, docStatus, contractNumber) {
  const html = buildRentContractArchiveHtml(form, contractId, docStatus);
  const landlord = form.landlordName || form.landlordFullName || form.sellerName;
  const tenant = form.tenantName || form.tenantFullName || form.buyerName;
  const filename = contractNumber
    ? buildContractPdfFilename("عقد إيجار", contractNumber, landlord, tenant)
    : legacyPdfFilename("عقد-إيجار", contractId, docStatus);
  return htmlDocumentStringToPdfFile(html, filename);
}
