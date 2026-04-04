import Layout from "../components/Layout";
import ContractCard from "../components/ContractCard";
import { contracts } from "../data/contracts";

export default function Archive() {
  return (
    <Layout title="الأرشيف">
      <div className="filter-bar">
        <input type="text" placeholder="بحث بالاسم" />
        <input type="date" />
        <select>
          <option>كل الحالات</option>
          <option>مسودة</option>
          <option>مؤكد</option>
        </select>
      </div>

      <div className="contracts-grid">
        {contracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </Layout>
  );
}