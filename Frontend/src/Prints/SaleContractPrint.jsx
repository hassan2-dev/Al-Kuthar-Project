import { useEffect, useState } from "react";

export default function SaleContractPrint() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const savedForm = localStorage.getItem("saleContractDraft");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  const fill = (value) => value?.trim() || "................";

  if (!form) {
    return <div style={{ padding: "40px" }}>لا توجد بيانات للطباعة</div>;
  }

  return (
    <div className="print-page">
      <div className="print-toolbar">
        <button onClick={() => window.print()} className="btn btn-primary">
          طباعة
        </button>
      </div>

      <div className="official-print-sheet">
        <h1 className="official-title">عقد بيع وشراء</h1>

        <div className="inline-row">
          <span>
            الطرف الأول البائع: <strong>{fill(form.partyOneSeller)}</strong>
          </span>
          <span>
            الطرف الثاني المشتري: <strong>{fill(form.partyTwoBuyer)}</strong>
          </span>
        </div>

        <p className="intro-line">
          لقد تم اتفاق الطرفين على انعقاد هذا العقد بالشروط التالية:
        </p>

        <div className="contract-block">
          <p>
            <strong>أولاً:</strong> اسم البائع:{" "}
            <strong>{fill(form.sellerName)}</strong>
            {"  "}عنوانه: <strong>{fill(form.sellerAddress)}</strong>
          </p>

          <p>
            <strong>أ-</strong> يعترف بأنه قد باع للمشتري الملك:
          </p>

          <div className="triple-row">
            <span>
              نوعه: <strong>{fill(form.propertyType)}</strong>
            </span>
            <span>
              الرقم والتسلسل:{" "}
              <strong>{fill(form.propertyNumberSequence)}</strong>
            </span>
            <span>
              المحلة: <strong>{fill(form.mahala)}</strong>
            </span>
          </div>

          <div className="double-row">
            <span>
              ب- بدل البيع المتفق عليه:{" "}
              <strong>{fill(form.agreedPrice)}</strong>
            </span>
            <span>
              ج- العربون الذي تم قبضه:{" "}
              <strong>{fill(form.depositPaid)}</strong>
            </span>
          </div>

          <p>
            إذا امتنع عن التقرير أو نكل عن البيع فيكون ملزماً بإعادة العربون
            ويتعهد بإعادة تضمينات للمشتري وقدرها:{" "}
            <strong>{fill(form.sellerPenalty)}</strong>
          </p>
        </div>

        <div className="contract-block">
          <p>
            <strong>ثانياً:</strong> اسم المشتري:{" "}
            <strong>{fill(form.buyerName)}</strong>
            {"  "}عنوانه: <strong>{fill(form.buyerAddress)}</strong>
          </p>

          <p>
            <strong>أ-</strong> يعترف بأنه قد قبل الشراء ويتعهد بدفع باقي المبلغ
            وقدره <strong>{fill(form.remainingAmount)}</strong> دينار
          </p>

          <p>
            <strong>ب-</strong> في حالة عدم التقدير أو النكل عن الشراء وتأدية
            قصور البدل فيتعهد بدفع تضمينات قدرها{" "}
            <strong>{fill(form.buyerPenaltyPercent)}</strong> %
          </p>
        </div>

        <div className="contract-block">
          <p>
            <strong>ثالثاً:</strong> أن جميع الرسوم المقتضية للبيع ورسوم الإفراز
            والتصحيح والتوحيد والضريبة والعرصات وضريبة الدخل هي بعهدة الطرف{" "}
            <strong>{fill(form.feesOnParty)}</strong>
          </p>

          <p>
            <strong>رابعاً:</strong> يتعهد الطرفان بدفع دلالية (1 - 2 %) إلى
            الدلال ويتحمل الطرفان أجرة الدلالية المناصفة إلا إذا اتفق على خلاف
            ذلك.
          </p>

          <p>
            <strong>خامساً:</strong> المكتب غير مسؤول عن نقض البيع أو رفضه.
          </p>

          <p>
            <strong>سادساً:</strong> إذا تعهد الأطراف في العقود كانوا مسؤولين عن
            أجرة الدلالية.
          </p>

          <p>
            <strong>سابعاً:</strong> وبناءً على حصول التراضي والإيجاب والقبول
            حرر هذا العقد في <strong>{fill(form.contractDay)}</strong> /{" "}
            <strong>{fill(form.contractMonth)}</strong> /{" "}
            <strong>{fill(form.contractYear)}</strong>
          </p>
        </div>

        <div className="extra-box">
          <h3>فقرات إضافية</h3>
          <p>
            1- <strong>{fill(form.extraClause1)}</strong>
          </p>
          <p>
            2- <strong>{fill(form.extraClause2)}</strong>
          </p>
        </div>

        <div className="signatures-table">
          <div className="sign-col">
            <p>
              الاسم: <strong>{fill(form.bottomName1)}</strong>
            </p>
            <p>
              العنوان: <strong>{fill(form.bottomAddress1)}</strong>
            </p>
            <p>
              توقيع البائع: <strong>{fill(form.sellerSignature)}</strong>
            </p>
            <p>
              الشاهد: <strong>{fill(form.witness1)}</strong>
            </p>
          </div>

          <div className="sign-col">
            <p>
              الاسم: <strong>{fill(form.bottomName2)}</strong>
            </p>
            <p>
              العنوان: <strong>{fill(form.bottomAddress2)}</strong>
            </p>
            <p>
              توقيع المشتري: <strong>{fill(form.buyerSignature)}</strong>
            </p>
            <p>
              الشاهد: <strong>{fill(form.witness2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}