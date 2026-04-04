import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout title="لوحة التحكم">
      <div className="dashboard-grid">
        <button className="action-card" onClick={() => navigate("/sale-contract")}>
          إنشاء عقد بيع
        </button>

        <button className="action-card" onClick={() => navigate("/rent-contract")}>
          إنشاء عقد إيجار
        </button>

        <button className="action-card" onClick={() => navigate("/archive")}>
          الأرشيف
        </button>
      </div>
    </Layout>
  );
}