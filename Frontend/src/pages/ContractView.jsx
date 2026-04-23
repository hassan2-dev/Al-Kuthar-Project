import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";
import {
  getContractById,
  updateContract,
  confirmContract,
  revertContract,
} from "../api/contractsApi";

/* ── helpers ── */
const fill = (value) => value?.toString().trim() || "................";

const fillDate = (value) => {
  const s = value?.toString().trim();
  if (!s) return "................";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
    }
  }
  return fill(value);
};

/* ══════════════════════════════════════════════
   Exported read-only bodies — used by Archive.jsx
   for direct printing (do NOT edit these)
══════════════════════════════════════════════ */
export function RentContractBody({ data }) {
  return (
    <>
      <div className="print-brand-row" dir="ltr">
        <img src="/al-kawthar-logo.png" alt="Al-Kawthar Logo" className="print-brand-logo" />
      </div>
      <h1 className="official-title">(( عقد إيجار ))</h1>

      <div className="rent-print-fields-grid">
        <span className="rent-print-field-label">تسلسل العقار :</span>
        <strong className="print-field-value">{fill(data.propertySerial)}</strong>

        <span className="rent-print-field-label">التاريخ :</span>
        <strong className="print-field-value">{fillDate(data.contractDate)}</strong>

        <span className="rent-print-field-label">نوع أستعمال المأجور :</span>
        <strong className="print-field-value">{fill(data.propertyType)}</strong>

        <span className="rent-print-field-label">مدة الإيجار :</span>
        <div className="rent-print-field-inline">
          <span className="rent-print-sub">من</span>
          <strong className="print-inline-value">{fillDate(data.rentFromDate)}</strong>
          <span className="rent-print-sub">لغاية</span>
          <strong className="print-inline-value">{fillDate(data.rentToDate)}</strong>
        </div>

        <span className="rent-print-field-label">بدل الإيجار :</span>
        <div className="rent-print-field-inline">
          <strong className="print-inline-value">{fill(data.rentAmount)}</strong>
          <span className="rent-print-sub">فقط</span>
        </div>

        <span className="rent-print-field-label">يدفع مقدماً كل :</span>
        <strong className="print-field-value">{fill(data.paymentPeriod)}</strong>

        <span className="rent-print-field-label">تم التعاقد بين :</span>
        <div className="rent-print-field-inline">
          <span className="rent-print-sub">المدعو بالمؤجر :</span>
          <strong className="print-inline-value">{fill(data.landlordName || data.sellerName)}</strong>
        </div>

        <span className="rent-print-field-label">وبين :</span>
        <div className="rent-print-field-inline">
          <span className="rent-print-sub">المدعو بالمستأجر :</span>
          <strong className="print-inline-value">{fill(data.tenantName || data.buyerName)}</strong>
        </div>
      </div>

      <p className="print-intro"><strong>واتفقا على ما يأتي :</strong></p>

      <div className="print-clause"><p><strong>أولاً :</strong>{" "}لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة اعلانه او يغير شيئاً من المأجور دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.</p></div>
      <div className="print-clause"><p><strong>ثانياً :</strong>{" "}اذا تأخر المستأجر عن دفع الاجرة المتفق عليها او قسط من اقساطها عند الاستحقاق واظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد هذا العقد باطلاً وملغياً وعلى المستأجر ترك الماجور واخلاءه حالا مراعاة لهذا الشرط ولا حاجة للإنذار رسمي.</p></div>
      <div className="print-clause"><p><strong>ثالثاً :</strong>{" "}اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الايجار واشغله من دون مسوغ قانوني ومن دون ان يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على نفسه بتسليم الاجرة ضعف الايجار المذكور اعلاه للمدة التي تمضي بعد انتهاء مدة هذا العقد الى حين تخلية المأجور ولا حاجة للانذار الرسمي الى المستأجر بهذا الخصوص بل ان انقضاء المدة المعينة تعد بمقام الانذار ويعتبر انقضاء المدة بمقام الانذار ولا يسوغ للمستأجر أن يدافع عن نفسه بهذا الصدد بأن لم يسبق له الانذار أي الانذار القانوني.</p></div>
      <div className="print-clause"><p><strong>رابعاً :</strong>{" "}تكون الضريبة على المؤجر اما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء والكهرباء فتكون على المستأجر.</p></div>
      <div className="print-clause"><p><strong>خامساً :</strong>{" "}لا يجوز للمستأجر تغير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية الفورية.</p></div>

      {data.extraClauses && (
        <div className="print-extra">
          <h3>ملاحظات إضافية</h3>
          <p style={{ whiteSpace: "pre-wrap", minHeight: "2.5em" }}>{data.extraClauses.trim() || "................"}</p>
        </div>
      )}

      <div className="rent-print-sigs">
        <div className="rent-print-sig-col">
          <p className="rent-print-sig-title">المستأجر</p>
          <div className="rent-print-sig-fields">
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">الاسم الكامل :</span><strong className="print-field-value">{fill(data.tenantFullName || data.buyerName)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">عنوان المسكن الدائم :</span><strong className="print-field-value">{fill(data.tenantAddress)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">رقم الهاتف :</span><strong className="print-field-value">{fill(data.tenantPhone)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">رقم وتاريخ هوية الاحوال المدنية :</span><strong className="print-field-value">{fill(data.tenantIdNumber)}</strong></div>
          </div>
          <div className="print-sig-box" />
        </div>
        <div className="rent-print-sig-col">
          <p className="rent-print-sig-title">المؤجر</p>
          <div className="rent-print-sig-fields">
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">الاسم الكامل :</span><strong className="print-field-value">{fill(data.landlordFullName || data.sellerName)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">عنوان المسكن الدائم :</span><strong className="print-field-value">{fill(data.landlordAddress)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">رقم الهاتف :</span><strong className="print-field-value">{fill(data.landlordPhone)}</strong></div>
            <div className="rent-print-sig-row"><span className="rent-print-sig-label">رقم وتاريخ هوية الاحوال المدنية :</span><strong className="print-field-value">{fill(data.landlordIdNumber)}</strong></div>
          </div>
          <div className="print-sig-box" />
        </div>
      </div>
    </>
  );
}

export function SaleContractBody({ data }) {
  return (
    <>
      <div className="print-brand-row" dir="ltr">
        <img src="/al-kawthar-logo.png" alt="Al-Kawthar Logo" className="print-brand-logo" />
      </div>
      <h1 className="official-title">عقد بيع</h1>

      <div className="print-parties-grid">
        <span className="print-parties-label">الفريق الأول البائع السيد:</span>
        <strong className="print-parties-value">{fill(data.partyOneSeller || data.sellerName)}</strong>
        <span className="print-parties-label">الساكن:</span>
        <strong className="print-parties-value">{fill(data.sellerCity)}</strong>
        <span className="print-parties-label">رقم الهاتف:</span>
        <strong className="print-parties-value">{fill(data.sellerProfession)}</strong>
        <span className="print-parties-label">الفريق الثاني المشتري السيد:</span>
        <strong className="print-parties-value">{fill(data.partyTwoBuyer || data.buyerName)}</strong>
        <span className="print-parties-label">الساكن:</span>
        <strong className="print-parties-value">{fill(data.buyerCity)}</strong>
        <span className="print-parties-label">رقم الهاتف:</span>
        <strong className="print-parties-value">{fill(data.buyerProfession)}</strong>
      </div>

      <p className="print-intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>

      <div className="print-clause">
        <p><strong>أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل في فيما يلي :</p>
        <div className="print-field-rows" dir="rtl">
          <span className="print-field-label">نوع الملك</span><strong className="print-field-value">{fill(data.propertyType)}</strong>
          <span className="print-field-label">الرقم والتسلسل</span><strong className="print-field-value">{fill(data.propertyNumber)}</strong>
          <span className="print-field-label">المحلة</span><strong className="print-field-value">{fill(data.mahala)}</strong>
        </div>
      </div>
      <div className="print-clause">
        <p><strong>ثانياً :</strong> ان بدل البيع المتفق عليه هو <strong className="print-inline-value">{fill(data.agreedPrice)}</strong></p>
        <p>ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره <strong className="print-inline-value">{fill(data.depositPaid)}</strong></p>
        <p>والباقي <strong className="print-inline-value">{fill(data.remainingAmount)}</strong></p>
        <p>واما باقي البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
      </div>
      <div className="print-clause"><p><strong>ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزما بأعادة العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدرها <strong className="print-inline-value">{fill(data.sellerPenalty)}</strong> ديناراً بدون حاجة الى إنذار رسمي</p></div>
      <div className="print-clause"><p><strong>رابعاً :</strong> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد بتأدية قصور البدل المبيع الى الفريق الأول عند اكماله المعامله والتقرير في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه يتعهد بتأدية تضمينات قدرها <strong className="print-inline-value">{fill(data.buyerPenalty)}</strong> ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون</p></div>
      <div className="print-clause"><p><strong>خامساً :</strong> يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء</p></div>
      <div className="print-clause"><p><strong>سادساً :</strong> ان جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق <strong className="print-inline-value">{fill(data.feesOnParty)}</strong></p></div>
      <div className="print-clause"><p><strong>سابعاً :</strong> اما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك هي في عهدة الفريق <strong className="print-inline-value">{fill(data.taxFeesOnParty)}</strong></p></div>
      <div className="print-clause"><p><strong>ثامناً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ( <strong className="print-inline-value">{fill(data.brokerFeePercent)}</strong> % ) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة. واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية ضعفي الدلالة المذكورة اعلاه كما انه في حالة تراضي بين الفريقين وقوع تراضي على ابطال هذا العقد فأنهما يكونان ملزمين بتأديتهما الدلاليه المذكورة مهما بلغت.</p></div>

      <p className="print-closing">فبناء على حصول التراضي والايجاب والقبول حرر هذا العقد.</p>
      <p className="print-date">البصرة في تاريخ <strong className="print-inline-value">{fillDate(data.contractYear || data.contractDate)}</strong></p>

      {data.extraClauses && (
        <div className="print-extra">
          <h3>ملاحظات إضافية</h3>
          <p style={{ whiteSpace: "pre-wrap", minHeight: "2.5em" }}>{data.extraClauses.trim() || "................"}</p>
        </div>
      )}

      <div className="print-sigs">
        <div className="print-sig-col"><p className="print-sig-role">الفريق الأول</p><div className="print-sig-box" /></div>
        <div className="print-sig-col"><p className="print-sig-role">الفريق الثاني</p><div className="print-sig-box" /></div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   Inline editable input
══════════════════════════════════════════════ */
function B({ name, size = "md", value, onChange, type = "text" }) {
  const isDate = type === "date";
  return (
    <input
      className={`sc-blank sc-blank--${size}`}
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      dir={isDate ? "ltr" : "rtl"}
      {...(isDate ? {} : { inputMode: "text" })}
    />
  );
}

/* ══════════════════════════════════════════════
   Sale contract sheet — editable version
══════════════════════════════════════════════ */
function SaleEditSheet({ form, onChange }) {
  return (
    <div className="cp-sheet cv-edit-sheet" dir="rtl">
      <div className="cp-outer-border">
        <div className="cp-inner-border">

          <div className="cp-header">
            <div className="cp-header-meta">
              <span className="cp-header-city">البصرة</span>
              <span className="cp-header-date cv-header-date-field">
                التاريخ :
                <B type="date" name="contractYear" size="md" value={form.contractYear ?? form.contractDate} onChange={onChange} />
              </span>
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

          <div className="cp-content">

            <div className="cp-parties-wrap">
              <div className="cp-party-box">
                <div className="cp-party-head">الفريق الأول — البائع</div>
                <div className="cp-party-fields">
                  <span className="cp-pl">الاسم :</span>
                  <B name="partyOneSeller" size="lg" value={form.partyOneSeller ?? form.sellerName} onChange={onChange} />
                  <span className="cp-pl">السكن :</span>
                  <B name="sellerCity" size="lg" value={form.sellerCity} onChange={onChange} />
                  <span className="cp-pl">رقم الهاتف :</span>
                  <B name="sellerProfession" size="lg" value={form.sellerProfession} onChange={onChange} />
                </div>
              </div>
              <div className="cp-parties-vdivider" />
              <div className="cp-party-box">
                <div className="cp-party-head">الفريق الثاني — المشتري</div>
                <div className="cp-party-fields">
                  <span className="cp-pl">الاسم :</span>
                  <B name="partyTwoBuyer" size="lg" value={form.partyTwoBuyer ?? form.buyerName} onChange={onChange} />
                  <span className="cp-pl">السكن :</span>
                  <B name="buyerCity" size="lg" value={form.buyerCity} onChange={onChange} />
                  <span className="cp-pl">رقم الهاتف :</span>
                  <B name="buyerProfession" size="lg" value={form.buyerProfession} onChange={onChange} />
                </div>
              </div>
            </div>

            <p className="cp-intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>

            <div className="cp-clauses">

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p><strong className="cp-clause-lead">أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل في فيما يلي :</p>
                  <div className="cp-prop-grid">
                    <span className="cp-prop-label">نوع الملك</span>
                    <B name="propertyType" size="lg" value={form.propertyType} onChange={onChange} />
                    <span className="cp-prop-label">الرقم والتسلسل</span>
                    <B name="propertyNumber" size="lg" value={form.propertyNumber} onChange={onChange} />
                    <span className="cp-prop-label">المحلة</span>
                    <B name="mahala" size="lg" value={form.mahala} onChange={onChange} />
                  </div>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">ثانياً :</strong>{" "}ان بدل البيع المتفق عليه هو{" "}
                    <B name="agreedPrice" size="lg" value={form.agreedPrice} onChange={onChange} />
                  </p>
                  <p>
                    ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره{" "}
                    <B name="depositPaid" size="lg" value={form.depositPaid} onChange={onChange} />
                  </p>
                  <p>
                    والباقي{" "}
                    <B name="remainingAmount" size="lg" value={form.remainingAmount} onChange={onChange} />
                  </p>
                  <p>واما باقي البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">ثالثاً :</strong>{" "}اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزما بأعادة
                    العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدرها{" "}
                    <B name="sellerPenalty" size="md" value={form.sellerPenalty} onChange={onChange} />{" "}
                    ديناراً بدون حاجة الى إنذار رسمي
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">رابعاً :</strong>{" "}يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
                    بتأدية قصور البدل المبيع الى الفريق الأول عند اكماله المعامله والتقرير
                    في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
                    يتعهد بتأدية تضمينات قدرها{" "}
                    <B name="buyerPenalty" size="md" value={form.buyerPenalty} onChange={onChange} />{" "}
                    ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">خامساً :</strong>{" "}
                    يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">سادساً :</strong>{" "}ان جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق{" "}
                    <B name="feesOnParty" size="md" value={form.feesOnParty} onChange={onChange} />
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">سابعاً :</strong>{" "}اما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
                    هي في عهدة الفريق{" "}
                    <B name="taxFeesOnParty" size="md" value={form.taxFeesOnParty} onChange={onChange} />
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">ثامناً :</strong>{" "}يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ({" "}
                    <B name="brokerFeePercent" size="sm" value={form.brokerFeePercent} onChange={onChange} />
                    {" "}% ) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.
                    واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية ضعفي الدلالة
                    المذكورة اعلاه كما انه في حالة تراضي بين الفريقين وقوع تراضي على ابطال
                    هذا العقد فأنهما يكونان ملزمين بتأديتهما الدلاليه المذكورة مهما بلغت.
                  </p>
                </div>
              </div>

            </div>

            <p className="cp-closing">فبناء على حصول التراضي والإيجاب والقبول حرر هذا العقد.</p>

            <div className="cp-extra">
              <p className="cp-extra-title">ملاحظات إضافية</p>
              <textarea
                className="sc-blank-area cp-extra-textarea"
                name="extraClauses"
                value={form.extraClauses ?? ""}
                onChange={onChange}
                rows={3}
                dir="rtl"
                placeholder="ملاحظات إضافية..."
              />
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
  );
}

/* ══════════════════════════════════════════════
   Rent contract sheet — editable version
══════════════════════════════════════════════ */
function RentEditSheet({ form, onChange }) {
  return (
    <div className="cp-sheet cv-edit-sheet" dir="rtl">
      <div className="cp-outer-border">
        <div className="cp-inner-border">

          <div className="cp-header">
            <div className="cp-header-meta">
              <span className="cp-header-city">البصرة</span>
              <span className="cp-header-date cv-header-date-field">
                التاريخ :
                <B type="date" name="contractDate" size="md" value={form.contractDate} onChange={onChange} />
              </span>
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

          <div className="cp-content">

            <div className="cp-rent-grid">
              <span className="cp-rent-label">تسلسل العقار :</span>
              <div className="cp-rent-cell">
                <B name="propertySerial" size="md" value={form.propertySerial} onChange={onChange} />
              </div>

              <span className="cp-rent-label">نوع أستعمال المأجور :</span>
              <div className="cp-rent-cell">
                <B name="propertyType" size="lg" value={form.propertyType} onChange={onChange} />
              </div>

              <span className="cp-rent-label">مدة الإيجار :</span>
              <div className="cp-rent-cell" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span>من</span>
                <B type="date" name="rentFromDate" size="md" value={form.rentFromDate} onChange={onChange} />
                <span>لغاية</span>
                <B type="date" name="rentToDate" size="md" value={form.rentToDate} onChange={onChange} />
              </div>

              <span className="cp-rent-label">بدل الإيجار :</span>
              <div className="cp-rent-cell" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <B name="rentAmount" size="lg" value={form.rentAmount} onChange={onChange} />
                <span>دينار فقط</span>
              </div>

              <span className="cp-rent-label">يدفع مقدماً كل :</span>
              <div className="cp-rent-cell">
                <B name="paymentPeriod" size="md" value={form.paymentPeriod} onChange={onChange} />
              </div>

              <span className="cp-rent-label">المؤجر :</span>
              <div className="cp-rent-cell">
                <B name="landlordName" size="lg" value={form.landlordName ?? form.sellerName} onChange={onChange} />
              </div>

              <span className="cp-rent-label">المستأجر :</span>
              <div className="cp-rent-cell">
                <B name="tenantName" size="lg" value={form.tenantName ?? form.buyerName} onChange={onChange} />
              </div>
            </div>

            <p className="cp-intro"><strong>واتفقا على ما يأتي :</strong></p>

            <div className="cp-clauses">
              <div className="cp-clause"><div className="cp-clause-body"><p><strong className="cp-clause-lead">أولاً :</strong> لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة إعلانه أو يغير شيئاً من المأجور دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.</p></div></div>
              <div className="cp-clause"><div className="cp-clause-body"><p><strong className="cp-clause-lead">ثانياً :</strong> اذا تأخر المستأجر عن دفع الاجرة المتفق عليها أو قسط من أقساطها عند الاستحقاق وأظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد هذا العقد باطلاً وملغياً وعلى المستأجر ترك المأجور وإخلاءه حالاً مراعاة لهذا الشرط ولا حاجة للإنذار الرسمي.</p></div></div>
              <div className="cp-clause"><div className="cp-clause-body"><p><strong className="cp-clause-lead">ثالثاً :</strong> اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الإيجار واشغله من دون مسوغ قانوني ومن دون أن يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على نفسه بتسليم الاجرة ضعف الإيجار المذكور أعلاه للمدة التي تمضي بعد انتهاء مدة هذا العقد الى حين تخلية المأجور ولا حاجة للإنذار الرسمي الى المستأجر بهذا الخصوص بل إن انقضاء المدة المعينة تعد بمقام الإنذار.</p></div></div>
              <div className="cp-clause"><div className="cp-clause-body"><p><strong className="cp-clause-lead">رابعاً :</strong> تكون الضريبة على المؤجر أما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء والكهرباء فتكون على المستأجر.</p></div></div>
              <div className="cp-clause"><div className="cp-clause-body"><p><strong className="cp-clause-lead">خامساً :</strong> لا يجوز للمستأجر تغيير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية الفورية.</p></div></div>
            </div>

            <div className="cp-extra">
              <p className="cp-extra-title">ملاحظات إضافية</p>
              <textarea
                className="sc-blank-area cp-extra-textarea"
                name="extraClauses"
                value={form.extraClauses ?? ""}
                onChange={onChange}
                rows={3}
                dir="rtl"
                placeholder="ملاحظات إضافية..."
              />
            </div>

            <div className="cp-rent-sigs">
              <div className="cp-rent-sig-col">
                <div className="cp-rent-sig-head">المستأجر</div>
                <div className="cp-rent-sig-fields">
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">الاسم الكامل :</span>
                    <B name="tenantFullName" size="lg" value={form.tenantFullName ?? form.buyerName} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                    <B name="tenantAddress" size="lg" value={form.tenantAddress} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم الهاتف :</span>
                    <B name="tenantPhone" size="md" value={form.tenantPhone} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                    <B name="tenantIdNumber" size="lg" value={form.tenantIdNumber} onChange={onChange} />
                  </div>
                </div>
                <div className="cp-sig-box" />
              </div>
              <div className="cp-rent-sig-col">
                <div className="cp-rent-sig-head">المؤجر</div>
                <div className="cp-rent-sig-fields">
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">الاسم الكامل :</span>
                    <B name="landlordFullName" size="lg" value={form.landlordFullName ?? form.sellerName} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                    <B name="landlordAddress" size="lg" value={form.landlordAddress} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم الهاتف :</span>
                    <B name="landlordPhone" size="md" value={form.landlordPhone} onChange={onChange} />
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                    <B name="landlordIdNumber" size="lg" value={form.landlordIdNumber} onChange={onChange} />
                  </div>
                </div>
                <div className="cp-sig-box" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const GENERIC_ERROR = "تعذر إتمام العملية. حاول مرة أخرى.";

/* ══════════════════════════════════════════════
   Main editable ContractView page
══════════════════════════════════════════════ */
export default function ContractView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [originalForm, setOriginalForm] = useState({});
  const [contractType, setContractType] = useState("عقد إيجار");
  const [status, setStatus] = useState("مسودة");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });

  const showToast = (message, variant = "success") =>
    setToast({ open: true, message, variant });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const raw = await getContractById(id);
        const data = raw?.contract || raw?.data || raw || {};
        // All detailed fields are stored inside data.details on the backend.
        // Flatten them so every field is directly accessible on form.
        const details = (typeof data.details === "object" && data.details !== null)
          ? data.details
          : {};
        const flatData = { ...data, ...details };
        setForm(flatData);
        setOriginalForm(flatData);
        setIsDirty(false);
        setContractType(data.type || "عقد إيجار");
        const rawStatus = String(data.status || "").toLowerCase();
        setStatus(rawStatus === "confirmed" ? "مؤكد" : data.status === "مؤكد" ? "مؤكد" : "مسودة");
      } catch {
        setFetchError("تعذر تحميل بيانات العقد. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      const dirty = Object.keys({ ...originalForm, ...updated }).some(
        (k) => (updated[k] ?? "") !== (originalForm[k] ?? "")
      );
      setIsDirty(dirty);
      return updated;
    });
  };

  const buildPayload = () => {
    const isRentType = contractType === "عقد إيجار";
    const sellerName = isRentType
      ? (form.landlordName || form.landlordFullName || form.sellerName || "").trim()
      : (form.partyOneSeller || form.sellerName || "").trim();
    const buyerName = isRentType
      ? (form.tenantName || form.tenantFullName || form.buyerName || "").trim()
      : (form.partyTwoBuyer || form.buyerName || "").trim();
    return {
      sellerName,
      buyerName,
      type: contractType,
      contractDate: form.contractDate || form.contractYear || undefined,
      details: { ...form },
    };
  };

  const handleSave = async () => {
    closeToast();
    try {
      await updateContract(id, buildPayload());
      setOriginalForm({ ...form });
      setIsDirty(false);
      showToast("تم حفظ التعديلات بنجاح", "success");
    } catch {
      showToast(GENERIC_ERROR, "error");
    }
  };

  const handleConfirm = async () => {
    closeToast();
    try {
      await updateContract(id, buildPayload());
      await confirmContract(id);
      setOriginalForm({ ...form });
      setIsDirty(false);
      setStatus("مؤكد");
      showToast("تم تأكيد العقد بنجاح", "success");
    } catch {
      showToast(GENERIC_ERROR, "error");
    }
  };

  const handleRevert = async () => {
    closeToast();
    try {
      await revertContract(id);
      setStatus("مسودة");
      showToast("تم إرجاع العقد إلى مسودة", "success");
    } catch {
      showToast(GENERIC_ERROR, "error");
    }
  };

  const handlePrint = () => {
    const isRentType = contractType === "عقد إيجار";
    if (isRentType) {
      localStorage.setItem("rentContractDraft", JSON.stringify(form));
      localStorage.setItem("rentContractStatus", status);
      navigate("/rent-contract/print");
    } else {
      localStorage.setItem("saleContractDraft", JSON.stringify(form));
      localStorage.setItem("saleContractStatus", status);
      navigate("/sale-contract/print");
    }
  };

  const isRent = contractType === "عقد إيجار";
  const isConfirmed = status === "مؤكد";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="sc-page">
        <div className="sc-inner">
          <div className="sc-contract-doc" dir="rtl">
            <div className="sc-contract-toolbar" dir="rtl">
              <div className="sc-toolbar-start">
                <button type="button" className="sc-toolbar-back" onClick={() => navigate("/archive")}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/><path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  رجوع
                </button>
              </div>
            </div>
            <div className="cv-loading" style={{ padding: "80px 0" }}>
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" className="cv-spinner">
                <circle cx="14" cy="14" r="11" stroke="var(--ak-gold-soft)" strokeWidth="2.5"/>
                <path d="M14 3a11 11 0 0 1 11 11" stroke="var(--ak-gold)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>جارٍ تحميل العقد...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Fetch error ── */
  if (fetchError) {
    return (
      <div className="sc-page">
        <div className="sc-inner">
          <div className="sc-contract-doc" dir="rtl">
            <div className="sc-contract-toolbar" dir="rtl">
              <div className="sc-toolbar-start">
                <button type="button" className="sc-toolbar-back" onClick={() => navigate("/archive")}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/><path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  رجوع
                </button>
              </div>
            </div>
            <p style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>{fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-page">

      {/* مباني يسار */}
      <svg className="db-buildings db-buildings--left" viewBox="0 0 340 520" fill="none" aria-hidden="true">
        <rect x="20" y="60" width="38" height="460" rx="3" fill="rgba(200,169,126,0.13)"/>
        <rect x="70" y="140" width="72" height="380" rx="4" fill="rgba(200,169,126,0.16)"/>
        <polygon points="106,110 70,140 142,140" fill="rgba(200,169,126,0.18)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(200,169,126,0.32)" strokeWidth="2.5"/>
        <rect x="155" y="260" width="50" height="260" rx="3" fill="rgba(200,169,126,0.12)"/>
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(200,169,126,0.10)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(200,169,126,0.13)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(200,169,126,0.12)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      {/* مباني يمين */}
      <svg className="db-buildings db-buildings--right" viewBox="0 0 340 520" fill="none" aria-hidden="true">
        <rect x="282" y="80" width="40" height="440" rx="3" fill="rgba(200,169,126,0.12)"/>
        <rect x="198" y="150" width="76" height="370" rx="4" fill="rgba(200,169,126,0.15)"/>
        <polygon points="236,115 198,150 274,150" fill="rgba(200,169,126,0.17)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(200,169,126,0.30)" strokeWidth="2.5"/>
        <rect x="130" y="280" width="54" height="240" rx="3" fill="rgba(200,169,126,0.11)"/>
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(200,169,126,0.12)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(200,169,126,0.11)"/>
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
                onClick={() => navigate("/archive")}
                aria-label="رجوع"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                  <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                رجوع
              </button>
              <h1 className="sc-toolbar-contract-type">{contractType}</h1>
            </div>

            <div className="sc-toolbar-actions">
              {isDirty && (
                <button type="button" className="sc-tbtn sc-tbtn--save" onClick={handleSave}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2h9l3 3v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M11 2v4H4V2M5 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  حفظ التعديلات
                </button>
              )}

              {/* {isConfirmed ? (
                <button type="button" className="sc-tbtn sc-tbtn--ghost" onClick={handleRevert}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8a5 5 0 1 1 1.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M3 4v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  إرجاع لمسودة
                </button>
              ) : null} */}
              {/* {isConfirmed ? null : (
                <button type="button" className="sc-tbtn sc-tbtn--ghost" onClick={handleConfirm}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  تأكيد العقد
                </button>
              )} */}

              <button type="button" className="sc-tbtn sc-tbtn--primary" onClick={handlePrint}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
                طباعة
              </button>
            </div>

            {/* <span className={`sc-status-badge ${isConfirmed ? "sc-status-badge--confirmed" : ""}`}>
              {status}
            </span> */}
            <ThemeToggle />
          </div>

          <Toast open={toast.open} message={toast.message} variant={toast.variant} onClose={closeToast} />

          {/* ── ورقة العقد ── */}
          {isRent
            ? <RentEditSheet form={form} onChange={handleChange} />
            : <SaleEditSheet form={form} onChange={handleChange} />
          }

        </div>
      </div>
    </div>
  );
}
