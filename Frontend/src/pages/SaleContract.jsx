/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";
import {
  archiveContract,
  confirmContract,
  createContract,
  updateContract,
} from "../api/contractsApi";
import { saleContractToPdfFile } from "../utils/contractPdfArchive";
import { tryUploadContractArchive } from "../utils/contractAttachmentUpload";

const GENERIC_ERROR_MSG = "تعذر إتمام العملية. حاول مرة أخرى.";

const todayIso = () => new Date().toISOString().slice(0, 10);

const INITIAL_SALE_FORM = {
  partyOneSeller: "",
  sellerCity: "",
  sellerProfession: "",
  partyTwoBuyer: "",
  buyerCity: "",
  buyerProfession: "",
  propertyType: "",
  propertyNumber: "",
  mahala: "",
  agreedPrice: "",
  depositPaid: "",
  remainingAmount: "",
  sellerPenalty: "",
  buyerPenalty: "",
  feesOnParty: "",
  taxFeesOnParty: "",
  brokerFeePercent: "",
  contractYear: "",
  extraClauses: "",
};

function clearSaleContractLocalDraft() {
  localStorage.removeItem("saleContractDraft");
  localStorage.removeItem("saleContractStatus");
  localStorage.removeItem("saleContractId");
}

/** Inline underline input — defined at module scope to prevent remount on every render. */
function B({ name, size = "md", value, onChange }) {
  return (
    <input
      className={`sc-blank sc-blank--${size}`}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      dir="rtl"
      inputMode="text"
    />
  );
}

export default function SaleContract() {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({ ...INITIAL_SALE_FORM }));

  const [status, setStatus] = useState("مسودة");
  const [savedContractId, setSavedContractId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });
  const showToast = (message, variant = "success") => {
    setToast({ open: true, message, variant });
  };

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    clearSaleContractLocalDraft();
  }, []);

  const getContractIdFromResponse = (response) =>
    response?.id || response?.contract?.id || response?.data?.id || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildSaleContractPayload = (payloadForm = form) => ({
    sellerName: payloadForm.partyOneSeller.trim(),
    buyerName: payloadForm.partyTwoBuyer.trim(),
    type: "عقد بيع",
    contractDate: payloadForm.contractYear || undefined,
    details: { ...payloadForm },
  });

  const ensureArchived = async (contractId) => {
    if (!contractId) return false;
    try {
      await archiveContract(contractId);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveDraft = async () => {
    closeToast();
    const resolvedForm = { ...form, contractYear: form.contractYear.trim() || todayIso() };
    setForm(resolvedForm);
    localStorage.setItem("saleContractDraft", JSON.stringify(resolvedForm));
    localStorage.setItem("saleContractStatus", "مسودة");
    try {
      const created = await createContract(buildSaleContractPayload(resolvedForm));
      const contractId = getContractIdFromResponse(created);
      if (contractId) {
        setSavedContractId(contractId);
        localStorage.setItem("saleContractId", String(contractId));
      }
      const archivedOk = await ensureArchived(contractId);
      setStatus("مسودة");
      let uploadResult = "none";
      try {
        const docFile = await saleContractToPdfFile(resolvedForm, contractId, "مسودة");
        uploadResult = await tryUploadContractArchive(docFile, contractId);
      } catch {
        uploadResult = "fail";
      }
      if (uploadResult === "ok") {
        showToast(
          archivedOk
            ? "تم حفظ المسودة، أرشفة العقد، وتخزين نسخة PDF بنجاح"
            : "تم حفظ المسودة وتخزين نسخة PDF، لكن تعذرت الأرشفة",
          archivedOk ? "success" : "error",
        );
      } else if (uploadResult === "fail") {
        showToast(
          archivedOk
            ? "تم حفظ المسودة وأرشفة العقد. تعذر تخزين ملف PDF."
            : "تم حفظ المسودة. تعذرت الأرشفة وتخزين ملف PDF.",
          "error",
        );
      } else {
        showToast(
          archivedOk
            ? "تم حفظ المسودة وأرشفة العقد بنجاح"
            : "تم حفظ المسودة، لكن تعذرت الأرشفة",
          archivedOk ? "success" : "error",
        );
      }
      setForm({ ...INITIAL_SALE_FORM });
      setSavedContractId(null);
      clearSaleContractLocalDraft();
    } catch {
      showToast(GENERIC_ERROR_MSG, "error");
      setStatus("مسودة");
    }
  };

  const handleConfirm = async () => {
    closeToast();
    const resolvedForm = { ...form, contractYear: form.contractYear.trim() || todayIso() };
    setForm(resolvedForm);
    localStorage.setItem("saleContractDraft", JSON.stringify(resolvedForm));
    localStorage.setItem("saleContractStatus", "مؤكد");
    try {
      let contractId = savedContractId;

      if (!contractId) {
        const created = await createContract(buildSaleContractPayload(resolvedForm));
        contractId = getContractIdFromResponse(created);
      } else {
        await updateContract(contractId, buildSaleContractPayload(resolvedForm));
      }

      if (contractId) {
        await confirmContract(contractId);
        setSavedContractId(contractId);
        localStorage.setItem("saleContractId", String(contractId));
      }
      const archivedOk = await ensureArchived(contractId);

      setStatus("مسودة");
      let uploadResult = "none";
      try {
        const docFile = await saleContractToPdfFile(resolvedForm, contractId, "مؤكد");
        uploadResult = await tryUploadContractArchive(docFile, contractId);
      } catch {
        uploadResult = "fail";
      }
      if (uploadResult === "ok") {
        showToast(
          archivedOk
            ? "تم تأكيد العقد، أرشفته، وتخزين نسخة PDF بنجاح"
            : "تم تأكيد العقد وتخزين نسخة PDF، لكن تعذرت الأرشفة",
          archivedOk ? "success" : "error",
        );
      } else if (uploadResult === "fail") {
        showToast(
          archivedOk
            ? "تم تأكيد العقد وأرشفته. تعذر تخزين ملف PDF."
            : "تم تأكيد العقد. تعذرت الأرشفة وتخزين ملف PDF.",
          "error",
        );
      } else {
        showToast(
          archivedOk
            ? "تم تأكيد العقد وأرشفته بنجاح"
            : "تم تأكيد العقد، لكن تعذرت الأرشفة",
          archivedOk ? "success" : "error",
        );
      }
      setForm({ ...INITIAL_SALE_FORM });
      setSavedContractId(null);
      clearSaleContractLocalDraft();
    } catch {
      showToast(GENERIC_ERROR_MSG, "error");
      setStatus("مؤكد");
    }
  };

  const handleGoToPrint = () => {
    const resolvedForm = { ...form, contractYear: form.contractYear.trim() || todayIso() };
    setForm(resolvedForm);
    localStorage.setItem("saleContractDraft", JSON.stringify(resolvedForm));
    localStorage.setItem("saleContractStatus", status);
    navigate("/sale-contract/print");
  };

  return (
    <div className="sc-page">

      {/* مباني يسار */}
      <svg className="db-buildings db-buildings--left" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="20" y="60" width="38" height="460" rx="3" fill="rgba(200,169,126,0.13)"/>
        <rect x="24" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="34" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="44" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="24" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="34" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.30)"/>
        <rect x="44" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="24" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="34" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.15)"/>
        <rect x="44" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="24" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="34" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="44" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="24" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="34" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.15)"/>
        <rect x="44" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <line x1="39" y1="60" x2="39" y2="20" stroke="rgba(200,169,126,0.30)" strokeWidth="2"/>
        <line x1="34" y1="35" x2="44" y2="35" stroke="rgba(200,169,126,0.25)" strokeWidth="1.5"/>
        <rect x="70" y="140" width="72" height="380" rx="4" fill="rgba(200,169,126,0.16)"/>
        <rect x="82" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.30)"/>
        <rect x="98" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="114" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.30)"/>
        <rect x="82" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="98" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.35)"/>
        <rect x="114" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="82" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="98" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="114" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <polygon points="106,110 70,140 142,140" fill="rgba(200,169,126,0.18)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(200,169,126,0.32)" strokeWidth="2.5"/>
        <rect x="155" y="260" width="50" height="260" rx="3" fill="rgba(200,169,126,0.12)"/>
        <rect x="162" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="175" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="188" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.25)"/>
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(200,169,126,0.10)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(200,169,126,0.13)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(200,169,126,0.12)"/>
        <ellipse cx="290" cy="460" rx="14" ry="20" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="290" cy="443" rx="10" ry="16" fill="rgba(200,169,126,0.12)"/>
        <rect x="288" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      {/* مباني يمين */}
      <svg className="db-buildings db-buildings--right" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="282" y="80" width="40" height="440" rx="3" fill="rgba(200,169,126,0.12)"/>
        <rect x="287" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="297" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.30)"/>
        <rect x="307" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="287" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="297" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="307" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <line x1="302" y1="80" x2="302" y2="40" stroke="rgba(200,169,126,0.28)" strokeWidth="2"/>
        <line x1="295" y1="58" x2="309" y2="58" stroke="rgba(200,169,126,0.22)" strokeWidth="1.5"/>
        <rect x="198" y="150" width="76" height="370" rx="4" fill="rgba(200,169,126,0.15)"/>
        <rect x="208" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="225" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="242" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="259" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="208" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="225" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.32)"/>
        <rect x="242" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="259" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.25)"/>
        <polygon points="236,115 198,150 274,150" fill="rgba(200,169,126,0.17)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(200,169,126,0.30)" strokeWidth="2.5"/>
        <rect x="130" y="280" width="54" height="240" rx="3" fill="rgba(200,169,126,0.11)"/>
        <rect x="138" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="152" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.16)"/>
        <rect x="166" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.22)"/>
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(200,169,126,0.12)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(200,169,126,0.11)"/>
        <ellipse cx="42" cy="462" rx="13" ry="18" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="42" cy="447" rx="9" ry="14" fill="rgba(200,169,126,0.11)"/>
        <rect x="40" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      <div className="sc-inner">
        <div className="sc-contract-doc" dir="rtl">

          {/* ── شريط الأدوات ── */}
          <div className="sc-contract-toolbar" dir="rtl">
            <div className="sc-toolbar-start">
              <button
                type="button"
                className="sc-toolbar-back"
                onClick={() => navigate("/dashboard")}
                aria-label="رجوع"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                  <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                رجوع
              </button>
              <h1 className="sc-toolbar-contract-type">عقد بيع</h1>
            </div>
            <div className="sc-toolbar-actions">
              <button type="button" className="sc-tbtn sc-tbtn--ghost" onClick={handleSaveDraft}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2h9l3 3v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M11 2v4H4V2M5 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                حفظ كمسودة
              </button>
              <button type="button" className="sc-tbtn sc-tbtn--ghost" onClick={handleConfirm}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                تأكيد العقد
              </button>
              <button type="button" className="sc-tbtn sc-tbtn--primary" onClick={handleGoToPrint}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                طباعة
              </button>
            </div>
            <span className={`sc-status-badge ${status === "مؤكد" ? "sc-status-badge--confirmed" : ""}`}>
              {status}
            </span>
            <ThemeToggle />
          </div>
          <Toast
            open={toast.open}
            message={toast.message}
            variant={toast.variant}
            onClose={closeToast}
          />

          {/* ── محتوى العقد ── */}
          <div className="sc-contract-doc-body">

            {/* الفريقين — شبكة أعمدة متساوية بين الصفين */}
            <div className="sc-doc-clause sc-doc-clause--parties">
              <div className="sc-party-grid" role="group" aria-label="بيانات الفريقين للعقد">
                <strong className="sc-party-col-label">الفريق الأول البائع السيد:</strong>
                <div className="sc-party-col-input">
                  <B name="partyOneSeller" size="lg" value={form.partyOneSeller} onChange={handleChange} />
                </div>
                <div className="sc-party-field-group">
                  <span className="sc-party-mini-label">الساكن:</span>
                  <B name="sellerCity" size="md" value={form.sellerCity} onChange={handleChange} />
                </div>
                <div className="sc-party-field-group">
                  <span className="sc-party-mini-label">رقم الهاتف:</span>
                  <B name="sellerProfession" size="md" value={form.sellerProfession} onChange={handleChange} />
                </div>

                <strong className="sc-party-col-label">الفريق الثاني المشتري السيد:</strong>
                <div className="sc-party-col-input">
                  <B name="partyTwoBuyer" size="lg" value={form.partyTwoBuyer} onChange={handleChange} />
                </div>
                <div className="sc-party-field-group">
                  <span className="sc-party-mini-label">الساكن:</span>
                  <B name="buyerCity" size="md" value={form.buyerCity} onChange={handleChange} />
                </div>
                <div className="sc-party-field-group">
                  <span className="sc-party-mini-label">رقم الهاتف:</span>
                  <B name="buyerProfession" size="md" value={form.buyerProfession} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="sc-doc-divider" />

            <p className="sc-doc-para">
              لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :
            </p>

            {/* أولاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">أولاً :</span>{" "}
                يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل في فيما يلي :
              </p>
              <div className="sc-field-rows" dir="rtl" role="group" aria-label="بيانات الملك">
                <span className="sc-field-grid__label">نوع الملك</span>
                <div className="sc-field-grid__input">
                  <B name="propertyType" size="md" value={form.propertyType} onChange={handleChange} />
                </div>
                <span className="sc-field-grid__label">الرقم والتسلسل</span>
                <div className="sc-field-grid__input">
                  <B name="propertyNumber" size="md" value={form.propertyNumber} onChange={handleChange} />
                </div>
                <span className="sc-field-grid__label">المحلة</span>
                <div className="sc-field-grid__input">
                  <B name="mahala" size="md" value={form.mahala} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ثانياً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">ثانياً :</span>{" "}
                ان بدل البيع المتفق عليه هو{" "}
                <B name="agreedPrice" size="lg" value={form.agreedPrice} onChange={handleChange} />
              </p>
              <p className="sc-doc-para">
                ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره{" "}
                <B name="depositPaid" size="md" value={form.depositPaid} onChange={handleChange} />
              </p>
              <p className="sc-doc-para">
                والباقي{" "}
                <B name="remainingAmount" size="md" value={form.remainingAmount} onChange={handleChange} />
              </p>
              <p className="sc-doc-para">
                واما البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،
              </p>
            </div>

            {/* ثالثاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">ثالثاً :</span>{" "}
                اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزما بأعادة
                العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدره{" "}
                <B name="sellerPenalty" size="md" value={form.sellerPenalty} onChange={handleChange} />
                {" "}ديناراً بدون حاجة الى إنذار رسمي
              </p>
            </div>

            {/* رابعاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">رابعاً :</span>{" "}
                يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
                بتأدية قصور البدل المبيع الى الفريق الأول عند اكماله المعامله والتقرير
                في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
                يتعهد بتأدية تضمينات قدرها{" "}
                <B name="buyerPenalty" size="md" value={form.buyerPenalty} onChange={handleChange} />
                {" "}ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون
              </p>
            </div>

            {/* خامساً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">خامساً :</span>{" "}
                يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء
              </p>
            </div>

            {/* سادساً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">سادساً :</span>{" "}
                ان جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق{" "}
                <B name="feesOnParty" size="md" value={form.feesOnParty} onChange={handleChange} />
              </p>
            </div>

            {/* سابعاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">سابعاً :</span>{" "}
                اما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
                هي في عهدة الفريق{" "}
                <B name="taxFeesOnParty" size="md" value={form.taxFeesOnParty} onChange={handleChange} />
              </p>
            </div>

            {/* ثامناً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">ثامناً :</span>{" "}
                يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ({" "}
                <B name="brokerFeePercent" size="xs" value={form.brokerFeePercent} onChange={handleChange} />
                {" "}% ) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه
                المقاولة. واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية
                ضعفي الدلالة المذكورة اعلاه كما انه في حالة تراضي بين الفريقين وقوع
                تراضي على ابطال هذا العقد فأنهما يكونان ملزمين بتأديتهما الدلاليه
                المذكورة مهما بلغت.
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* الخاتمة */}
            <p className="sc-doc-closing">
              فبناء على حصول التراضي والايجاب والقبول حرر هذا العقد.
            </p>

            <p className="sc-doc-para">
              البصرة في تاريخ{" "}
              <input
                type="date"
                className="sc-blank sc-blank--date"
                name="contractYear"
                value={form.contractYear}
                onChange={handleChange}
                dir="ltr"
              />
            </p>

            {/* ملاحظات إضافية — قبل التواقيع كما في النموذج الورقي */}
            <div className="sc-doc-divider" />
            <div className="sc-doc-clause sc-doc-clause--extra">
              <h3 className="sc-doc-clause-title">ملاحظات إضافية</h3>
              <textarea
                className="sc-blank-area"
                name="extraClauses"
                value={form.extraClauses}
                onChange={handleChange}
                rows={4}
                dir="rtl"
                placeholder="ملاحظات إضافية..."
              />
            </div>

            {/* التواقيع — مساحة فارغة بدل SignaturePad (مكوّن ../components/SignaturePad) */}
            <div className="sc-doc-sigs" style={{ marginTop: "28px" }}>
              <div className="sc-doc-sig-col">
                <p className="sc-doc-sig-role">الفريق الأول</p>
                <div className="sc-doc-sig-block">
                  <div className="sc-signature-placeholder" aria-label="مكان التوقيع" />
                </div>
              </div>
              <div className="sc-doc-sig-divider" />
              <div className="sc-doc-sig-col">
                <p className="sc-doc-sig-role">الفريق الثاني</p>
                <div className="sc-doc-sig-block">
                  <div className="sc-signature-placeholder" aria-label="مكان التوقيع" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
