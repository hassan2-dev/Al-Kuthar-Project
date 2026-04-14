/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";
import { confirmContract, createContract, updateContract } from "../api/contractsApi";
import {
  isRentContractFormComplete,
  RENT_FORM_INCOMPLETE_MSG,
} from "../utils/contractFormValidation";
import { rentContractToPdfFile } from "../utils/contractPdfArchive";
import { tryUploadContractArchive } from "../utils/contractAttachmentUpload";

const GENERIC_ERROR_MSG = "تعذر إتمام العملية. حاول مرة أخرى.";

const INITIAL_RENT_FORM = {
  propertySerial: "",
  contractDate: "",
  propertyType: "",
  rentFromDate: "",
  rentToDate: "",
  rentAmount: "",
  paymentPeriod: "",
  landlordName: "",
  tenantName: "",
  tenantFullName: "",
  tenantAddress: "",
  tenantPhone: "",
  tenantIdNumber: "",
  landlordFullName: "",
  landlordAddress: "",
  landlordPhone: "",
  landlordIdNumber: "",
  extraClauses: "",
};

function clearRentContractLocalDraft() {
  localStorage.removeItem("rentContractDraft");
  localStorage.removeItem("rentContractStatus");
  localStorage.removeItem("rentContractId");
}

/** Inline underline input — module scope to prevent remount. */
function B({ name, size = "md", value, onChange, type = "text" }) {
  const isDate = type === "date";
  return (
    <input
      className={`sc-blank sc-blank--${size}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      dir={isDate ? "ltr" : "rtl"}
      {...(isDate ? {} : { inputMode: "text" })}
    />
  );
}

export default function RentContract() {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({ ...INITIAL_RENT_FORM }));

  const [status, setStatus] = useState("مسودة");
  const [savedContractId, setSavedContractId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });

  const showToast = (message, variant = "success") => {
    setToast({ open: true, message, variant });
  };

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    const savedForm = localStorage.getItem("rentContractDraft");
    const savedStatus = localStorage.getItem("rentContractStatus");
    if (savedForm) {
      try { setForm(JSON.parse(savedForm)); } catch { /* ignore */ }
    }
    if (savedStatus) setStatus(savedStatus);
    const storedContractId = localStorage.getItem("rentContractId");
    if (storedContractId) setSavedContractId(storedContractId);
  }, []);

  const getContractIdFromResponse = (response) =>
    response?.id || response?.contract?.id || response?.data?.id || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildRentContractPayload = () => {
    const landlord = (form.landlordName || form.landlordFullName).trim();
    const tenant = (form.tenantName || form.tenantFullName).trim();
    return {
      sellerName: landlord,
      buyerName: tenant,
      type: "عقد إيجار",
      contractDate: form.contractDate || undefined,
      details: { ...form },
    };
  };

  const handleSaveDraft = async () => {
    closeToast();
    if (!isRentContractFormComplete(form)) {
      showToast(RENT_FORM_INCOMPLETE_MSG, "error");
      return;
    }
    localStorage.setItem("rentContractDraft", JSON.stringify(form));
    localStorage.setItem("rentContractStatus", "مسودة");
    try {
      const created = await createContract(buildRentContractPayload());
      const contractId = getContractIdFromResponse(created);
      if (contractId) {
        setSavedContractId(contractId);
        localStorage.setItem("rentContractId", String(contractId));
      }
      setStatus("مسودة");
      let uploadResult = "none";
      try {
        const docFile = await rentContractToPdfFile(form, contractId, "مسودة");
        uploadResult = await tryUploadContractArchive(docFile, contractId);
      } catch {
        uploadResult = "fail";
      }
      if (uploadResult === "ok") {
        showToast("تم حفظ المسودة وتخزين نسخة PDF بنجاح", "success");
      } else if (uploadResult === "fail") {
        showToast("تم حفظ المسودة. تعذر تخزين ملف PDF.", "error");
      } else {
        showToast("تم حفظ المسودة بنجاح", "success");
      }
      setForm({ ...INITIAL_RENT_FORM });
      setSavedContractId(null);
      clearRentContractLocalDraft();
    } catch {
      showToast(GENERIC_ERROR_MSG, "error");
      setStatus("مسودة");
    }
  };

  const handleConfirm = async () => {
    closeToast();
    if (!isRentContractFormComplete(form)) {
      showToast(RENT_FORM_INCOMPLETE_MSG, "error");
      return;
    }
    localStorage.setItem("rentContractDraft", JSON.stringify(form));
    localStorage.setItem("rentContractStatus", "مؤكد");
    try {
      let contractId = savedContractId;

      if (!contractId) {
        const created = await createContract(buildRentContractPayload());
        contractId = getContractIdFromResponse(created);
      } else {
        await updateContract(contractId, buildRentContractPayload());
      }

      if (contractId) {
        await confirmContract(contractId);
        setSavedContractId(contractId);
        localStorage.setItem("rentContractId", String(contractId));
      }

      setStatus("مسودة");
      let uploadResult = "none";
      try {
        const docFile = await rentContractToPdfFile(form, contractId, "مؤكد");
        uploadResult = await tryUploadContractArchive(docFile, contractId);
      } catch {
        uploadResult = "fail";
      }
      if (uploadResult === "ok") {
        showToast("تم تأكيد العقد وتخزين نسخة PDF بنجاح", "success");
      } else if (uploadResult === "fail") {
        showToast("تم تأكيد العقد. تعذر تخزين ملف PDF.", "error");
      } else {
        showToast("تم تأكيد العقد بنجاح", "success");
      }
      setForm({ ...INITIAL_RENT_FORM });
      setSavedContractId(null);
      clearRentContractLocalDraft();
    } catch {
      showToast(GENERIC_ERROR_MSG, "error");
      setStatus("مؤكد");
    }
  };

  const handleGoToPrint = () => {
    localStorage.setItem("rentContractDraft", JSON.stringify(form));
    localStorage.setItem("rentContractStatus", status);
    navigate("/rent-contract/print");
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
              <h1 className="sc-toolbar-contract-type">عقد إيجار</h1>
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
              <button type="button" className="sc-tbtn sc-tbtn--gold" onClick={handleGoToPrint}>
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

            {/* ── معلومات العقد الأساسية (شبكة محاذاة) ── */}
            <div className="sc-doc-clause sc-doc-clause--parties">
              <div className="sc-rent-fields-grid">

                {/* تسلسل العقار */}
                <span className="sc-rent-field-label">تسلسل العقار :</span>
                <div className="sc-rent-field-value">
                  <B name="propertySerial" size="md" value={form.propertySerial} onChange={handleChange} />
                </div>

                {/* التاريخ */}
                <span className="sc-rent-field-label">التاريخ :</span>
                <div className="sc-rent-field-value">
                  <B type="date" name="contractDate" size="md" value={form.contractDate} onChange={handleChange} />
                </div>

                {/* نوع المأجور */}
                <span className="sc-rent-field-label">نوع المأجور :</span>
                <div className="sc-rent-field-value">
                  <B name="propertyType" size="lg" value={form.propertyType} onChange={handleChange} />
                </div>

                {/* مدة الإيجار */}
                <span className="sc-rent-field-label">مدة الإيجار :</span>
                <div className="sc-rent-field-value sc-rent-field-value--inline">
                  <span className="sc-rent-sub-label">من</span>
                  <B type="date" name="rentFromDate" size="md" value={form.rentFromDate} onChange={handleChange} />
                  <span className="sc-rent-sub-label">لغاية</span>
                  <B type="date" name="rentToDate" size="md" value={form.rentToDate} onChange={handleChange} />
                </div>

                {/* بدل الإيجار */}
                <span className="sc-rent-field-label">بدل الإيجار :</span>
                <div className="sc-rent-field-value sc-rent-field-value--inline">
                  <B name="rentAmount" size="lg" value={form.rentAmount} onChange={handleChange} />
                  <span className="sc-rent-sub-label">فقط</span>
                </div>

                {/* يدفع مقدماً كل */}
                <span className="sc-rent-field-label">يدفع مقدماً كل :</span>
                <div className="sc-rent-field-value">
                  <B name="paymentPeriod" size="md" value={form.paymentPeriod} onChange={handleChange} />
                </div>

                {/* تم التعاقد بين */}
                <span className="sc-rent-field-label">تم التعاقد بين :</span>
                <div className="sc-rent-field-value">
                  <span className="sc-rent-sub-label">المدعو بالمؤجر :</span>
                  <B name="landlordName" size="lg" value={form.landlordName} onChange={handleChange} />
                </div>

                {/* وبين */}
                <span className="sc-rent-field-label">وبين :</span>
                <div className="sc-rent-field-value">
                  <span className="sc-rent-sub-label">المدعو بالمستأجر :</span>
                  <B name="tenantName" size="lg" value={form.tenantName} onChange={handleChange} />
                </div>

              </div>
            </div>

            <div className="sc-doc-divider" />

            <p className="sc-doc-para sc-doc-para--bold">
              واتفقا على ما يأتي :
            </p>

            {/* أولاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">أولاً :</span>{" "}
                لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة اعلانه او يغير شيئاً من المأجور
                دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن
                يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.
              </p>
            </div>

            {/* ثانياً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">ثانياً :</span>{" "}
                اذا تأخر المستأجر عن دفع الاجرة المتفق عليها او قسط من اقساطها عند الاستحقاق
                واظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد
                هذا العقد باطلاً وملغياً وعلى المستأجر ترك الماجور واخلاءه حالا مراعاة لهذا
                الشرط ولا حاجة للإنذار رسمي.
              </p>
            </div>

            {/* ثالثاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">ثالثاً :</span>{" "}
                اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الايجار واشغله من
                دون مسوغ قانوني ومن دون ان يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على
                نفسه بتسليم الاجرة ضعف الايجار المذكور اعلاه للمدة التي تمضي بعد انتهاء مدة
                هذا العقد الى حين تخلية المأجور ولا حاجة للانذار الرسمي الى المستأجر بهذا
                الخصوص بل ان انقضاء المدة المعينة تعد بمقام الانذار ويعتبر انقضاء المدة بمقام
                الانذار ولا يسوغ للمستأجر أن يدافع عن نفسه بهذا الصدد بأن لم يسبق له الانذار
                أي الانذار القانوني.
              </p>
            </div>

            {/* رابعاً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">رابعاً :</span>{" "}
                تكون الضريبة على المؤجر اما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء
                والكهرباء فتكون على المستأجر.
              </p>
            </div>

            {/* خامساً */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-clause-num">خامساً :</span>{" "}
                لا يجوز للمستأجر تغير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله
                على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية
                الفورية.
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* فقرات إضافية */}
            <div className="sc-doc-clause sc-doc-clause--extra">
              <h3 className="sc-doc-clause-title">فقرات إضافية</h3>
              <textarea
                className="sc-blank-area"
                name="extraClauses"
                value={form.extraClauses}
                onChange={handleChange}
                rows={4}
                dir="rtl"
                placeholder="فقرات إضافية..."
              />
            </div>

            <div className="sc-doc-divider" />

            {/* بيانات الأطراف التفصيلية */}
            <div className="sc-rent-sig-section">

              <div className="sc-rent-sig-col">
                <h3 className="sc-rent-sig-title">المستأجر</h3>
                <div className="sc-rent-party-grid">
                  <span className="sc-rent-field-label">الاسم الكامل :</span>
                  <div className="sc-rent-field-value">
                    <B name="tenantFullName" size="lg" value={form.tenantFullName} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">عنوان المسكن الدائم :</span>
                  <div className="sc-rent-field-value">
                    <B name="tenantAddress" size="lg" value={form.tenantAddress} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">رقم الهاتف :</span>
                  <div className="sc-rent-field-value">
                    <B name="tenantPhone" size="md" value={form.tenantPhone} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">رقم وتاريخ الهوية :</span>
                  <div className="sc-rent-field-value">
                    <B name="tenantIdNumber" size="lg" value={form.tenantIdNumber} onChange={handleChange} />
                  </div>
                </div>
                <div className="sc-signature-placeholder" aria-label="مكان توقيع المستأجر" />
              </div>

              <div className="sc-rent-sig-divider" />

              <div className="sc-rent-sig-col">
                <h3 className="sc-rent-sig-title">المؤجر</h3>
                <div className="sc-rent-party-grid">
                  <span className="sc-rent-field-label">الاسم الكامل :</span>
                  <div className="sc-rent-field-value">
                    <B name="landlordFullName" size="lg" value={form.landlordFullName} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">عنوان المسكن الدائم :</span>
                  <div className="sc-rent-field-value">
                    <B name="landlordAddress" size="lg" value={form.landlordAddress} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">رقم الهاتف :</span>
                  <div className="sc-rent-field-value">
                    <B name="landlordPhone" size="md" value={form.landlordPhone} onChange={handleChange} />
                  </div>
                  <span className="sc-rent-field-label">رقم وتاريخ الهوية :</span>
                  <div className="sc-rent-field-value">
                    <B name="landlordIdNumber" size="lg" value={form.landlordIdNumber} onChange={handleChange} />
                  </div>
                </div>
                <div className="sc-signature-placeholder" aria-label="مكان توقيع المؤجر" />
              </div>

        </div>

          </div>
        </div>
      </div>
    </div>
  );
}
