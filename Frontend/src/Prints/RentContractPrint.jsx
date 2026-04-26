import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fieldClass, isFieldFilled } from "./printFieldClass.js";

export default function RentContractPrint() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [, setStatus] = useState("مسودة");

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

  /* Auto-print once data is ready — delay + rAF so mobile WebKit finishes paint before capture */
  useEffect(() => {
    if (!form) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) window.print();
        });
      });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [form]);

  const fill = (value) => String(value ?? "").trim() || "................";

  const fillDate = (value) => {
    const s = String(value ?? "").trim();
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

      {/* Toolbar — screen only; print centered above the sheet */}
      <div className="cp-toolbar no-print">
        <div className="cp-toolbar__side cp-toolbar__side--start">
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
        </div>
        <div className="cp-toolbar__center">
          <button type="button" onClick={() => window.print()} className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            طباعة
          </button>
        </div>
        <div className="cp-toolbar__side cp-toolbar__side--end" aria-hidden="true" />
      </div>

      {/* ── Paper sheet ── */}
      <div className="cp-sheet" dir="rtl">
        <div className="cp-outer-border">
          <div className="cp-inner-border">

            {/* Header: city+date (right) | bismillah+title (center) | logo (left) */}
            <div className="cp-header">
              <div className="cp-header-meta">
                <span className="cp-header-city">البصرة</span>
                <span className="cp-header-date">التاريخ : {fillDate(form.contractDate)}</span>
              </div>
              <div className="cp-header-center">
                <p className="cp-bismillah">بسم الله الرحمن الرحيم</p>
                <div className="cp-title-wrapper">
                  <div className="cp-title-orn" />
                  <h1 className="cp-title">عقد إيجار</h1>
                  <div className="cp-title-orn cp-title-orn--rev" />
                </div>
              </div>
              <div className="cp-header-brand">
                <img src="/al-kawthar-logo.png" alt="Al-Kawthar" className="cp-logo-img" />
              </div>
            </div>

            {/* Content */}
            <div className="cp-content">

              {/* Contract info grid */}
              <div className="cp-rent-grid">
                <span className={fieldClass("cp-rent-label", form.propertySerial)}>تسلسل العقار :</span>
                <div className={fieldClass("cp-rent-cell", form.propertySerial)}>{fill(form.propertySerial)}</div>

                <span className={fieldClass("cp-rent-label", form.propertyType)}>نوع أستعمال المأجور :</span>
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

              <p className="cp-intro"><strong>واتفقا على ما يأتي :</strong></p>

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

                <div className="cp-clause">
                  <div className="cp-clause-body">
                    <p>
                      <strong className="cp-clause-lead">سادساً :</strong> يكون المأجور محل للتبليغ والتبلغ في حالة الدعاوي القضائية بين الطرفين.
                    </p>
                  </div>
                </div>

              </div>

              <div className="cp-extra">
                <p className="cp-extra-title">ملاحظات إضافية</p>
                <p className="cp-extra-content">{form.extraClauses?.trim() || "................"}</p>
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
