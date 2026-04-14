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

function wrapHtml(title, statusLine, inner, compact = false) {
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
    @page { size: A4; margin: 8mm; }
    body{font-family:'El Messiri','Segoe UI',Tahoma,sans-serif;direction:rtl;padding:20px;max-width:980px;margin:0 auto;
      line-height:1.65;color:#4a3a2a;font-size:14px;background:#f4f1ec}
    .sheet{background:#fff;border:1.8px solid #d6b68a;box-shadow:0 0 0 6px #f5efe5 inset;padding:22px 26px}
    h1{text-align:center;font-size:2rem;margin:2px 0 10px;color:#6d4f2f}
    .meta{color:#6d5c49;font-size:12px;text-align:center;margin-bottom:14px}
    .top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px}
    .tiny{font-size:12px;color:#7a6346}
    .tiny b{color:#5d4528}
    .brand{display:flex;align-items:center;gap:8px}
    .logo{width:34px;height:34px;object-fit:contain}
    .wmark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
    .wmark span{font-size:175px;color:rgba(198,166,124,0.06);font-weight:700;line-height:1;transform:translateY(24px)}
    .content{position:relative}
    .line{height:1px;background:#e3d2bb;margin:12px 0}
    .twocol{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .box{border-top:1px solid #e3d2bb;padding-top:8px}
    .party-title{font-weight:700;color:#6f4d2a;margin:4px 0 8px}
    .row{display:grid;grid-template-columns:120px 1fr;align-items:center;gap:8px;margin:6px 0}
    .dash{min-height:18px;border-bottom:1px solid #d8c0a0;padding:0 4px;color:#3c3024}
    .center-note{text-align:center;font-size:13px;margin:10px 0;color:#4c3c2c;font-weight:600}
    .cl{margin:8px 0;text-align:justify}
    .n{color:#6f4d2a;font-weight:700}
    .inline{display:inline-block;min-width:70px;border-bottom:1px solid #d8c0a0;padding:0 4px;text-align:center}
    .grid{display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:10px 18px;align-items:baseline;margin:14px 0}
    .lbl{font-weight:600}
    .clause{margin:18px 0}
    .intro{margin:16px 0}
    .extra{border-top:1px solid #e3d2bb;margin-top:18px;padding-top:10px}
    .extra pre{white-space:pre-wrap;margin:0;font-family:inherit}
    .sigs{display:flex;gap:32px;margin-top:20px;justify-content:space-between}
    .sig{flex:1;text-align:center}
    .sigbox{border-top:1px solid #d8c0a0;min-height:32px;margin-top:10px}
    .sheet--compact{padding:14px 16px}
    .sheet--compact h1{font-size:1.8rem;margin:0 0 4px}
    .sheet--compact .meta{font-size:11px;margin-bottom:8px}
    .sheet--compact .grid{gap:4px 10px;margin:6px 0}
    .sheet--compact .intro{margin:8px 0}
    .sheet--compact .clause{margin:8px 0}
    .sheet--compact p{margin:5px 0}
    .sheet--compact .extra{margin-top:10px;padding-top:6px}
    .sheet--compact .extra h3{margin:4px 0}
    .sheet--compact .sigs{gap:14px;margin-top:8px}
    .sheet--compact .sig p{margin:2px 0;font-size:12px}
    .sheet--compact .sigbox{min-height:16px;margin-top:4px}
    .sheet--compact .lbl{font-size:12px}
    .sheet--compact span{font-size:12px}
  </style>
</head>
<body>
  <div class="sheet ${compact ? "sheet--compact" : ""}">
    <p class="meta">${esc(statusLine)}</p>
    ${inner}
  </div>
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
  <div class="content" style="direction: rtl;">
    <div class="wmark"><span style="font-size:240px;">ك</span></div>
    <div class="top">
      <div class="tiny"><b>بسم الله الرحمن الرحيم</b><br/>مكتب الكوثر للعقارات</div>
      <div class="brand">
        <img class="logo" src="/logo-mark.png" alt="الكوثر"/>
      </div>
      <div class="tiny"><b>البصرة</b><br/>التاريخ: ${fillDate(form.contractYear)}</div>
    </div>
    <h1 style="font-size:2.35rem;">عقد بيع عقار</h1>
    <div class="line"></div>

    <div class="twocol">
      <div class="box">
        <p class="party-title">الفريق الأول</p>
        <div class="row"><span class="lbl">البائع السيد</span><span class="dash">${fill(form.partyOneSeller)}</span></div>
        <div class="row"><span class="lbl">الساكن</span><span class="dash">${fill(form.sellerCity)}</span></div>
        <div class="row"><span class="lbl">المهنة</span><span class="dash">${fill(form.sellerProfession)}</span></div>
      </div>
      <div class="box">
        <p class="party-title">الفريق الثاني</p>
        <div class="row"><span class="lbl">المشتري السيد</span><span class="dash">${fill(form.partyTwoBuyer)}</span></div>
        <div class="row"><span class="lbl">الساكن</span><span class="dash">${fill(form.buyerCity)}</span></div>
        <div class="row"><span class="lbl">المهنة</span><span class="dash">${fill(form.buyerProfession)}</span></div>
      </div>
    </div>

    <p class="center-note">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>
    <div class="line"></div>

    <p class="cl"><span class="n">أولاً :</span> يعترف الفريق الأول بأنه قد باع إلى الفريق الثاني الملك المفصل فيما يلي:<br/>
      نوع الملك <span class="inline">${fill(form.propertyType)}</span>
      الرقم والتسلسل <span class="inline">${fill(form.propertyNumber)}</span>
      المحلة <span class="inline">${fill(form.mahala)}</span>
    </p>

    <p class="cl"><span class="n">ثانياً :</span> إن بدل البيع المتفق عليه هو <span class="inline">${fill(form.agreedPrice)}</span>
      ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره <span class="inline">${fill(form.depositPaid)}</span>
      والباقي <span class="inline">${fill(form.remainingAmount)}</span>، وأما البدل فيقبض عند إكمال المعاملة والتقرير في دائرة العقاري.
    </p>

    <p class="cl"><span class="n">ثالثاً :</span> إذا امتنع الفريق الأول عن البيع بأية صورة كانت فإنه يكون ملزماً بإعادة العربون
      إلى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدرها <span class="inline">${fill(form.sellerPenalty)}</span> ديناراً
      بدون حاجة إلى إنذار رسمي.
    </p>

    <p class="cl"><span class="n">رابعاً :</span> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد بتأدية قصور البدل المبيع
      إلى الفريق الأول عند إكمال المعاملة والتقرير في دائرة التسجيل العقاري. وإذا نكل عن الشراء وتأدية قصور البدل فإنه يتعهد
      بتأدية تضمينات قدرها <span class="inline">${fill(form.buyerPenalty)}</span> ديناراً بدون حاجة إلى إنذار رسمي، وليس له الحق بمطالبة العربون.
    </p>

    <p class="cl"><span class="n">خامساً :</span> يحق للمشتري تسجيل العقار باسمه أو باسم من يشاء.</p>

    <p class="cl"><span class="n">سادساً :</span> إن جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق
      <span class="inline">${fill(form.feesOnParty)}</span>.
    </p>

    <p class="cl"><span class="n">سابعاً :</span> أما رسوم التملك والانتقال والإفراز والتوحيد والتصحيح وضريبة الملك فهي في عهدة الفريق
      <span class="inline">الأول</span>.
    </p>

    <p class="cl"><span class="n">ثامناً :</span> يتعهد الفريقان بأن يدفع كل واحد منهما دلالية قدرها
      (<span class="inline">${fill(form.brokerFeePercent)}</span> %) إلى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.
    </p>

    <p class="cl"><strong>فبناءً على حصول التراضي والإيجاب والقبول حرر هذا العقد.</strong><br/>
      البصرة في تاريخ <span class="inline">${fillDate(form.contractYear)}</span>
    </p>

    <div class="extra"><h3>ملاحظات إضافية</h3><pre>${esc(form.extraClauses?.trim() || "................")}</pre></div>
    <div class="line"></div>
    <div class="sigs">
      <div class="sig"><p><strong>الفريق الأول - البائع</strong></p><div class="sigbox"></div></div>
      <div class="sig"><p><strong>الفريق الثاني - المشتري</strong></p><div class="sigbox"></div></div>
    </div>
  </div>
  `;

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

  return wrapHtml("عقد إيجار", statusLine, inner, true);
}
