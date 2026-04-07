import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignaturePad from "../components/SignaturePad";

/** Defined at module scope so React does not remount inputs on every parent re-render (fixes one-char-then-blur). */
function ContractBlank({ name, size = "md", type = "text", value, onChange }) {
  return (
    <input
      className={`sc-blank sc-blank--${size}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      dir="rtl"
      inputMode={type === "number" ? "numeric" : "text"}
    />
  );
}

export default function SaleContract() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    partyOneSeller: "",
    partyTwoBuyer: "",
    sellerAddress: "",
    buyerAddress: "",
    propertyType: "",
    propertyNumberSequence: "",
    mahala: "",
    agreedPrice: "",
    depositPaid: "",
    sellerPenalty: "",
    remainingAmount: "",
    buyerPenaltyPercent: "",
    feesOnParty: "",
    contractDay: "",
    contractMonth: "",
    contractYear: "",
    extraClause1: "",
    extraClause2: "",
    bottomName1: "",
    bottomName2: "",
    bottomAddress1: "",
    bottomAddress2: "",
    sellerSignature: "",
    buyerSignature: "",
    witness1: "",
    witness2: "",
  });

  const [status, setStatus] = useState("مسودة");

  useEffect(() => {
    const savedForm = localStorage.getItem("saleContractDraft");
    const savedStatus = localStorage.getItem("saleContractStatus");
    if (savedForm) setForm(JSON.parse(savedForm));
    if (savedStatus) setStatus(savedStatus);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignatureChange = useCallback((name, dataUrl) => {
    setForm((prev) => ({ ...prev, [name]: dataUrl }));
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
    localStorage.setItem("saleContractStatus", "مسودة");
    setStatus("مسودة");
  };

  const handleConfirm = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
    localStorage.setItem("saleContractStatus", "مؤكد");
    setStatus("مؤكد");
  };

  const handleGoToPrint = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
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

        {/* شريط العنوان */}
        <div className="sc-topbar">
          <button className="sc-back" onClick={() => navigate("/dashboard")} aria-label="رجوع">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
              <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>رجوع</span>
          </button>

          <div className="sc-topbar-center">
            <img src="/logo-icon.png" alt="الكوثر" className="sc-logo" />
            <h1 className="sc-title">عقد بيع</h1>
          </div>

          <span className={`sc-status-badge ${status === "مؤكد" ? "sc-status-badge--confirmed" : ""}`}>
            {status}
          </span>
        </div>

        {/* أزرار الإجراءات */}
        <div className="sc-actions">
          <button className="sc-btn sc-btn--ghost" onClick={handleSaveDraft}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h9l3 3v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M11 2v4H4V2M5 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            حفظ كمسودة
          </button>
          <button className="sc-btn sc-btn--ghost" onClick={handleConfirm}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            تأكيد العقد
          </button>
          <button className="sc-btn sc-btn--gold" onClick={handleGoToPrint}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            فتح صفحة الطباعة
          </button>
        </div>

        {/* وثيقة العقد */}
        <div className="sc-contract-doc" dir="rtl">

          {/* رأس الوثيقة */}
          <div className="sc-contract-doc-header">
            <p className="sc-bismillah">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <div className="sc-contract-doc-title-row">
              <div className="sc-contract-doc-ornament" />
              <h2 className="sc-contract-doc-title">عقد بيع</h2>
              <div className="sc-contract-doc-ornament" />
            </div>
          </div>

          <div className="sc-contract-doc-body">

            {/* أطراف العقد */}
            <div className="sc-doc-clause">
              <p className="sc-doc-para">
                <span className="sc-doc-label">الطرف الأول البائع:</span>
                {" "}السيد /{" "}
                <ContractBlank name="partyOneSeller" size="lg" value={form.partyOneSeller} onChange={handleChange} />
                {" "}المقيم في /{" "}
                <ContractBlank name="sellerAddress" size="lg" value={form.sellerAddress} onChange={handleChange} />
              </p>
              <p className="sc-doc-para">
                <span className="sc-doc-label">الطرف الثاني المشتري:</span>
                {" "}السيد /{" "}
                <ContractBlank name="partyTwoBuyer" size="lg" value={form.partyTwoBuyer} onChange={handleChange} />
                {" "}المقيم في /{" "}
                <ContractBlank name="buyerAddress" size="lg" value={form.buyerAddress} onChange={handleChange} />
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* أولاً — المبيع */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">أولاً — المبيع</h3>
              <p className="sc-doc-para">
                باع الطرف الأول إلى الطرف الثاني عقاره من نوع{" "}
                <ContractBlank name="propertyType" size="sm" value={form.propertyType} onChange={handleChange} />
                {" "}ذي الرقم والتسلسل{" "}
                <ContractBlank name="propertyNumberSequence" size="sm" value={form.propertyNumberSequence} onChange={handleChange} />
                {" "}الواقع في محلة{" "}
                <ContractBlank name="mahala" size="md" value={form.mahala} onChange={handleChange} />.
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* ثانياً — الثمن والالتزامات */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">ثانياً — الثمن والالتزامات المالية</h3>
              <p className="sc-doc-para">
                اتفق الطرفان على بدل البيع وقدره{" "}
                <ContractBlank name="agreedPrice" size="md" type="number" value={form.agreedPrice} onChange={handleChange} />
                {" "}دينار عراقي، وقد قبض البائع عربوناً مقداره{" "}
                <ContractBlank name="depositPaid" size="md" type="number" value={form.depositPaid} onChange={handleChange} />
                {" "}دينار. ويكون المبلغ المتبقي{" "}
                <ContractBlank name="remainingAmount" size="md" type="number" value={form.remainingAmount} onChange={handleChange} />
                {" "}دينار يُسدَّد عند إتمام إجراءات نقل الملكية الرسمية.
              </p>
              <p className="sc-doc-para">
                إذا نكل البائع عن تنفيذ هذا العقد يلتزم بدفع{" "}
                <ContractBlank name="sellerPenalty" size="md" type="number" value={form.sellerPenalty} onChange={handleChange} />
                {" "}دينار للمشتري تعويضاً عن الضرر.
              </p>
              <p className="sc-doc-para">
                إذا نكل المشتري عن إتمام الصفقة يفقد العربون المدفوع، ويلتزم بدفع نسبة{" "}
                <ContractBlank name="buyerPenaltyPercent" size="xs" type="number" value={form.buyerPenaltyPercent} onChange={handleChange} />
                {" "}% إضافية تضميناً للبائع.
              </p>
              <p className="sc-doc-para">
                تكون الرسوم والضرائب المترتبة على هذه الصفقة بعهدة{" "}
                <ContractBlank name="feesOnParty" size="md" value={form.feesOnParty} onChange={handleChange} />.
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* ثالثاً — شروط إضافية */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">ثالثاً — شروط إضافية</h3>
              <textarea
                className="sc-blank-area"
                name="extraClause1"
                value={form.extraClause1}
                onChange={handleChange}
                placeholder="الشرط الإضافي الأول..."
                rows={2}
                dir="rtl"
              />
              <textarea
                className="sc-blank-area"
                name="extraClause2"
                value={form.extraClause2}
                onChange={handleChange}
                placeholder="الشرط الإضافي الثاني..."
                rows={2}
                dir="rtl"
              />
            </div>

            <div className="sc-doc-divider" />

            {/* رابعاً — التاريخ */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">رابعاً — التاريخ</h3>
              <p className="sc-doc-para">
                حُرِّرَ هذا العقد في اليوم{" "}
                <ContractBlank name="contractDay" size="xs" type="number" value={form.contractDay} onChange={handleChange} />
                {" "}من شهر{" "}
                <ContractBlank name="contractMonth" size="sm" value={form.contractMonth} onChange={handleChange} />
                {" "}لسنة{" "}
                <ContractBlank name="contractYear" size="sm" type="number" value={form.contractYear} onChange={handleChange} />.
              </p>
            </div>

            <div className="sc-doc-divider" />

            {/* التواقيع */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">التواقيع</h3>
              <div className="sc-doc-sigs">
                <div className="sc-doc-sig-col">
                  <p className="sc-doc-sig-role">الطرف الأول — البائع</p>
                  <p className="sc-doc-sig-line">
                    <span>الاسم:</span>
                    <ContractBlank name="bottomName1" size="md" value={form.bottomName1} onChange={handleChange} />
                  </p>
                  <p className="sc-doc-sig-line">
                    <span>العنوان:</span>
                    <ContractBlank name="bottomAddress1" size="md" value={form.bottomAddress1} onChange={handleChange} />
                  </p>
                  <div className="sc-doc-sig-block">
                    <span className="sc-doc-sig-block-label">التوقيع:</span>
                    <SignaturePad
                      name="sellerSignature"
                      value={form.sellerSignature}
                      onSignatureChange={handleSignatureChange}
                    />
                  </div>
                </div>
                <div className="sc-doc-sig-col">
                  <p className="sc-doc-sig-role">الطرف الثاني — المشتري</p>
                  <p className="sc-doc-sig-line">
                    <span>الاسم:</span>
                    <ContractBlank name="bottomName2" size="md" value={form.bottomName2} onChange={handleChange} />
                  </p>
                  <p className="sc-doc-sig-line">
                    <span>العنوان:</span>
                    <ContractBlank name="bottomAddress2" size="md" value={form.bottomAddress2} onChange={handleChange} />
                  </p>
                  <div className="sc-doc-sig-block">
                    <span className="sc-doc-sig-block-label">التوقيع:</span>
                    <SignaturePad
                      name="buyerSignature"
                      value={form.buyerSignature}
                      onSignatureChange={handleSignatureChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sc-doc-divider" />

            {/* الشهود */}
            <div className="sc-doc-clause">
              <h3 className="sc-doc-clause-title">الشهود</h3>
              <p className="sc-doc-sig-line">
                <span>الشاهد الأول:</span>
                <ContractBlank name="witness1" size="lg" value={form.witness1} onChange={handleChange} />
              </p>
              <p className="sc-doc-sig-line" style={{ marginTop: "12px" }}>
                <span>الشاهد الثاني:</span>
                <ContractBlank name="witness2" size="lg" value={form.witness2} onChange={handleChange} />
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
