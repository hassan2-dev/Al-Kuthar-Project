import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <div className="print-page print-page--empty" dir="rtl">
        <div className="print-toolbar no-print">
          <button
            type="button"
            className="sc-toolbar-back"
            onClick={() => navigate("/rent-contract")}
            aria-label="رجوع إلى العقد"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
              <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            رجوع
          </button>
        </div>
        <p style={{ padding: "24px 40px", fontFamily: "inherit", margin: 0 }}>لا توجد بيانات للطباعة</p>
      </div>
    );
  }

  return (
    <div className="print-page">
      <div className="print-toolbar no-print">
        <button
          type="button"
          className="sc-toolbar-back"
          onClick={() => navigate("/rent-contract")}
          aria-label="رجوع إلى العقد"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
            <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          رجوع
        </button>
        <div className="print-toolbar__actions">
          <button type="button" onClick={() => window.print()} className="btn btn-primary">
            طباعة
          </button>
          <span className={`sc-status-badge ${status === "مؤكد" ? "sc-status-badge--confirmed" : ""}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="official-print-sheet" dir="rtl">
        <div className="official-print-inner">
        <div className="print-brand-row" dir="ltr">
          <img
            src="/al-kawthar-logo.png"
            alt="Al-Kawthar Logo"
            className="print-brand-logo"
          />
        </div>
        <h1 className="official-title">(( عقد إيجار ))</h1>

        {/* معلومات العقد الرئيسية */}
        <div className="rent-print-fields-grid">
          <span className="rent-print-field-label">تسلسل العقار :</span>
          <strong className="print-field-value">{fill(form.propertySerial)}</strong>

          <span className="rent-print-field-label">التاريخ :</span>
          <strong className="print-field-value">{fillDate(form.contractDate)}</strong>

          <span className="rent-print-field-label">نوع المأجور :</span>
          <strong className="print-field-value">{fill(form.propertyType)}</strong>

          <span className="rent-print-field-label">مدة الإيجار :</span>
          <div className="rent-print-field-inline">
            <span className="rent-print-sub">من</span>
            <strong className="print-inline-value">{fillDate(form.rentFromDate)}</strong>
            <span className="rent-print-sub">لغاية</span>
            <strong className="print-inline-value">{fillDate(form.rentToDate)}</strong>
          </div>

          <span className="rent-print-field-label">بدل الإيجار :</span>
          <div className="rent-print-field-inline">
            <strong className="print-inline-value">{fill(form.rentAmount)}</strong>
            <span className="rent-print-sub">فقط</span>
          </div>

          <span className="rent-print-field-label">يدفع مقدماً كل :</span>
          <strong className="print-field-value">{fill(form.paymentPeriod)}</strong>

          <span className="rent-print-field-label">تم التعاقد بين :</span>
          <div className="rent-print-field-inline">
            <span className="rent-print-sub">المدعو بالمؤجر :</span>
            <strong className="print-inline-value">{fill(form.landlordName)}</strong>
          </div>

          <span className="rent-print-field-label">وبين :</span>
          <div className="rent-print-field-inline">
            <span className="rent-print-sub">المدعو بالمستأجر :</span>
            <strong className="print-inline-value">{fill(form.tenantName)}</strong>
          </div>
        </div>

        <p className="print-intro">
          <strong>واتفقا على ما يأتي :</strong>
        </p>

        <div className="print-clause">
          <p>
            <strong>أولاً :</strong>{" "}
            لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة اعلانه او يغير شيئاً من المأجور
            دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن
            يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>ثانياً :</strong>{" "}
            اذا تأخر المستأجر عن دفع الاجرة المتفق عليها او قسط من اقساطها عند الاستحقاق
            واظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد
            هذا العقد باطلاً وملغياً وعلى المستأجر ترك الماجور واخلاءه حالا مراعاة لهذا
            الشرط ولا حاجة للإنذار رسمي.
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>ثالثاً :</strong>{" "}
            اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الايجار واشغله من
            دون مسوغ قانوني ومن دون ان يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على
            نفسه بتسليم الاجرة ضعف الايجار المذكور اعلاه للمدة التي تمضي بعد انتهاء مدة
            هذا العقد الى حين تخلية المأجور ولا حاجة للانذار الرسمي الى المستأجر بهذا
            الخصوص بل ان انقضاء المدة المعينة تعد بمقام الانذار ويعتبر انقضاء المدة بمقام
            الانذار ولا يسوغ للمستأجر أن يدافع عن نفسه بهذا الصدد بأن لم يسبق له الانذار
            أي الانذار القانوني.
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>رابعاً :</strong>{" "}
            تكون الضريبة على المؤجر اما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء
            والكهرباء فتكون على المستأجر.
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>خامساً :</strong>{" "}
            لا يجوز للمستأجر تغير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله
            على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية
            الفورية.
          </p>
        </div>

        {/* فقرات إضافية */}
        <div className="print-extra">
          <h3>فقرات إضافية</h3>
          <p style={{ whiteSpace: "pre-wrap", minHeight: "2.5em" }}>
            {form.extraClauses?.trim() || "................"}
          </p>
        </div>

        {/* بيانات الأطراف + التواقيع */}
        <div className="rent-print-sigs">
          <div className="rent-print-sig-col">
            <p className="rent-print-sig-title">المستأجر</p>
            <div className="rent-print-sig-fields">
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">الاسم الكامل :</span>
                <strong className="print-field-value">{fill(form.tenantFullName)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">عنوان المسكن الدائم :</span>
                <strong className="print-field-value">{fill(form.tenantAddress)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">رقم الهاتف :</span>
                <strong className="print-field-value">{fill(form.tenantPhone)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">رقم وتاريخ هوية الاحوال المدنية :</span>
                <strong className="print-field-value">{fill(form.tenantIdNumber)}</strong>
              </div>
            </div>
            <div className="print-sig-box" />
          </div>

          <div className="rent-print-sig-col">
            <p className="rent-print-sig-title">المؤجر</p>
            <div className="rent-print-sig-fields">
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">الاسم الكامل :</span>
                <strong className="print-field-value">{fill(form.landlordFullName)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">عنوان المسكن الدائم :</span>
                <strong className="print-field-value">{fill(form.landlordAddress)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">رقم الهاتف :</span>
                <strong className="print-field-value">{fill(form.landlordPhone)}</strong>
              </div>
              <div className="rent-print-sig-row">
                <span className="rent-print-sig-label">رقم وتاريخ هوية الاحوال المدنية :</span>
                <strong className="print-field-value">{fill(form.landlordIdNumber)}</strong>
              </div>
            </div>
            <div className="print-sig-box" />
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
