import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <div className="print-page print-page--empty" dir="rtl">
        <div className="print-toolbar no-print">
          <button
            type="button"
            className="sc-toolbar-back"
            onClick={() => navigate("/sale-contract")}
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
          onClick={() => navigate("/sale-contract")}
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
        <h1 className="official-title">عقد بيع</h1>

        {/* أطراف العقد */}
        <div className="print-parties-grid">
          <span className="print-parties-label">الفريق الأول البائع السيد:</span>
          <strong className="print-parties-value">{fill(form.partyOneSeller)}</strong>
          <span className="print-parties-label">الساكن:</span>
          <strong className="print-parties-value">{fill(form.sellerCity)}</strong>
          <span className="print-parties-label">المهنة:</span>
          <strong className="print-parties-value">{fill(form.sellerProfession)}</strong>

          <span className="print-parties-label">الفريق الثاني المشتري السيد:</span>
          <strong className="print-parties-value">{fill(form.partyTwoBuyer)}</strong>
          <span className="print-parties-label">الساكن:</span>
          <strong className="print-parties-value">{fill(form.buyerCity)}</strong>
          <span className="print-parties-label">المهنة:</span>
          <strong className="print-parties-value">{fill(form.buyerProfession)}</strong>
        </div>

        <p className="print-intro">
          لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :
        </p>

        <div className="print-clause">
          <p>
            <strong>أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل في فيما يلي :
          </p>
          <div className="print-field-rows" dir="rtl">
            <span className="print-field-label">نوع الملك</span>
            <strong className="print-field-value">{fill(form.propertyType)}</strong>
            <span className="print-field-label">الرقم والتسلسل</span>
            <strong className="print-field-value">{fill(form.propertyNumber)}</strong>
            <span className="print-field-label">المحلة</span>
            <strong className="print-field-value">{fill(form.mahala)}</strong>
          </div>
        </div>

        <div className="print-clause">
          <p>
            <strong>ثانياً :</strong> ان بدل البيع المتفق عليه هو{" "}
            <strong className="print-inline-value">{fill(form.agreedPrice)}</strong>
          </p>
          <p>
            ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره{" "}
            <strong className="print-inline-value">{fill(form.depositPaid)}</strong>
          </p>
          <p>
            والباقي <strong className="print-inline-value">{fill(form.remainingAmount)}</strong>
          </p>
          <p>
            واما البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزما بأعادة
            العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدره{" "}
            <strong className="print-inline-value">{fill(form.sellerPenalty)}</strong> ديناراً بدون حاجة الى إنذار رسمي
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>رابعاً :</strong> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
            بتأدية قصور البدل المبيع الى الفريق الأول عند اكماله المعامله والتقرير
            في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
            يتعهد بتأدية تضمينات قدرها{" "}
            <strong className="print-inline-value">{fill(form.buyerPenalty)}</strong> ديناراً بدون حاجة الى انذار رسمي
            وليس له الحق بمطالبته بالعربون وان الفريق الثاني له الحق ان يقرر الملك بأسم من يشاء
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>خامساً :</strong> ان جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق{" "}
            <strong className="print-inline-value">{fill(form.feesOnParty)}</strong>
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>سادساً :</strong> اما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
            هي في عهدة الفريق الأول
          </p>
        </div>

        <div className="print-clause">
          <p>
            <strong>سابعاً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ({" "}
            <strong className="print-inline-value">{fill(form.brokerFeePercent)}</strong> % ) الى الدلال الذي توسط بعقد البيع
            وبمجرد التوقيع على هذه المقاولة. واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد
            يتعهد بتأدية ضعفي الدلالة المذكورة اعلاه كما انه في حالة تراضي بين الفريقين وقوع
            تراضي على ابطال هذا العقد فأنهما يكونان ملزمين بتأديتهما الدلاليه المذكورة مهما بلغت.
          </p>
        </div>

        <p className="print-closing">
          فبناء على حصول التراضي والايجاب والقبول حرر هذا العقد.
        </p>

        <p className="print-date">
          البصرة في تاريخ{" "}
          <strong className="print-inline-value">{fillDate(form.contractYear)}</strong>
        </p>

        {/* فقرات إضافية — قبل التواقيع كما في النموذج */}
        <div className="print-extra">
          <h3>فقرات إضافية</h3>
          <p style={{ whiteSpace: "pre-wrap", minHeight: "2.5em" }}>
            {form.extraClauses?.trim() || "................"}
          </p>
        </div>

        {/* التواقيع */}
        <div className="print-sigs">
          <div className="print-sig-col">
            <p className="print-sig-role">الفريق الأول</p>
            <div className="print-sig-box" />
          </div>
          <div className="print-sig-col">
            <p className="print-sig-role">الفريق الثاني</p>
            <div className="print-sig-box" />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
