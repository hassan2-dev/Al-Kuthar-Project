const SALE_REQUIRED_KEYS = [
  "partyOneSeller",
  "sellerCity",
  "sellerProfession",
  "partyTwoBuyer",
  "buyerCity",
  "buyerProfession",
  "propertyType",
  "propertyNumber",
  "mahala",
  "agreedPrice",
  "depositPaid",
  "remainingAmount",
  "sellerPenalty",
  "buyerPenalty",
  "feesOnParty",
  "brokerFeePercent",
  "contractYear",
  "extraClauses",
];

const RENT_REQUIRED_KEYS = [
  "propertySerial",
  "contractDate",
  "propertyType",
  "rentFromDate",
  "rentToDate",
  "rentAmount",
  "paymentPeriod",
  "landlordName",
  "tenantName",
  "tenantFullName",
  "tenantAddress",
  "tenantPhone",
  "tenantIdNumber",
  "landlordFullName",
  "landlordAddress",
  "landlordPhone",
  "landlordIdNumber",
  "extraClauses",
];

export const SALE_FORM_INCOMPLETE_MSG =
  "يرجى تعبئة جميع حقول عقد البيع قبل الحفظ أو التأكيد.";

export const RENT_FORM_INCOMPLETE_MSG =
  "يرجى تعبئة جميع حقول عقد الإيجار قبل الحفظ أو التأكيد.";

export function isSaleContractFormComplete(form) {
  return SALE_REQUIRED_KEYS.every((key) => String(form[key] ?? "").trim() !== "");
}

export function isRentContractFormComplete(form) {
  return RENT_REQUIRED_KEYS.every((key) => String(form[key] ?? "").trim() !== "");
}
