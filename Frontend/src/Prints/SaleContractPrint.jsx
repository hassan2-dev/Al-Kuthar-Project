import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fieldClass } from "./printFieldClass.js";

export default function SaleContractPrint() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("مسودة");

  useEffect(() => {
    const savedForm = localStorage.getItem("saleContractDraft");
    const savedStatus = localStorage.getItem("saleContractStatus");
    if (savedForm) {
      try { setForm(JSON.parse(savedForm)); } catch { /* ignore */ }
    }
    if (savedStatus) setStatus(savedStatus);
  }, []);

  /* Add body class so @media print can isolate this page */
  useEffect(() => {
    document.body.classList.add("print-contract-page");
    return () => document.body.classList.remove("print-contract-page");
  }, []);

  /* Auto-print once data is ready */
  useEffect(() => {
    if (form) {
      const t = setTimeout(() => window.print(), 120);
      return () => clearTimeout(t);
    }
  }, [form]);

  const fill = (value) => String(value ?? "").trim() || "................";

  const fillDate = (iso) => {
    const s = String(iso ?? "").trim();
    if (!s) return "................";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const d = new Date(`${s}T12:00:00`);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
      }
    }
    return s;
  };

  if (!form) {
    return (
      <div className="cp-page" dir="rtl">
        <div className="cp-toolbar no-print">
          <button
            type="button"
            className="sc-toolbar-back"
            onClick={() => navigate(-1)}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
              <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            رجوع
          </button>
        </div>
        <p style={{ padding: "24px 40px", fontFamily: "inherit", margin: 0 }}>لا توجد بيانات للطباعة</p>
      </div>
    );
  }

  return (
    <div className="cp-page">

      {/* Buildings — screen only */}
      <svg className="cp-buildings cp-buildings--left no-print" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="20" y="60" width="38" height="460" rx="3" fill="rgba(100,80,48,0.10)"/>
        <rect x="24" y="80" width="6" height="8" rx="1" fill="rgba(100,80,48,0.18)"/>
        <rect x="34" y="80" width="6" height="8" rx="1" fill="rgba(100,80,48,0.18)"/>
        <rect x="44" y="80" width="6" height="8" rx="1" fill="rgba(100,80,48,0.18)"/>
        <rect x="24" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.14)"/>
        <rect x="34" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.22)"/>
        <rect x="44" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.14)"/>
        <rect x="24" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.18)"/>
        <rect x="34" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.12)"/>
        <rect x="44" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.18)"/>
        <rect x="24" y="140" width="6" height="8" rx="1" fill="rgba(100,80,48,0.14)"/>
        <rect x="34" y="140" width="6" height="8" rx="1" fill="rgba(100,80,48,0.20)"/>
        <rect x="44" y="140" width="6" height="8" rx="1" fill="rgba(100,80,48,0.14)"/>
        <line x1="39" y1="60" x2="39" y2="20" stroke="rgba(100,80,48,0.22)" strokeWidth="2"/>
        <line x1="34" y1="35" x2="44" y2="35" stroke="rgba(100,80,48,0.18)" strokeWidth="1.5"/>
        <rect x="70" y="140" width="72" height="380" rx="4" fill="rgba(100,80,48,0.12)"/>
        <rect x="82" y="160" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.22)"/>
        <rect x="98" y="160" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.16)"/>
        <rect x="114" y="160" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.22)"/>
        <rect x="82" y="185" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.16)"/>
        <rect x="98" y="185" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.26)"/>
        <rect x="114" y="185" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.16)"/>
        <rect x="82" y="210" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.20)"/>
        <rect x="98" y="210" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.14)"/>
        <rect x="114" y="210" width="10" height="14" rx="1.5" fill="rgba(100,80,48,0.20)"/>
        <polygon points="106,110 70,140 142,140" fill="rgba(100,80,48,0.13)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(100,80,48,0.24)" strokeWidth="2.5"/>
        <rect x="155" y="260" width="50" height="260" rx="3" fill="rgba(100,80,48,0.09)"/>
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(100,80,48,0.08)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(100,80,48,0.10)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(100,80,48,0.09)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(100,80,48,0.12)" strokeWidth="1"/>
      </svg>

      <svg className="cp-buildings cp-buildings--right no-print" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="282" y="80" width="40" height="440" rx="3" fill="rgba(100,80,48,0.09)"/>
        <rect x="287" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.16)"/>
        <rect x="297" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.22)"/>
        <rect x="307" y="100" width="6" height="8" rx="1" fill="rgba(100,80,48,0.16)"/>
        <rect x="287" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.20)"/>
        <rect x="297" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.14)"/>
        <rect x="307" y="120" width="6" height="8" rx="1" fill="rgba(100,80,48,0.20)"/>
        <line x1="302" y1="80" x2="302" y2="40" stroke="rgba(100,80,48,0.20)" strokeWidth="2"/>
        <line x1="295" y1="58" x2="309" y2="58" stroke="rgba(100,80,48,0.16)" strokeWidth="1.5"/>
        <rect x="198" y="150" width="76" height="370" rx="4" fill="rgba(100,80,48,0.11)"/>
        <rect x="208" y="168" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.20)"/>
        <rect x="225" y="168" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.14)"/>
        <rect x="242" y="168" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.20)"/>
        <rect x="259" y="168" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.14)"/>
        <rect x="208" y="194" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.14)"/>
        <rect x="225" y="194" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.24)"/>
        <rect x="242" y="194" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.14)"/>
        <rect x="259" y="194" width="11" height="15" rx="1.5" fill="rgba(100,80,48,0.18)"/>
        <polygon points="236,115 198,150 274,150" fill="rgba(100,80,48,0.12)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(100,80,48,0.22)" strokeWidth="2.5"/>
        <rect x="130" y="280" width="54" height="240" rx="3" fill="rgba(100,80,48,0.09)"/>
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(100,80,48,0.07)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(100,80,48,0.09)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(100,80,48,0.08)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(100,80,48,0.12)" strokeWidth="1"/>
      </svg>

      {/* Toolbar — screen only */}
      <div className="cp-toolbar no-print">
        <button
          type="button"
          className="sc-toolbar-back"
          onClick={() => navigate(-1)}
          aria-label="رجوع إلى العقد"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
            <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          رجوع
        </button>
        <div className="cp-toolbar-actions">
          <button type="button" onClick={() => window.print()} className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            طباعة
          </button>
          <span className={`sc-status-badge ${status === "مؤكد" ? "sc-status-badge--confirmed" : ""}`}>
            {status}
          </span>
        </div>
      </div>

      {/* ── Paper sheet ── */}
      <div className="cp-sheet" dir="rtl">
        <div className="cp-outer-border">
          <div className="cp-inner-border">

            {/* Header: city+date (right) | bismillah+title (center) | logo (left) */}
            <div className="cp-header">
              <div className="cp-header-meta">
                <span className="cp-header-city">البصرة</span>
                <span className="cp-header-date">التاريخ : {fillDate(form.contractYear)}</span>
              </div>
              <div className="cp-header-center">
                <p className="cp-bismillah">بسم الله الرحمن الرحيم</p>
                <div className="cp-title-wrapper">
                  <div className="cp-title-orn" />
                  <h1 className="cp-title">عقد بيع عقار</h1>
                  <div className="cp-title-orn cp-title-orn--rev" />
                </div>
              </div>
              <div className="cp-header-brand">
                <img src="/al-kawthar-logo.png" alt="Al-Kawthar" className="cp-logo-img" />
              </div>
            </div>

            {/* Content */}
            <div className="cp-content">

              {/* Parties */}
              <div className="cp-parties-wrap">
                <div className="cp-party-box">
                  <div className="cp-party-head">الفريق الأول — البائع</div>
                  <div className="cp-party-fields">
                    <span className="cp-pl">الاسم :</span>
                    <strong className={fieldClass("cp-pv", form.partyOneSeller)}>{fill(form.partyOneSeller)}</strong>
                    <span className="cp-pl">السكن :</span>
                    <strong className={fieldClass("cp-pv", form.sellerCity)}>{fill(form.sellerCity)}</strong>
                    <span className="cp-pl">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-pv", form.sellerProfession)}>{fill(form.sellerProfession)}</strong>
                  </div>
                </div>
                <div className="cp-parties-vdivider" />
                <div className="cp-party-box">
                  <div className="cp-party-head">الفريق الثاني — المشتري</div>
                  <div className="cp-party-fields">
                    <span className="cp-pl">الاسم :</span>
                    <strong className={fieldClass("cp-pv", form.partyTwoBuyer)}>{fill(form.partyTwoBuyer)}</strong>
                    <span className="cp-pl">السكن :</span>
                    <strong className={fieldClass("cp-pv", form.buyerCity)}>{fill(form.buyerCity)}</strong>
                    <span className="cp-pl">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-pv", form.buyerProfession)}>{fill(form.buyerProfession)}</strong>
                  </div>
                </div>
              </div>

              <p className="cp-intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>

              <div className="cp-clauses">

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل فيما يلي :
                    </p>
                    <div className="cp-prop-grid">
                      <span className="cp-prop-label">نوع الملك</span>
                      <strong className={fieldClass("cp-prop-value", form.propertyType)}>{fill(form.propertyType)}</strong>
                      <span className="cp-prop-label">الرقم والتسلسل</span>
                      <strong className={fieldClass("cp-prop-value", form.propertyNumber)}>{fill(form.propertyNumber)}</strong>
                      <span className="cp-prop-label">المحلة</span>
                      <strong className={fieldClass("cp-prop-value", form.mahala)}>{fill(form.mahala)}</strong>
                    </div>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">ثانياً :</strong> إن بدل البيع المتفق عليه هو{" "}
                      <strong className={fieldClass("cp-val", form.agreedPrice)}>{fill(form.agreedPrice)}</strong>
                    </p>
                    <p>
                      ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره{" "}
                      <strong className={fieldClass("cp-val", form.depositPaid)}>{fill(form.depositPaid)}</strong>
                    </p>
                    <p>
                      والباقي{" "}
                      <strong className={fieldClass("cp-val", form.remainingAmount)}>{fill(form.remainingAmount)}</strong>
                    </p>
                    <p>وأما البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزماً بإعادة
                      العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدره{" "}
                      <strong className={fieldClass("cp-val", form.sellerPenalty)}>{fill(form.sellerPenalty)}</strong>{" "}
                      ديناراً بدون حاجة الى إنذار رسمي.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">رابعاً :</strong> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
                      بتأدية قصور البدل المبيع الى الفريق الأول عند اكمال المعامله والتقرير
                      في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
                      يتعهد بتأدية تضمينات قدرها{" "}
                      <strong className={fieldClass("cp-val", form.buyerPenalty)}>{fill(form.buyerPenalty)}</strong>{" "}
                      ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">خامساً :</strong> يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">سادساً :</strong> إن جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق{" "}
                      <strong className={fieldClass("cp-val", form.feesOnParty)}>{fill(form.feesOnParty)}</strong>.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">سابعاً :</strong> أما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
                      هي في عهدة الفريق{" "}
                      <strong className={fieldClass("cp-val", form.taxFeesOnParty)}>{fill(form.taxFeesOnParty)}</strong>.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">ثامناً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ({" "}
                      <strong className={fieldClass("cp-val", form.brokerFeePercent)}>{fill(form.brokerFeePercent)}</strong>
                      {" "}%) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.
                      واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية ضعفي الدلالة
                      المذكورة أعلاه كما أنه في حالة تراضي بين الفريقين على إبطال هذا العقد
                      فأنهما يكونان ملزمين بتأديتهما الدلالية المذكورة مهما بلغت.
                    </p>
                  </div>
                </div>

              </div>

              <p className="cp-closing">فبناء على حصول التراضي والإيجاب والقبول حرر هذا العقد.</p>
              <p className="cp-date-line">
                البصرة في تاريخ{" "}
                <strong className={fieldClass("cp-val", form.contractYear)}>{fillDate(form.contractYear)}</strong>
              </p>

              <div className="cp-extra">
                <p className="cp-extra-title">ملاحظات إضافية</p>
                <p className="cp-extra-content">{form.extraClauses?.trim() || "................"}</p>
              </div>

              <div className="cp-sigs">
                <div className="cp-sig-col">
                  <div className="cp-sig-head">الفريق الأول — البائع</div>
                  <div className="cp-sig-box" />
                </div>
                <div className="cp-sig-col">
                  <div className="cp-sig-head">الفريق الثاني — المشتري</div>
                  <div className="cp-sig-box" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
