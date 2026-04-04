import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function SaleContract() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    partyOneSeller: "",
    partyTwoBuyer: "",
    sellerName: "",
    sellerAddress: "",
    propertyType: "",
    propertyNumberSequence: "",
    mahala: "",
    agreedPrice: "",
    depositPaid: "",
    sellerPenalty: "",
    buyerName: "",
    buyerAddress: "",
    remainingAmount: "",
    buyerPenaltyPercent: "",
    feesOnParty: "",
    contractDay: "",
    contractMonth: "",
    contractYear: "",
    extraClause1: "",
    extraClause2: "",
    bottomName1: "",
    bottomName2: "",
    bottomAddress1: "",
    bottomAddress2: "",
    sellerSignature: "",
    buyerSignature: "",
    witness1: "",
    witness2: "",
  });

  const [status, setStatus] = useState("مسودة");

  useEffect(() => {
    const savedForm = localStorage.getItem("saleContractDraft");
    const savedStatus = localStorage.getItem("saleContractStatus");

    if (savedForm) setForm(JSON.parse(savedForm));
    if (savedStatus) setStatus(savedStatus);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
    localStorage.setItem("saleContractStatus", "مسودة");
    setStatus("مسودة");
    alert("تم حفظ العقد كمسودة");
  };

  const handleConfirm = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
    localStorage.setItem("saleContractStatus", "مؤكد");
    setStatus("مؤكد");
    alert("تم تأكيد العقد");
  };

  const handleGoToPrint = () => {
    localStorage.setItem("saleContractDraft", JSON.stringify(form));
    localStorage.setItem("saleContractStatus", status);
    navigate("/sale-contract/print");
  };

  return (
    <Layout title="عقد بيع">
      <div className="contract-editor">
        <section className="editor-panel">
          <div className="editor-header">
            <div>
              <h2>بيانات العقد</h2>
              <p>املئي الحقول ثم افتحي صفحة الطباعة المنفصلة.</p>
            </div>

            <div className="editor-actions">
              <button className="btn btn-primary" type="button" onClick={handleSaveDraft}>
                حفظ كمسودة
              </button>
              <button className="btn btn-muted" type="button" onClick={handleConfirm}>
                تأكيد
              </button>
              <button className="btn btn-muted" type="button" onClick={handleGoToPrint}>
                فتح صفحة الطباعة
              </button>
            </div>
          </div>

          <div className="editor-sections">
            <div className="editor-section">
              <h3>الأطراف</h3>
              <div className="form-grid">
                <input name="partyOneSeller" placeholder="الطرف الأول البائع" value={form.partyOneSeller} onChange={handleChange} />
                <input name="partyTwoBuyer" placeholder="الطرف الثاني المشتري" value={form.partyTwoBuyer} onChange={handleChange} />
                <input name="sellerName" placeholder="اسم البائع" value={form.sellerName} onChange={handleChange} />
                <input name="sellerAddress" placeholder="عنوان البائع" value={form.sellerAddress} onChange={handleChange} />
                <input name="buyerName" placeholder="اسم المشتري" value={form.buyerName} onChange={handleChange} />
                <input name="buyerAddress" placeholder="عنوان المشتري" value={form.buyerAddress} onChange={handleChange} />
              </div>
            </div>

            <div className="editor-section">
              <h3>بيانات الملك</h3>
              <div className="form-grid">
                <input name="propertyType" placeholder="نوع الملك" value={form.propertyType} onChange={handleChange} />
                <input name="propertyNumberSequence" placeholder="الرقم والتسلسل" value={form.propertyNumberSequence} onChange={handleChange} />
                <input name="mahala" placeholder="المحلة" value={form.mahala} onChange={handleChange} />
              </div>
            </div>

            <div className="editor-section">
              <h3>المبالغ والالتزامات</h3>
              <div className="form-grid">
                <input name="agreedPrice" placeholder="بدل البيع المتفق عليه" value={form.agreedPrice} onChange={handleChange} />
                <input name="depositPaid" placeholder="العربون المقبوض" value={form.depositPaid} onChange={handleChange} />
                <input name="sellerPenalty" placeholder="تضمينات المشتري عند نكول البائع" value={form.sellerPenalty} onChange={handleChange} />
                <input name="remainingAmount" placeholder="باقي المبلغ" value={form.remainingAmount} onChange={handleChange} />
                <input name="buyerPenaltyPercent" placeholder="نسبة تضمينات المشتري %" value={form.buyerPenaltyPercent} onChange={handleChange} />
                <input name="feesOnParty" placeholder="الرسوم بعهدة الطرف" value={form.feesOnParty} onChange={handleChange} />
              </div>
            </div>

            <div className="editor-section">
              <h3>تاريخ العقد</h3>
              <div className="form-grid three-cols">
                <input name="contractDay" placeholder="اليوم" value={form.contractDay} onChange={handleChange} />
                <input name="contractMonth" placeholder="الشهر" value={form.contractMonth} onChange={handleChange} />
                <input name="contractYear" placeholder="السنة" value={form.contractYear} onChange={handleChange} />
              </div>
            </div>

            <div className="editor-section">
              <h3>فقرات إضافية</h3>
              <div className="form-grid single-col">
                <textarea name="extraClause1" placeholder="الفقرة الإضافية الأولى" value={form.extraClause1} onChange={handleChange} rows="3" />
                <textarea name="extraClause2" placeholder="الفقرة الإضافية الثانية" value={form.extraClause2} onChange={handleChange} rows="3" />
              </div>
            </div>

            <div className="editor-section">
              <h3>التواقيع والشهود</h3>
              <div className="form-grid">
                <input name="bottomName1" placeholder="الاسم الأول" value={form.bottomName1} onChange={handleChange} />
                <input name="bottomName2" placeholder="الاسم الثاني" value={form.bottomName2} onChange={handleChange} />
                <input name="bottomAddress1" placeholder="العنوان الأول" value={form.bottomAddress1} onChange={handleChange} />
                <input name="bottomAddress2" placeholder="العنوان الثاني" value={form.bottomAddress2} onChange={handleChange} />
                <input name="sellerSignature" placeholder="توقيع البائع" value={form.sellerSignature} onChange={handleChange} />
                <input name="buyerSignature" placeholder="توقيع المشتري" value={form.buyerSignature} onChange={handleChange} />
                <input name="witness1" placeholder="الشاهد الأول" value={form.witness1} onChange={handleChange} />
                <input name="witness2" placeholder="الشاهد الثاني" value={form.witness2} onChange={handleChange} />
              </div>
            </div>
          </div>
        </section>

        <section className="preview-panel">
          <div className="preview-status">
            <span className="status-badge">{status}</span>
          </div>

          <div className="contract-sheet">
            <h2 className="sheet-title">عقد بيع وشراء</h2>
            <p>هذه معاينة سريعة فقط. صفحة الطباعة منفصلة.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}