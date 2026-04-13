import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fieldClass, isFieldFilled } from "./printFieldClass.js";

export default function RentContractPrint() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("مسودة");

  useEffect(() => {
    const savedForm = localStorage.getItem("rentContractDraft");
    const savedStatus = localStorage.getItem("rentContractStatus");
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

  const fillDate = (value) => {
    const s = value?.trim();
    if (!s) return "................";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const d = new Date(`${s}T12:00:00`);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
      }
    }
    return fill(value);
  };

  if (!form) {
    return (
      <div className="cp-page" dir="rtl">
        <div className="cp-toolbar no-print">
          <button
            type="button"
            className="sc-toolbar-back"
            onClick={() => navigate("/rent-contract")}
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
          onClick={() => navigate("/rent-contract")}
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
                <span className="cp-header-date">التاريخ : {fillDate(form.contractDate)}</span>
              </div>
              {/* Centre: bismillah + title */}
              <div className="cp-header-center">
                <p className="cp-bismillah">بسم الله الرحمن الرحيم</p>
                <div className="cp-title-wrapper">
                  <div className="cp-title-orn" />
                  <h1 className="cp-title">عقد إيجار</h1>
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

              {/* Contract info grid */}
              <div className="cp-rent-grid">
                <span className={fieldClass("cp-rent-label", form.propertySerial)}>تسلسل العقار :</span>
                <div className={fieldClass("cp-rent-cell", form.propertySerial)}>{fill(form.propertySerial)}</div>

                <span className={fieldClass("cp-rent-label", form.propertyType)}>نوع المأجور :</span>
                <div className={fieldClass("cp-rent-cell", form.propertyType)}>{fill(form.propertyType)}</div>

                <span
                  className={
                    isFieldFilled(form.rentFromDate) && isFieldFilled(form.rentToDate)
                      ? "cp-rent-label cp-field--filled"
                      : "cp-rent-label"
                  }
                >
                  مدة الإيجار :
                </span>
                <div
                  className={
                    isFieldFilled(form.rentFromDate) && isFieldFilled(form.rentToDate)
                      ? "cp-rent-cell cp-field--filled"
                      : "cp-rent-cell"
                  }
                >
                  <span>من</span>
                  <strong className={fieldClass("cp-val", form.rentFromDate)}>{fillDate(form.rentFromDate)}</strong>
                  <span>لغاية</span>
                  <strong className={fieldClass("cp-val", form.rentToDate)}>{fillDate(form.rentToDate)}</strong>
                </div>

                <span className={fieldClass("cp-rent-label", form.rentAmount)}>بدل الإيجار :</span>
                <div className={fieldClass("cp-rent-cell", form.rentAmount)}>
                  <strong className={fieldClass("cp-val", form.rentAmount)}>{fill(form.rentAmount)}</strong>
                  <span>دينار فقط</span>
                </div>

                <span className={fieldClass("cp-rent-label", form.paymentPeriod)}>يدفع مقدماً كل :</span>
                <div className={fieldClass("cp-rent-cell", form.paymentPeriod)}>{fill(form.paymentPeriod)}</div>

                <span className={fieldClass("cp-rent-label", form.landlordName)}>المؤجر :</span>
                <div className={fieldClass("cp-rent-cell", form.landlordName)}>{fill(form.landlordName)}</div>

                <span className={fieldClass("cp-rent-label", form.tenantName)}>المستأجر :</span>
                <div className={fieldClass("cp-rent-cell", form.tenantName)}>{fill(form.tenantName)}</div>
              </div>

              {/* Intro */}
              <p className="cp-intro">
                <strong>واتفقا على ما يأتي :</strong>
              </p>

              {/* Clauses */}
              <div className="cp-clauses">

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">أولاً :</strong> لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة إعلانه أو يغير شيئاً من المأجور
                      دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن
                      يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">ثانياً :</strong> اذا تأخر المستأجر عن دفع الاجرة المتفق عليها أو قسط من أقساطها عند الاستحقاق
                      وأظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد
                      هذا العقد باطلاً وملغياً وعلى المستأجر ترك المأجور وإخلاءه حالاً مراعاة لهذا
                      الشرط ولا حاجة للإنذار الرسمي.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">ثالثاً :</strong> اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الإيجار واشغله من
                      دون مسوغ قانوني ومن دون أن يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على
                      نفسه بتسليم الاجرة ضعف الإيجار المذكور أعلاه للمدة التي تمضي بعد انتهاء مدة
                      هذا العقد الى حين تخلية المأجور ولا حاجة للإنذار الرسمي الى المستأجر بهذا
                      الخصوص بل إن انقضاء المدة المعينة تعد بمقام الإنذار.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">رابعاً :</strong> تكون الضريبة على المؤجر أما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء
                      والكهرباء فتكون على المستأجر.
                    </p>
                  </div>
                </div>

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">خامساً :</strong> لا يجوز للمستأجر تغيير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله
                      على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية
                      الفورية.
                    </p>
                  </div>
                </div>

              </div>

              {/* Extra clauses */}
              <div className="cp-extra">
                <p className="cp-extra-title">ملاحظات إضافية</p>
                <p className="cp-extra-content">
                  {form.extraClauses?.trim() || "................"}
                </p>
              </div>

              {/* Signatures with party info */}
              <div className="cp-rent-sigs">
                <div className="cp-rent-sig-col">
                  <div className="cp-rent-sig-head">المستأجر</div>
                  <div className="cp-rent-sig-fields">
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">الاسم الكامل :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.tenantFullName)}>{fill(form.tenantFullName)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.tenantAddress)}>{fill(form.tenantAddress)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">رقم الهاتف :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.tenantPhone)}>{fill(form.tenantPhone)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.tenantIdNumber)}>{fill(form.tenantIdNumber)}</strong>
                    </div>
                  </div>
                  <div className="cp-sig-box" />
                </div>

                <div className="cp-rent-sig-col">
                  <div className="cp-rent-sig-head">المؤجر</div>
                  <div className="cp-rent-sig-fields">
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">الاسم الكامل :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.landlordFullName)}>{fill(form.landlordFullName)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.landlordAddress)}>{fill(form.landlordAddress)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">رقم الهاتف :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.landlordPhone)}>{fill(form.landlordPhone)}</strong>
                    </div>
                    <div className="cp-rent-sig-row">
                      <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                      <strong className={fieldClass("cp-rent-sig-value", form.landlordIdNumber)}>{fill(form.landlordIdNumber)}</strong>
                    </div>
                  </div>
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
