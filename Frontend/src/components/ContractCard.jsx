export default function ContractCard({ contract }) {
  return (
    <div className="contract-card">
      <h3>{contract.type}</h3>
      <p>البائع / المؤجر: {contract.sellerName}</p>
      <p>المشتري / المستأجر: {contract.buyerName}</p>
      <p>التاريخ: {contract.date}</p>
      <p>الحالة: {contract.status}</p>

      <div className="card-actions">
        <button>عرض</button>
        <button className="secondary-btn">طباعة</button>
      </div>
    </div>
  );
}