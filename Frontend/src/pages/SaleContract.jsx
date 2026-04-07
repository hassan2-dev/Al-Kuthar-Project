import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SaleContract() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    partyOneSeller: "",
    partyTwoBuyer: "",
    sellerName: "",
    sellerAddress: "",
    propertyType: "",
    propertyNumberSequence: "",
    mahala: "",
    agreedPrice: "",
    depositPaid: "",
    sellerPenalty: "",
    buyerName: "",
    buyerAddress: "",
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

        {/* حقول النموذج */}
        <div className="sc-form">

          {/* أطراف العقد */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M1 15c0-3 2.5-5 5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="12.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M17 15c0-3-2.5-5-5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <h3>أطراف العقد</h3>
            </div>
            <div className="sc-grid">
              <input className="sc-input" name="partyOneSeller" placeholder="الطرف الأول البائع" value={form.partyOneSeller} onChange={handleChange} />
              <input className="sc-input" name="partyTwoBuyer" placeholder="الطرف الثاني المشتري" value={form.partyTwoBuyer} onChange={handleChange} />
              <input className="sc-input" name="sellerName" placeholder="اسم البائع" value={form.sellerName} onChange={handleChange} />
              <input className="sc-input" name="sellerAddress" placeholder="عنوان البائع" value={form.sellerAddress} onChange={handleChange} />
              <input className="sc-input" name="buyerName" placeholder="اسم المشتري" value={form.buyerName} onChange={handleChange} />
              <input className="sc-input" name="buyerAddress" placeholder="عنوان المشتري" value={form.buyerAddress} onChange={handleChange} />
            </div>
          </div>

          {/* بيانات الملك */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 8L9 2l7 6v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8z" stroke="currentColor" strokeWidth="1.4"/>
                  <rect x="6.5" y="10" width="5" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              </span>
              <h3>بيانات الملك</h3>
            </div>
            <div className="sc-grid sc-grid--3">
              <input className="sc-input" name="propertyType" placeholder="نوع الملك" value={form.propertyType} onChange={handleChange} />
              <input className="sc-input" name="propertyNumberSequence" placeholder="الرقم والتسلسل" value={form.propertyNumberSequence} onChange={handleChange} />
              <input className="sc-input" name="mahala" placeholder="المحلة" value={form.mahala} onChange={handleChange} />
            </div>
          </div>

          {/* المبالغ والالتزامات */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M9 5v1.5M9 11.5V13M6.5 8.5C6.5 7.4 7.6 6.5 9 6.5s2.5.9 2.5 2c0 2-2.5 2-2.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <h3>المبالغ والالتزامات</h3>
            </div>
            <div className="sc-grid">
              <input className="sc-input" name="agreedPrice" placeholder="بدل البيع المتفق عليه" value={form.agreedPrice} onChange={handleChange} />
              <input className="sc-input" name="depositPaid" placeholder="العربون المقبوض" value={form.depositPaid} onChange={handleChange} />
              <input className="sc-input" name="sellerPenalty" placeholder="تضمينات المشتري عند نكول البائع" value={form.sellerPenalty} onChange={handleChange} />
              <input className="sc-input" name="remainingAmount" placeholder="باقي المبلغ" value={form.remainingAmount} onChange={handleChange} />
              <input className="sc-input" name="buyerPenaltyPercent" placeholder="نسبة تضمينات المشتري %" value={form.buyerPenaltyPercent} onChange={handleChange} />
              <input className="sc-input" name="feesOnParty" placeholder="الرسوم بعهدة الطرف" value={form.feesOnParty} onChange={handleChange} />
            </div>
          </div>

          {/* تاريخ العقد */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 8h14M6 2v4M12 2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <h3>تاريخ العقد</h3>
            </div>
            <div className="sc-grid sc-grid--3">
              <input className="sc-input" name="contractDay" placeholder="اليوم" value={form.contractDay} onChange={handleChange} />
              <input className="sc-input" name="contractMonth" placeholder="الشهر" value={form.contractMonth} onChange={handleChange} />
              <input className="sc-input" name="contractYear" placeholder="السنة" value={form.contractYear} onChange={handleChange} />
            </div>
          </div>

          {/* فقرات إضافية */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12M3 8h12M3 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <h3>فقرات إضافية</h3>
            </div>
            <div className="sc-grid sc-grid--1">
              <textarea className="sc-input sc-textarea" name="extraClause1" placeholder="الفقرة الإضافية الأولى" value={form.extraClause1} onChange={handleChange} rows="3" />
              <textarea className="sc-input sc-textarea" name="extraClause2" placeholder="الفقرة الإضافية الثانية" value={form.extraClause2} onChange={handleChange} rows="3" />
            </div>
          </div>

          {/* التواقيع والشهود */}
          <div className="sc-section">
            <div className="sc-section-head">
              <span className="sc-section-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14c2-4 4-7 5-7s1.5 2 3 2 2-1 4-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </span>
              <h3>التواقيع والشهود</h3>
            </div>
            <div className="sc-grid">
              <input className="sc-input" name="bottomName1" placeholder="الاسم الأول" value={form.bottomName1} onChange={handleChange} />
              <input className="sc-input" name="bottomName2" placeholder="الاسم الثاني" value={form.bottomName2} onChange={handleChange} />
              <input className="sc-input" name="bottomAddress1" placeholder="العنوان الأول" value={form.bottomAddress1} onChange={handleChange} />
              <input className="sc-input" name="bottomAddress2" placeholder="العنوان الثاني" value={form.bottomAddress2} onChange={handleChange} />
              <input className="sc-input" name="sellerSignature" placeholder="توقيع البائع" value={form.sellerSignature} onChange={handleChange} />
              <input className="sc-input" name="buyerSignature" placeholder="توقيع المشتري" value={form.buyerSignature} onChange={handleChange} />
              <input className="sc-input" name="witness1" placeholder="الشاهد الأول" value={form.witness1} onChange={handleChange} />
              <input className="sc-input" name="witness2" placeholder="الشاهد الثاني" value={form.witness2} onChange={handleChange} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
