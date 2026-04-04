import Layout from "../components/Layout";

export default function RentContract() {
  return (
    <Layout title="إنشاء عقد إيجار">
      <div className="form-card">
        <div className="form-grid">
          <input type="text" placeholder="اسم المؤجر" />
          <input type="text" placeholder="اسم المستأجر" />
          <input type="text" placeholder="العقار" />
          <input type="text" placeholder="بدل الإيجار" />
          <input type="date" />
        </div>

        <div className="form-actions">
          <button>حفظ كمسودة</button>
          <button className="secondary-btn">تأكيد</button>
          <button className="secondary-btn">طباعة</button>
        </div>
      </div>
    </Layout>
  );
}