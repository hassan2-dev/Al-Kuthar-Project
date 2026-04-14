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

  const fill = (value) => value?.trim() || "................";

  const fillDate = (iso) => {
    const s = iso?.trim();
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
            onClick={() => navigate("/sale-contract")}
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
      {/* Toolbar — screen only */}
      <div className="cp-toolbar no-print">
        <button
          type="button"
          className="sc-toolbar-back"
          onClick={() => navigate("/sale-contract")}
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

            {/* ── 3-column RTL: البصرة (يمين) | العنوان | الشعار (يسار) ── */}
            <div className="cp-header">
              {/* Right: city + date */}
              <div className="cp-header-meta">
                <span className="cp-header-city">البصرة</span>
                <span className="cp-header-date">التاريخ : {fillDate(form.contractYear)}</span>
              </div>
              {/* Centre: bismillah + title */}
              <div className="cp-header-center">
                <p className="cp-bismillah">بسم الله الرحمن الرحيم</p>
                <div className="cp-title-wrapper">
                  <div className="cp-title-orn" />
                  <h1 className="cp-title">عقد بيع عقار</h1>
                  <div className="cp-title-orn cp-title-orn--rev" />
                </div>
              </div>
              {/* Left: logo */}
              <div className="cp-header-brand">
                <img src="/al-kawthar-logo.png" alt="Al-Kawthar" className="cp-logo-img" />
              </div>
            </div>

            {/* ── Content area ── */}
            <div className="cp-content">

              {/* Parties — two columns side by side */}
              <div className="cp-parties-wrap">
                <div className="cp-party-box">
                  <div className="cp-party-head">الفريق الأول</div>
                  <div className="cp-party-fields">
                    <span className="cp-pl">البائع السيد :</span>
                    <strong className={fieldClass("cp-pv", form.partyOneSeller)}>{fill(form.partyOneSeller)}</strong>
                    <span className="cp-pl">السكن :</span>
                    <strong className={fieldClass("cp-pv", form.sellerCity)}>{fill(form.sellerCity)}</strong>
                    <span className="cp-pl">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-pv", form.sellerProfession)}>{fill(form.sellerProfession)}</strong>
                  </div>
                </div>
                <div className="cp-parties-vdivider" />
                <div className="cp-party-box">
                  <div className="cp-party-head">الفريق الثاني</div>
                  <div className="cp-party-fields">
                    <span className="cp-pl">المشتري السيد :</span>
                    <strong className={fieldClass("cp-pv", form.partyTwoBuyer)}>{fill(form.partyTwoBuyer)}</strong>
                    <span className="cp-pl">السكن :</span>
                    <strong className={fieldClass("cp-pv", form.buyerCity)}>{fill(form.buyerCity)}</strong>
                    <span className="cp-pl">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-pv", form.buyerProfession)}>{fill(form.buyerProfession)}</strong>
                  </div>
                </div>
              </div>

              {/* Intro */}
              <p className="cp-intro">
                لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :
              </p>

              {/* Clauses */}
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

              {/* Closing */}
              <p className="cp-closing">
                فبناء على حصول التراضي والإيجاب والقبول حرر هذا العقد.
              </p>
              <p className="cp-date-line">
                البصرة في تاريخ <strong className={fieldClass("cp-val", form.contractYear)}>{fillDate(form.contractYear)}</strong>
              </p>

              {/* Extra clauses */}
              <div className="cp-extra">
                <p className="cp-extra-title">ملاحظات إضافية</p>
                <p className="cp-extra-content">
                  {form.extraClauses?.trim() || "................"}
                </p>
              </div>

              {/* Signatures */}
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
