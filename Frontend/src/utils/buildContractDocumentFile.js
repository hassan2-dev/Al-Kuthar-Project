/** بناء مستند HTML لعقد البيع/الإيجار (يُستخدم للطباعة الضمنية وتحويل PDF). */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fill(value) {
  const t = value?.trim();
  return esc(t || "................");
}

function fillDate(iso) {
  const s = iso?.trim();
  if (!s) return "................";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return esc(d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" }));
    }
  }
  return esc(s);
}

function wrapHtml(title, statusLine, inner) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    body{font-family:'El Messiri','Segoe UI',Tahoma,sans-serif;direction:rtl;padding:28px;max-width:920px;margin:0 auto;
      line-height:1.65;color:#1a1a1a;font-size:15px;background:#fff}
    h1{text-align:center;font-size:1.55rem;margin:0 0 8px}
    .meta{color:#555;font-size:13px;text-align:center;margin-bottom:22px}
    .grid{display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:10px 18px;align-items:baseline;margin:14px 0}
    .lbl{font-weight:600}
    .clause{margin:18px 0}
    .intro{margin:16px 0}
    .extra{border-top:1px solid #ddd;margin-top:22px;padding-top:14px}
    .extra pre{white-space:pre-wrap;margin:0;font-family:inherit}
    .sigs{display:flex;gap:32px;margin-top:28px;justify-content:space-between}
    .sig{flex:1;text-align:center}
    .sigbox{border:1px solid #ccc;min-height:80px;margin-top:8px;border-radius:6px}
  </style>
</head>
<body>
  <p class="meta">${esc(statusLine)}</p>
  ${inner}
</body>
</html>`;
}

/**
 * @param {Record<string,string>} form
 * @param {string} contractId
 * @param {"مسودة"|"مؤكد"} docStatus
 * @returns {string} مستند HTML كامل
 */
export function buildSaleContractArchiveHtml(form, contractId, docStatus) {
  const statusLine = `عقد بيع — ${docStatus} — معرّف: ${contractId}`;
  const inner = `
  <h1>عقد بيع</h1>
  <div class="grid">
    <span class="lbl">الفريق الأول البائع السيد:</span><span>${fill(form.partyOneSeller)}</span>
    <span class="lbl">الساكن:</span><span>${fill(form.sellerCity)}</span>
    <span class="lbl">المهنة:</span><span>${fill(form.sellerProfession)}</span>
    <span class="lbl">الفريق الثاني المشتري السيد:</span><span>${fill(form.partyTwoBuyer)}</span>
    <span class="lbl">الساكن:</span><span>${fill(form.buyerCity)}</span>
    <span class="lbl">المهنة:</span><span>${fill(form.buyerProfession)}</span>
  </div>
  <p class="intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>
  <div class="clause"><p><strong>أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل في فيما يلي :</p>
    <div class="grid">
      <span class="lbl">نوع الملك</span><span>${fill(form.propertyType)}</span>
      <span class="lbl">الرقم والتسلسل</span><span>${fill(form.propertyNumber)}</span>
      <span class="lbl">المحلة</span><span>${fill(form.mahala)}</span>
    </div>
  </div>
  <div class="clause">
    <p><strong>ثانياً :</strong> ان بدل البيع المتفق عليه هو <strong>${fill(form.agreedPrice)}</strong></p>
    <p>ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره <strong>${fill(form.depositPaid)}</strong></p>
    <p>والباقي <strong>${fill(form.remainingAmount)}</strong></p>
    <p>واما البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
  </div>
  <div class="clause"><p><strong>ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزما بأعادة
    العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدره <strong>${fill(form.sellerPenalty)}</strong> ديناراً بدون حاجة الى إنذار رسمي</p></div>
  <div class="clause"><p><strong>رابعاً :</strong> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
    بتأدية قصور البدل المبيع الى الفريق الأول عند اكماله المعامله والتقرير في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
    يتعهد بتأدية تضمينات قدرها <strong>${fill(form.buyerPenalty)}</strong> ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون</p></div>
  <div class="clause"><p><strong>خامساً :</strong> يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء.</p></div>
  <div class="clause"><p><strong>سادساً :</strong> ان جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق <strong>${fill(form.feesOnParty)}</strong></p></div>
  <div class="clause"><p><strong>سابعاً :</strong> اما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك هي في عهدة الفريق <strong>${fill(form.taxFeesOnParty)}</strong></p></div>
  <div class="clause"><p><strong>ثامناً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها (<strong>${fill(form.brokerFeePercent)}</strong> % ) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.</p></div>
  <p><strong>فبناء على حصول التراضي والايجاب والقبول حرر هذا العقد.</strong></p>
  <p>البصرة في تاريخ <strong>${fillDate(form.contractYear)}</strong></p>
  <div class="extra"><h3>ملاحظات إضافية</h3><pre>${esc(form.extraClauses?.trim() || "................")}</pre></div>
  <div class="sigs">
    <div class="sig"><p><strong>الفريق الأول</strong></p><div class="sigbox"></div></div>
    <div class="sig"><p><strong>الفريق الثاني</strong></p><div class="sigbox"></div></div>
  </div>`;

  return wrapHtml("عقد بيع", statusLine, inner);
}

/**
 * @param {Record<string,string>} form
 * @param {string} contractId
 * @param {"مسودة"|"مؤكد"} docStatus
 * @returns {string} مستند HTML كامل
 */
export function buildRentContractArchiveHtml(form, contractId, docStatus) {
  const statusLine = `عقد إيجار — ${docStatus} — معرّف: ${contractId}`;
  const inner = `
  <h1>(( عقد إيجار ))</h1>
  <div class="grid">
    <span class="lbl">تسلسل العقار :</span><span>${fill(form.propertySerial)}</span>
    <span class="lbl">التاريخ :</span><span>${fillDate(form.contractDate)}</span>
    <span class="lbl">نوع المأجور :</span><span>${fill(form.propertyType)}</span>
    <span class="lbl">مدة الإيجار من</span><span>${fillDate(form.rentFromDate)} — لغاية ${fillDate(form.rentToDate)}</span>
    <span class="lbl">بدل الإيجار :</span><span>${fill(form.rentAmount)} فقط</span>
    <span class="lbl">يدفع مقدماً كل :</span><span>${fill(form.paymentPeriod)}</span>
    <span class="lbl">المدعو بالمؤجر :</span><span>${fill(form.landlordName)}</span>
    <span class="lbl">المدعو بالمستأجر :</span><span>${fill(form.tenantName)}</span>
  </div>
  <p class="intro"><strong>واتفقا على ما يأتي :</strong></p>
  <div class="clause"><p><strong>أولاً :</strong> لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة اعلانه او يغير شيئاً من المأجور
    دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن
    يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.</p></div>
  <div class="clause"><p><strong>ثانياً :</strong> اذا تأخر المستأجر عن دفع الاجرة المتفق عليها او قسط من اقساطها عند الاستحقاق
    واظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد
    هذا العقد باطلاً وملغياً وعلى المستأجر ترك الماجور واخلاءه حالا مراعاة لهذا
    الشرط ولا حاجة للإنذار رسمي.</p></div>
  <div class="clause"><p><strong>ثالثاً :</strong> اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الايجار واشغله من
    دون مسوغ قانوني ومن دون ان يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على
    نفسه بتسليم الاجرة ضعف الايجار المذكور اعلاه للمدة التي تمضي بعد انتهاء مدة
    هذا العقد الى حين تخلية المأجور ولا حاجة للانذار الرسمي الى المستأجر بهذا
    الخصوص بل ان انقضاء المدة المعينة تعد بمقام الانذار ويعتبر انقضاء المدة بمقام
    الانذار ولا يسوغ للمستأجر أن يدافع عن نفسه بهذا الصدد بأن لم يسبق له الانذار
    أي الانذار القانوني.</p></div>
  <div class="clause"><p><strong>رابعاً :</strong> تكون الضريبة على المؤجر اما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء
    والكهرباء فتكون على المستأجر.</p></div>
  <div class="clause"><p><strong>خامساً :</strong> لا يجوز للمستأجر تغير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله
    على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية
    الفورية.</p></div>
  <div class="clause"><p><strong>سادساً :</strong> يكون المأجور محل للتبليغ و التبلغ في حالة الدعاوي القضائية بين الطرفين.</p></div>
  <div class="extra"><h3>ملاحظات إضافية</h3><pre>${esc(form.extraClauses?.trim() || "................")}</pre></div>
  <div class="sigs">
    <div class="sig">
      <p><strong>المستأجر</strong></p>
      <div class="grid" style="text-align:right">
        <span class="lbl">الاسم الكامل</span><span>${fill(form.tenantFullName)}</span>
        <span class="lbl">عنوان المسكن</span><span>${fill(form.tenantAddress)}</span>
        <span class="lbl">الهاتف</span><span>${fill(form.tenantPhone)}</span>
        <span class="lbl">الهوية</span><span>${fill(form.tenantIdNumber)}</span>
      </div>
      <div class="sigbox"></div>
    </div>
    <div class="sig">
      <p><strong>المؤجر</strong></p>
      <div class="grid" style="text-align:right">
        <span class="lbl">الاسم الكامل</span><span>${fill(form.landlordFullName)}</span>
        <span class="lbl">عنوان المسكن</span><span>${fill(form.landlordAddress)}</span>
        <span class="lbl">الهاتف</span><span>${fill(form.landlordPhone)}</span>
        <span class="lbl">الهوية</span><span>${fill(form.landlordIdNumber)}</span>
      </div>
      <div class="sigbox"></div>
    </div>
  </div>`;

  return wrapHtml("عقد إيجار", statusLine, inner);
}
