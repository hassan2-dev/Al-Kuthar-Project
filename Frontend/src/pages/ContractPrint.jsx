import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContractById } from "../api/contractsApi";
import { fieldClass, isFieldFilled } from "../Prints/printFieldClass.js";

/* ── helpers ── */
const fill = (value) => String(value ?? "").trim() || "................";

const fillDate = (value) => {
  const s = String(value ?? "").trim();
  if (!s) return "................";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    if (!Number.isNaN(d.getTime()))
      return d.toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
  }
  return s;
};

/* ══════════════════════════════════════════
   Sale contract sheet
══════════════════════════════════════════ */
function SaleSheet({ data }) {
  return (
    <div className="cp-sheet" dir="rtl">
      <div className="cp-outer-border">
        <div className="cp-inner-border">

          <div className="cp-header">
            <div className="cp-header-meta">
              <span className="cp-header-city">البصرة</span>
              <span className="cp-header-date">التاريخ : {fillDate(data.contractYear || data.contractDate)}</span>
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
                  <strong className={fieldClass("cp-pv", data.partyOneSeller || data.sellerName)}>
                    {fill(data.partyOneSeller || data.sellerName)}
                  </strong>
                  <span className="cp-pl">السكن :</span>
                  <strong className={fieldClass("cp-pv", data.sellerCity)}>{fill(data.sellerCity)}</strong>
                  <span className="cp-pl">المهنة :</span>
                  <strong className={fieldClass("cp-pv", data.sellerProfession)}>{fill(data.sellerProfession)}</strong>
                </div>
              </div>
              <div className="cp-parties-vdivider" />
              <div className="cp-party-box">
                <div className="cp-party-head">الفريق الثاني — المشتري</div>
                <div className="cp-party-fields">
                  <span className="cp-pl">الاسم :</span>
                  <strong className={fieldClass("cp-pv", data.partyTwoBuyer || data.buyerName)}>
                    {fill(data.partyTwoBuyer || data.buyerName)}
                  </strong>
                  <span className="cp-pl">السكن :</span>
                  <strong className={fieldClass("cp-pv", data.buyerCity)}>{fill(data.buyerCity)}</strong>
                  <span className="cp-pl">المهنة :</span>
                  <strong className={fieldClass("cp-pv", data.buyerProfession)}>{fill(data.buyerProfession)}</strong>
                </div>
              </div>
            </div>

            <p className="cp-intro">لقد تم الاتفاق بين الفريقين على عقد هذه المقاولة بالشروط التالية :</p>

            <div className="cp-clauses">

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">أولاً :</strong> يعترف الفريق الأول بأنه قد باع الى الفريق الثاني الملك المفصل فيما يلي :
                  </p>
                  <div className="cp-prop-grid">
                    <span className="cp-prop-label">نوع الملك</span>
                    <strong className={fieldClass("cp-prop-value", data.propertyType)}>{fill(data.propertyType)}</strong>
                    <span className="cp-prop-label">الرقم والتسلسل</span>
                    <strong className={fieldClass("cp-prop-value", data.propertyNumber)}>{fill(data.propertyNumber)}</strong>
                    <span className="cp-prop-label">المحلة</span>
                    <strong className={fieldClass("cp-prop-value", data.mahala)}>{fill(data.mahala)}</strong>
                  </div>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">ثانياً :</strong> إن بدل البيع المتفق عليه هو{" "}
                    <strong className={fieldClass("cp-val", data.agreedPrice)}>{fill(data.agreedPrice)}</strong>
                  </p>
                  <p>
                    ويعترف الفريق الأول بأنه قد قبض من الفريق الثاني عربوناً قدره{" "}
                    <strong className={fieldClass("cp-val", data.depositPaid)}>{fill(data.depositPaid)}</strong>
                  </p>
                  <p>
                    والباقي{" "}
                    <strong className={fieldClass("cp-val", data.remainingAmount)}>{fill(data.remainingAmount)}</strong>
                  </p>
                  <p>وأما البدل فيقبضها عند اكمال المعامله والتقرير في دائرة العقاري ،</p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">ثالثاً :</strong> اذا امتنع الفريق الأول عن البيع بأية صورة كانت فانه يكون ملزماً بإعادة
                    العربون الى الفريق الثاني وما عدا ذلك يتعهد بتأدية تضمينات قدره{" "}
                    <strong className={fieldClass("cp-val", data.sellerPenalty)}>{fill(data.sellerPenalty)}</strong>{" "}
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
                    <strong className={fieldClass("cp-val", data.buyerPenalty)}>{fill(data.buyerPenalty)}</strong>{" "}
                    ديناراً بدون حاجة الى انذار رسمي وليس له الحق بمطالبته بالعربون
                    وإن الفريق الثاني له الحق أن يقرر الملك بأسم من يشاء.
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">خامساً :</strong> إن جميع الرسوم المقتضية للبيع وسائر المصاريف هي بعهدة الفريق{" "}
                    <strong className={fieldClass("cp-val", data.feesOnParty)}>{fill(data.feesOnParty)}</strong>.
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">سادساً :</strong> أما رسوم التملك والانتقال والافراز والتوحيد والتصحيح وضريبة الملك
                    هي في عهدة الفريق الأول.
                  </p>
                </div>
              </div>

              <div className="cp-clause">
                <div className="cp-clause-body">
                  <p>
                    <strong className="cp-clause-lead">سابعاً :</strong> يتعهد الفريقان بأن يدفع كل واحد منهما دلاليه قدرها ({" "}
                    <strong className={fieldClass("cp-val", data.brokerFeePercent)}>{fill(data.brokerFeePercent)}</strong>
                    {" "}%) الى الدلال الذي توسط بعقد البيع وبمجرد التوقيع على هذه المقاولة.
                    واذا نكل احد الفريقين عن تنفيذ شروط هذا العقد يتعهد بتأدية ضعفي الدلالة
                    المذكورة أعلاه كما أنه في حالة تراضي بين الفريقين على إبطال هذا العقد
                    فأنهما يكونان ملزمين بتأديتهما الدلالية المذكورة مهما بلغت.
                  </p>
                </div>
              </div>

            </div>

            <p className="cp-closing">فبناء على حصول التراضي والإيجاب والقبول حرر هذا العقد.</p>
            <p className="cp-date-line">
              البصرة في تاريخ{" "}
              <strong className={fieldClass("cp-val", data.contractYear || data.contractDate)}>
                {fillDate(data.contractYear || data.contractDate)}
              </strong>
            </p>

            <div className="cp-extra">
              <p className="cp-extra-title">ملاحظات إضافية</p>
              <p className="cp-extra-content">{data.extraClauses?.trim() || "................"}</p>
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

/* ══════════════════════════════════════════
   Rent contract sheet
══════════════════════════════════════════ */
function RentSheet({ data }) {
  return (
    <div className="cp-sheet" dir="rtl">
      <div className="cp-outer-border">
        <div className="cp-inner-border">

          <div className="cp-header">
            <div className="cp-header-meta">
              <span className="cp-header-city">البصرة</span>
              <span className="cp-header-date">التاريخ : {fillDate(data.contractDate)}</span>
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
              <span className={fieldClass("cp-rent-label", data.propertySerial)}>تسلسل العقار :</span>
              <div className={fieldClass("cp-rent-cell", data.propertySerial)}>{fill(data.propertySerial)}</div>

              <span className={fieldClass("cp-rent-label", data.propertyType)}>نوع المأجور :</span>
              <div className={fieldClass("cp-rent-cell", data.propertyType)}>{fill(data.propertyType)}</div>

              <span
                className={
                  isFieldFilled(data.rentFromDate) && isFieldFilled(data.rentToDate)
                    ? "cp-rent-label cp-field--filled"
                    : "cp-rent-label"
                }
              >
                مدة الإيجار :
              </span>
              <div
                className={
                  isFieldFilled(data.rentFromDate) && isFieldFilled(data.rentToDate)
                    ? "cp-rent-cell cp-field--filled"
                    : "cp-rent-cell"
                }
              >
                <span>من</span>
                <strong className={fieldClass("cp-val", data.rentFromDate)}>{fillDate(data.rentFromDate)}</strong>
                <span>لغاية</span>
                <strong className={fieldClass("cp-val", data.rentToDate)}>{fillDate(data.rentToDate)}</strong>
              </div>

              <span className={fieldClass("cp-rent-label", data.rentAmount)}>بدل الإيجار :</span>
              <div className={fieldClass("cp-rent-cell", data.rentAmount)}>
                <strong className={fieldClass("cp-val", data.rentAmount)}>{fill(data.rentAmount)}</strong>
                <span>دينار فقط</span>
              </div>

              <span className={fieldClass("cp-rent-label", data.paymentPeriod)}>يدفع مقدماً كل :</span>
              <div className={fieldClass("cp-rent-cell", data.paymentPeriod)}>{fill(data.paymentPeriod)}</div>

              <span className={fieldClass("cp-rent-label", data.landlordName || data.sellerName)}>المؤجر :</span>
              <div className={fieldClass("cp-rent-cell", data.landlordName || data.sellerName)}>
                {fill(data.landlordName || data.sellerName)}
              </div>

              <span className={fieldClass("cp-rent-label", data.tenantName || data.buyerName)}>المستأجر :</span>
              <div className={fieldClass("cp-rent-cell", data.tenantName || data.buyerName)}>
                {fill(data.tenantName || data.buyerName)}
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
              <p className="cp-extra-content">{data.extraClauses?.trim() || "................"}</p>
            </div>

            <div className="cp-rent-sigs">
              <div className="cp-rent-sig-col">
                <div className="cp-rent-sig-head">المستأجر</div>
                <div className="cp-rent-sig-fields">
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">الاسم الكامل :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.tenantFullName || data.buyerName)}>
                      {fill(data.tenantFullName || data.buyerName)}
                    </strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.tenantAddress)}>{fill(data.tenantAddress)}</strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.tenantPhone)}>{fill(data.tenantPhone)}</strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.tenantIdNumber)}>{fill(data.tenantIdNumber)}</strong>
                  </div>
                </div>
                <div className="cp-sig-box" />
              </div>
              <div className="cp-rent-sig-col">
                <div className="cp-rent-sig-head">المؤجر</div>
                <div className="cp-rent-sig-fields">
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">الاسم الكامل :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.landlordFullName || data.sellerName)}>
                      {fill(data.landlordFullName || data.sellerName)}
                    </strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">عنوان المسكن الدائم :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.landlordAddress)}>{fill(data.landlordAddress)}</strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم الهاتف :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.landlordPhone)}>{fill(data.landlordPhone)}</strong>
                  </div>
                  <div className="cp-rent-sig-row">
                    <span className="cp-rent-sig-label">رقم هوية الأحوال المدنية :</span>
                    <strong className={fieldClass("cp-rent-sig-value", data.landlordIdNumber)}>{fill(data.landlordIdNumber)}</strong>
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

/* ══════════════════════════════════════════
   Main page
══════════════════════════════════════════ */
export default function ContractPrint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("مسودة");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("print-contract-page");
    return () => document.body.classList.remove("print-contract-page");
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const raw = await getContractById(id);
        const contract = raw?.contract || raw?.data || raw || {};
        setData(contract);
        const rawStatus = String(contract.status || "").toLowerCase();
        setStatus(rawStatus === "confirmed" || contract.status === "مؤكد" ? "مؤكد" : "مسودة");
      } catch {
        setError("تعذر تحميل بيانات العقد. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* Auto-print once data is ready */
  useEffect(() => {
    if (!loading && data) {
      const t = setTimeout(() => window.print(), 120);
      return () => clearTimeout(t);
    }
  }, [loading, data]);

  const isRent = data?.type === "عقد إيجار";

  if (loading) {
    return (
      <div className="cp-page" dir="rtl">
        <div className="cp-toolbar no-print">
          <button type="button" className="sc-toolbar-back" onClick={() => navigate("/archive")}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
              <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            رجوع
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "60px 40px", fontFamily: "inherit" }}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="cv-spinner">
            <circle cx="14" cy="14" r="11" stroke="var(--ak-gold-soft)" strokeWidth="2.5" />
            <path d="M14 3a11 11 0 0 1 11 11" stroke="var(--ak-gold)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>جارٍ تحميل العقد...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="cp-page" dir="rtl">
        <div className="cp-toolbar no-print">
          <button type="button" className="sc-toolbar-back" onClick={() => navigate("/archive")}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
              <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            رجوع
          </button>
        </div>
        <p style={{ padding: "40px", color: "#dc2626", fontFamily: "inherit" }}>{error || "لا توجد بيانات للطباعة"}</p>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <div className="cp-toolbar no-print">
        <button
          type="button"
          className="sc-toolbar-back"
          onClick={() => navigate("/archive")}
          aria-label="رجوع إلى الأرشيف"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
            <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          رجوع
        </button>
        <div className="cp-toolbar-actions">
          <button type="button" onClick={() => window.print()} className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            طباعة
          </button>
          <span className={`sc-status-badge ${status === "مؤكد" ? "sc-status-badge--confirmed" : ""}`}>
            {status}
          </span>
        </div>
      </div>

      {isRent ? <RentSheet data={data} /> : <SaleSheet data={data} />}
    </div>
  );
}
