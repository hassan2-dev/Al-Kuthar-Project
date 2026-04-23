/** بناء مستند HTML لعقد البيع/الإيجار بنفس تصميم صفحة الطباعة (cp-sheet). */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fill(value) {
  const t = String(value ?? "").trim();
  return esc(t || "................");
}

function fillDate(iso) {
  const s = String(iso ?? "").trim();
  if (!s) return "................";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return esc(d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" }));
    }
  }
  return esc(s);
}

const SHARED_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    font-family: 'El Messiri', 'Segoe UI', Tahoma, sans-serif;
    direction: rtl;
    margin: 0;
    padding: 10px;
    background: #f4f1eb;
    color: #1a1005;
    font-size: 13px;
    line-height: 1.55;
  }
  .cp-sheet {
    max-width: 860px;
    margin: 0 auto;
    background: #fff;
    border: 3px double #c8a97e;
  }
  .cp-inner-border {
    margin: 6px 8px 8px;
    border: 1px solid rgba(200,169,126,0.42);
    position: relative;
  }
  .cp-watermark {
    position: absolute;
    left: 50%; top: 46%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    background: url("/al-kawthar-logo.png") center center / contain no-repeat;
    opacity: 0.055;
    pointer-events: none;
    z-index: 0;
  }
  .cp-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    direction: rtl;
    background: #faf7f0;
    padding: 10px 20px 10px;
    border-bottom: 2.5px solid #c8a97e;
    position: relative;
    z-index: 1;
  }
  .cp-header-meta {
    flex-shrink: 0;
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    direction: rtl;
    text-align: right;
  }
  .cp-header-city {
    font-size: 15px;
    font-weight: 800;
    color: #1a1005;
  }
  .cp-header-date {
    font-size: 11.5px;
    color: #a07828;
    font-weight: 600;
    line-height: 1.55;
  }
  .cp-header-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 7px;
  }
  .cp-bismillah {
    font-size: 12.5px;
    font-weight: 600;
    color: #a07828;
    margin: 0;
  }
  .cp-title-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: center;
    width: 100%;
  }
  .cp-title-orn {
    flex: 1;
    max-width: 72px;
    height: 1px;
    background: linear-gradient(to left, transparent, #c8a97e);
  }
  .cp-title-orn-rev {
    background: linear-gradient(to right, transparent, #c8a97e);
  }
  .cp-title {
    font-size: 26px;
    font-weight: 900;
    color: #1a1005;
    white-space: nowrap;
    margin: 0;
  }
  .cp-header-brand {
    flex-shrink: 0;
    width: 110px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .cp-logo-img {
    width: 98px;
    height: auto;
    max-height: 76px;
    object-fit: contain;
    display: block;
  }
  .cp-content {
    padding: 12px 20px 16px;
    position: relative;
    z-index: 1;
  }
  .cp-parties-wrap {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    align-items: stretch;
    margin-bottom: 10px;
    direction: rtl;
  }
  .cp-parties-vdivider {
    background: rgba(200,169,126,0.35);
  }
  .cp-party-head {
    font-size: 13px;
    font-weight: 700;
    color: #a07828;
    text-align: center;
    padding: 0 16px 8px;
    border-bottom: 1.5px solid rgba(200,169,126,0.45);
    margin-bottom: 2px;
  }
  .cp-party-fields {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 10px;
    row-gap: 10px;
    align-items: baseline;
    padding: 12px 16px 6px;
    direction: rtl;
  }
  .cp-pl {
    font-weight: 600;
    font-size: 12.5px;
    white-space: nowrap;
    color: #6b5230;
    text-align: right;
  }
  .cp-pv {
    font-size: 13px;
    font-weight: 600;
    color: #1a1005;
    border-bottom: 1px solid rgba(100,80,48,0.20);
    padding: 0 2px 3px;
    display: block;
    width: 100%;
  }
  .cp-intro {
    font-size: 13px;
    font-weight: 700;
    margin: 0 0 8px;
    text-align: center;
    color: #1a1005;
    direction: rtl;
    padding: 6px 0;
    border-top: 1px solid rgba(200,169,126,0.3);
    border-bottom: 1px solid rgba(200,169,126,0.3);
  }
  .cp-clauses {
    display: flex;
    flex-direction: column;
    direction: rtl;
  }
  .cp-clause {
    padding: 6px 0;
    font-size: 12.5px;
    line-height: 1.75;
    color: #1a1005;
    direction: rtl;
    border-bottom: 1px solid rgba(200,169,126,0.22);
  }
  .cp-clause:last-child { border-bottom: none; }
  .cp-clause-body p { margin: 0 0 3px; }
  .cp-clause-lead {
    color: #a07828;
    font-weight: 800;
    margin-left: 3px;
  }
  .cp-prop-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 14px;
    row-gap: 9px;
    margin: 10px 16px 4px;
    align-items: baseline;
    direction: rtl;
  }
  .cp-prop-label {
    font-weight: 600;
    font-size: 12.5px;
    white-space: nowrap;
    color: #6b5230;
    text-align: right;
  }
  .cp-prop-value {
    font-size: 13px;
    font-weight: 600;
    color: #1a1005;
    border-bottom: 1px solid rgba(100,80,48,0.20);
    padding: 0 2px 3px;
    display: block;
    min-width: 80px;
  }
  .cp-val {
    display: inline;
    font-weight: 700;
    color: #1a1005;
    border-bottom: 1px solid rgba(100,80,48,0.28);
    padding: 0 2px 2px;
  }
  .cp-closing {
    font-weight: 700;
    text-align: center;
    margin: 8px 0 3px;
    font-size: 13px;
    color: #1a1005;
  }
  .cp-date-line {
    font-size: 12.5px;
    margin: 2px 0 8px;
    color: #1a1005;
    direction: rtl;
    text-align: center;
  }
  .cp-extra {
    border-top: 1.5px solid rgba(200,169,126,0.4);
    padding: 8px 0 0;
    margin-top: 10px;
    direction: rtl;
  }
  .cp-extra-title {
    font-size: 13px;
    font-weight: 700;
    color: #a07828;
    margin: 0 0 8px;
  }
  .cp-extra-content {
    font-size: 13px;
    line-height: 2;
    white-space: pre-wrap;
    word-break: break-word;
    color: #1a1005;
    min-height: 2.5em;
    margin: 0;
  }
  .cp-sigs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1.5px solid rgba(200,169,126,0.4);
    direction: rtl;
  }
  .cp-sig-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cp-sig-head {
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    color: #a07828;
    padding: 0 0 8px;
    border-bottom: 1.5px solid rgba(200,169,126,0.4);
  }
  .cp-sig-box { flex: 1; min-height: 40px; }
  .cp-rent-grid {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: baseline;
    column-gap: 14px;
    row-gap: 5px;
    direction: rtl;
    margin-bottom: 10px;
    padding: 2px 0;
  }
  .cp-rent-label {
    font-weight: 600;
    white-space: nowrap;
    font-size: 13px;
    color: #6b5230;
    text-align: right;
  }
  .cp-rent-cell {
    font-size: 13px;
    font-weight: 600;
    color: #1a1005;
    border-bottom: 1px solid rgba(100,80,48,0.20);
    padding: 0 2px 3px;
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }
  .cp-rent-sigs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1.5px solid rgba(200,169,126,0.4);
    direction: rtl;
  }
  .cp-rent-sig-col { display: flex; flex-direction: column; }
  .cp-rent-sig-head {
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    color: #a07828;
    padding: 0 0 8px;
    border-bottom: 1.5px solid rgba(200,169,126,0.4);
    margin-bottom: 2px;
  }
  .cp-rent-sig-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 12px;
    direction: rtl;
    flex-wrap: wrap;
    padding: 4px 0;
    border-bottom: 1px solid rgba(200,169,126,0.15);
  }
  .cp-rent-sig-label {
    font-weight: 600;
    white-space: nowrap;
    color: #6b5230;
    flex-shrink: 0;
  }
  .cp-rent-sig-value {
    flex: 1;
    border-bottom: 1px solid rgba(100,80,48,0.20);
    padding: 0 2px 2px;
    font-weight: 600;
    color: #1a1005;
    display: block;
    min-width: 60px;
  }
`;

function wrapHtml(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
  <style>${SHARED_CSS}</style>
</head>
<body>
  ${bodyContent}
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
  const dateDisplay = fillDate(form.contractYear);

  const body = `
  <div class="cp-sheet" dir="rtl">
    <div class="cp-inner-border">
      <div class="cp-watermark"></div>

      <div class="cp-header">
        <div class="cp-header-meta">
          <span class="cp-header-city">البصرة</span>
          <span class="cp-header-date">التاريخ : ${dateDisplay}</span>
        </div>
        <div class="cp-header-center">
          <p class="cp-bismillah">بسم الله الرحمن الرحيم</p>
          <div class="cp-title-wrapper">
            <div class="cp-title-orn"></div>
            <h1 class="cp-title">عقد بيع عقار</h1>
            <div class="cp-title-orn cp-title-orn-rev"></div>
          </div>
        </div>
        <div class="cp-header-brand">
          <img src="/al-kawthar-logo.png" alt="Al-Kawthar" class="cp-logo-img"/>
        </div>
      </div>

      <div class="cp-content">

        <div class="cp-parties-wrap">
          <div class="cp-party-box">
            <div class="cp-party-head">الفريق الأول — البائع</div>
            <div class="cp-party-fields">
              <span class="cp-pl">الاسم :</span>
              <strong class="cp-pv">${fill(form.partyOneSeller)}</strong>
              <span class="cp-pl">السكن :</span>
              <strong class="cp-pv">${fill(form.sellerCity)}</strong>
              <span class="cp-pl">رقم الهاتف :</span>
              <strong class="cp-pv">${fill(form.sellerProfession)}</strong>
            </div>
          </div>
          <div class="cp-parties-vdivider"></div>
          <div class="cp-party-box">
            <div class="cp-party-head">الفريق الثاني — المشتري</div>
            <div class="cp-party-fields">
              <span class="cp-pl">الاسم :</span>
              <strong class="cp-pv">${fill(form.partyTwoBuyer)}</strong>
              <span class="cp-pl">السكن :</span>
              <strong class="cp-pv">${fill(form.buyerCity)}</strong>
              <span class="cp-pl">رقم الهاتف :</span>
              <strong class="cp-pv">${fill(form.buyerProfession)}</strong>
            </div>
          </div>
        </div>

        <p class="cp-intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>

        <div class="cp-clauses">

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل فيما يلي :</p>
              <div class="cp-prop-grid">
                <span class="cp-prop-label">نوع الملك</span>
                <strong class="cp-prop-value">${fill(form.propertyType)}</strong>
                <span class="cp-prop-label">الرقم والتسلسل</span>
                <strong class="cp-prop-value">${fill(form.propertyNumber)}</strong>
                <span class="cp-prop-label">المحلة</span>
                <strong class="cp-prop-value">${fill(form.mahala)}</strong>
              </div>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">ثانياً :</strong> إن بدل البيع المتفق عليه هو <strong class="cp-val">${fill(form.agreedPrice)}</strong></p>
              <p>ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره <strong class="cp-val">${fill(form.depositPaid)}</strong></p>
              <p>والباقي <strong class="cp-val">${fill(form.remainingAmount)}</strong></p>
              <p>وأما باقي البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزماً بإعادة
              العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدرها
              <strong class="cp-val">${fill(form.sellerPenalty)}</strong> ديناراً بدون حاجة الى إنذار رسمي.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">رابعاً :</strong> يعترف الفريق الثاني بأنه قد قبل الشراء بالشروط المذكورة أنفاً ويتعهد
              بتأدية قصور البدل المبيع الى الفريق الأول عند اكمال المعامله والتقرير
              في دائرة التسجيل العقاري. واذا نكل عن الشراء وتأدية قصور البدل فأنه
              يتعهد بتأدية تضمينات قدرها <strong class="cp-val">${fill(form.buyerPenalty)}</strong> ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">خامساً :</strong> يحق للمشتري تسجيل العقار بأسمه او بأسم من يشاء.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">سادساً :</strong> إن جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق <strong class="cp-val">${fill(form.feesOnParty)}</strong>.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">سابعاً :</strong> أما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
              هي في عهدة الفريق <strong class="cp-val">${fill(form.taxFeesOnParty)}</strong>.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">ثامناً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها
              (<strong class="cp-val">${fill(form.brokerFeePercent)}</strong> %) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.
              واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية ضعفي الدلالة
              المذكورة أعلاه كما أنه في حالة تراضي بين الفريقين على إبطال هذا العقد
              فأنهما يكونان ملزمين بتأديتهما الدلالية المذكورة مهما بلغت.</p>
            </div>
          </div>

        </div>

        <p class="cp-closing">فبناء على حصول التراضي والإيجاب والقبول حرر هذا العقد.</p>
        <p class="cp-date-line">البصرة في تاريخ <strong class="cp-val">${dateDisplay}</strong></p>

        <div class="cp-extra">
          <p class="cp-extra-title">ملاحظات إضافية</p>
          <p class="cp-extra-content">${esc(String(form.extraClauses ?? "").trim() || "................")}</p>
        </div>

        <div class="cp-sigs">
          <div class="cp-sig-col">
            <div class="cp-sig-head">الفريق الأول — البائع</div>
            <div class="cp-sig-box"></div>
          </div>
          <div class="cp-sig-col">
            <div class="cp-sig-head">الفريق الثاني — المشتري</div>
            <div class="cp-sig-box"></div>
          </div>
        </div>

      </div>
    </div>
  </div>`;

  return wrapHtml(`عقد بيع — ${docStatus} — ${contractId}`, body);
}

/**
 * @param {Record<string,string>} form
 * @param {string} contractId
 * @param {"مسودة"|"مؤكد"} docStatus
 * @returns {string} مستند HTML كامل
 */
export function buildRentContractArchiveHtml(form, contractId, docStatus) {
  const dateDisplay = fillDate(form.contractDate);
  const fromDate = fillDate(form.rentFromDate);
  const toDate = fillDate(form.rentToDate);

  const body = `
  <div class="cp-sheet" dir="rtl">
    <div class="cp-inner-border">
      <div class="cp-watermark"></div>

      <div class="cp-header">
        <div class="cp-header-meta">
          <span class="cp-header-city">البصرة</span>
          <span class="cp-header-date">التاريخ : ${dateDisplay}</span>
        </div>
        <div class="cp-header-center">
          <p class="cp-bismillah">بسم الله الرحمن الرحيم</p>
          <div class="cp-title-wrapper">
            <div class="cp-title-orn"></div>
            <h1 class="cp-title">عقد إيجار</h1>
            <div class="cp-title-orn cp-title-orn-rev"></div>
          </div>
        </div>
        <div class="cp-header-brand">
          <img src="/al-kawthar-logo.png" alt="Al-Kawthar" class="cp-logo-img"/>
        </div>
      </div>

      <div class="cp-content">

        <div class="cp-rent-grid">
          <span class="cp-rent-label">تسلسل العقار :</span>
          <div class="cp-rent-cell">${fill(form.propertySerial)}</div>

          <span class="cp-rent-label">نوع أستعمال المأجور :</span>
          <div class="cp-rent-cell">${fill(form.propertyType)}</div>

          <span class="cp-rent-label">مدة الإيجار :</span>
          <div class="cp-rent-cell">
            <span>من</span>
            <strong class="cp-val">${fromDate}</strong>
            <span>لغاية</span>
            <strong class="cp-val">${toDate}</strong>
          </div>

          <span class="cp-rent-label">بدل الإيجار :</span>
          <div class="cp-rent-cell">
            <strong class="cp-val">${fill(form.rentAmount)}</strong>
            <span>دينار فقط</span>
          </div>

          <span class="cp-rent-label">يدفع مقدماً كل :</span>
          <div class="cp-rent-cell">${fill(form.paymentPeriod)}</div>

          <span class="cp-rent-label">المؤجر :</span>
          <div class="cp-rent-cell">${fill(form.landlordName)}</div>

          <span class="cp-rent-label">المستأجر :</span>
          <div class="cp-rent-cell">${fill(form.tenantName)}</div>
        </div>

        <p class="cp-intro"><strong>واتفقا على ما يأتي :</strong></p>

        <div class="cp-clauses">

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">أولاً :</strong> لا يحق للمستأجر أن يقلع أو يعمر أو يثبت لوحة إعلانه أو يغير شيئاً من المأجور
              دون الحصول على موافقة المؤجر التحريرية واذا نقض هذا الشرط يتعهد المستأجر أن
              يدفع للمؤجر أي تعويض يعينه المؤجر بنفسه دون الحاجة إلى إخطار رسمي.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">ثانياً :</strong> اذا تأخر المستأجر عن دفع الاجرة المتفق عليها أو قسط من أقساطها عند الاستحقاق
              وأظهر المماطلة والمماهلة بهذا الشأن فيحق للمؤجر أن يؤجر المأجور لمن يريد ويعد
              هذا العقد باطلاً وملغياً وعلى المستأجر ترك المأجور وإخلاءه حالاً مراعاة لهذا
              الشرط ولا حاجة للإنذار الرسمي.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">ثالثاً :</strong> اذا تخامل المستأجر عن تخلية المأجور وتفريغه عند انتهاء مدة الإيجار واشغله من
              دون مسوغ قانوني ومن دون أن يجدد المقاولة مع المؤجر، فيتعهد المستأجر ويلزم على
              نفسه بتسليم الاجرة ضعف الإيجار المذكور أعلاه للمدة التي تمضي بعد انتهاء مدة
              هذا العقد الى حين تخلية المأجور ولا حاجة للإنذار الرسمي الى المستأجر بهذا
              الخصوص بل إن انقضاء المدة المعينة تعد بمقام الإنذار.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">رابعاً :</strong> تكون الضريبة على المؤجر أما رسم الحراسة وتنظيف المرافق الصحية ورسم الماء
              والكهرباء فتكون على المستأجر.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">خامساً :</strong> لا يجوز للمستأجر تغيير نوع مهنته حسب الاتفاق الأول عند التأجير الا بعد حصوله
              على موافقة المؤجر التحريرية وبعكسه يفسخ هذا العقد وللمؤجر الحق بطلب التخلية
              الفورية.</p>
            </div>
          </div>

          <div class="cp-clause">
            <div class="cp-clause-body">
              <p><strong class="cp-clause-lead">سادساً :</strong> يكون المأجور محل للتبليغ والتبلغ في حالة الدعاوي القضائية بين الطرفين.</p>
            </div>
          </div>

        </div>

        <div class="cp-extra">
          <p class="cp-extra-title">ملاحظات إضافية</p>
          <p class="cp-extra-content">${esc(String(form.extraClauses ?? "").trim() || "................")}</p>
        </div>

        <div class="cp-rent-sigs">
          <div class="cp-rent-sig-col">
            <div class="cp-rent-sig-head">المستأجر</div>
            <div class="cp-rent-sig-fields">
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">الاسم الكامل :</span>
                <strong class="cp-rent-sig-value">${fill(form.tenantFullName)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                <strong class="cp-rent-sig-value">${fill(form.tenantAddress)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">رقم الهاتف :</span>
                <strong class="cp-rent-sig-value">${fill(form.tenantPhone)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                <strong class="cp-rent-sig-value">${fill(form.tenantIdNumber)}</strong>
              </div>
            </div>
            <div class="cp-sig-box"></div>
          </div>
          <div class="cp-rent-sig-col">
            <div class="cp-rent-sig-head">المؤجر</div>
            <div class="cp-rent-sig-fields">
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">الاسم الكامل :</span>
                <strong class="cp-rent-sig-value">${fill(form.landlordFullName)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                <strong class="cp-rent-sig-value">${fill(form.landlordAddress)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">رقم الهاتف :</span>
                <strong class="cp-rent-sig-value">${fill(form.landlordPhone)}</strong>
              </div>
              <div class="cp-rent-sig-row">
                <span class="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                <strong class="cp-rent-sig-value">${fill(form.landlordIdNumber)}</strong>
              </div>
            </div>
            <div class="cp-sig-box"></div>
          </div>
        </div>

      </div>
    </div>
  </div>`;

  return wrapHtml(`عقد إيجار — ${docStatus} — ${contractId}`, body);
}
