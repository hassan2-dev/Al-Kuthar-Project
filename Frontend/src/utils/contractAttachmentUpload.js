import { uploadDocument } from "../api/documentsApi";

/** يرفع ملفاً مُنشأاً من العقد (مثلاً HTML) ويربطه بـ contractId */
export async function tryUploadContractArchive(file, contractId) {
  if (!file || !contractId) return "none";
  try {
    await uploadDocument(file, { contractId });
    return "ok";
  } catch {
    return "fail";
  }
}
