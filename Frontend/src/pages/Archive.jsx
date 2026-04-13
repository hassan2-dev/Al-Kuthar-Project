import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LogoutButton from "../components/LogoutButton";
import { listContracts } from "../api/contractsApi";
import { getDocumentDownloadUrl, listDocuments } from "../api/documentsApi";

const TYPE_ICONS = {
  "عقد بيع": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
  "عقد إيجار": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function ContractRow({ contract, onView, onDownloadPdf, isDownloadingPdf }) {
  const isConfirmed = contract.status === "مؤكد";
  const isSale = contract.type === "عقد بيع";

  return (
    <div className={`arc-card ${isSale ? "arc-card--sale" : "arc-card--rent"}`} dir="rtl">
      {/* Stacked paper layers behind */}
      <div className="arc-card-paper arc-card-paper--back" />
      <div className="arc-card-paper arc-card-paper--mid" />

      {/* Card body */}
      <div className="arc-card-body">
        {/* Inner content */}
        <div className="arc-card-inner">
          {/* Top: icon + status */}
          <div className="arc-card-top">
            <span className="arc-card-icon">{TYPE_ICONS[contract.type] ?? TYPE_ICONS["عقد بيع"]}</span>
            <span className={`arc-card-status ${isConfirmed ? "arc-card-status--confirmed" : "arc-card-status--draft"}`}>
              {contract.status}
            </span>
          </div>

          {/* Parties */}
          <div className="arc-card-parties">
            <span className="arc-card-party">{contract.sellerName || "—"}</span>
            <span className="arc-card-sep">·</span>
            <span className="arc-card-party">{contract.buyerName || "—"}</span>
          </div>

          {/* Title */}
          <h3 className="arc-card-title">{contract.type}</h3>

          {/* Date */}
          <div className="arc-card-date">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {contract.date}
          </div>
        </div>

        {/* Divider */}
        <div className="arc-card-divider" />

        {/* Actions */}
        <div className="arc-card-actions">
          <button
            type="button"
            className="arc-card-btn arc-card-btn--view"
            onClick={() => onView(contract)}
            aria-label="عرض العقد"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <ellipse cx="8" cy="8" rx="7" ry="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            عرض
          </button>
          <button
            type="button"
            className="arc-card-btn arc-card-btn--pdf"
            disabled={isDownloadingPdf}
            onClick={() => onDownloadPdf(contract)}
            aria-label="تحميل PDF"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6V2h8v4M4 12H2V7h12v5h-2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            {isDownloadingPdf ? "..." : "PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Archive() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [sortBy, setSortBy] = useState("date-desc");
  const [docLoadingId, setDocLoadingId] = useState(null);
  const [docError, setDocError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await listContracts({
          page: 1,
          limit: 100,
          sort: "createdAt",
          order: "desc",
        });

        const rawList = response?.items || response?.data || response?.contracts || [];
        const mapped = rawList.map((contract) => {
          const rawStatus = String(contract.status || "").toLowerCase();
          const created = new Date(contract.createdAt || contract.updatedAt || contract.date || Date.now());

          return {
            id: contract.id,
            sellerName: contract.sellerName || contract.seller_name || "",
            buyerName: contract.buyerName || contract.buyer_name || "",
            type: contract.type || "غير محدد",
            status: rawStatus === "confirmed" ? "مؤكد" : "مسودة",
            date: created.toLocaleDateString("ar-EG"),
            sortTime: created.getTime(),
          };
        });

        setContracts(mapped);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "تعذر تحميل قائمة العقود. حاول مرة أخرى.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...contracts];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.sellerName?.toLowerCase().includes(q) ||
          c.buyerName?.toLowerCase().includes(q) ||
          c.type?.toLowerCase().includes(q)
      );
    }
    if (filterType !== "الكل") list = list.filter((c) => c.type === filterType);
    if (filterStatus !== "الكل") list = list.filter((c) => c.status === filterStatus);
    list.sort((a, b) => {
      const ta = a.sortTime ?? 0;
      const tb = b.sortTime ?? 0;
      if (sortBy === "date-desc") return tb - ta;
      if (sortBy === "date-asc") return ta - tb;
      return 0;
    });
    return list;
  }, [contracts, search, filterType, filterStatus, sortBy]);

  const handleDownloadPdf = async (contract) => {
    setDocError("");
    setDocLoadingId(contract.id);
    try {
      const res = await listDocuments({ contractId: contract.id });
      const raw = res?.items ?? res?.documents ?? res?.data ?? res;
      const list = Array.isArray(raw) ? raw : [];
      if (!list.length) {
        setDocError("لا توجد نسخة PDF محفوظة لهذا العقد بعد.");
        return;
      }
      const sorted = [...list].sort((a, b) => {
        const ta = new Date(a.createdAt || a.created_at || 0).getTime();
        const tb = new Date(b.createdAt || b.created_at || 0).getTime();
        return tb - ta;
      });
      const doc = sorted[0];
      const id = doc?.id ?? doc?.documentId;
      if (!id) {
        setDocError("تعذر تحديد الملف.");
        return;
      }
      const dl = await getDocumentDownloadUrl(id);
      const url =
        dl?.url ??
        dl?.downloadUrl ??
        dl?.signedUrl ??
        dl?.data?.url ??
        (typeof dl === "string" ? dl : null);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setDocError("تعذر الحصول على رابط التحميل.");
      }
    } catch {
      setDocError("تعذر جلب الملف. تحقق من الاتصال.");
    } finally {
      setDocLoadingId(null);
    }
  };

  return (
    <div className="arc-page">
      {/* خلفية المباني */}
      <svg className="db-buildings db-buildings--left" viewBox="0 0 340 520" fill="none" aria-hidden="true">
        <rect x="20" y="60" width="38" height="460" rx="3" fill="rgba(200,169,126,0.10)"/>
        <rect x="70" y="140" width="72" height="380" rx="4" fill="rgba(200,169,126,0.12)"/>
        <polygon points="106,110 70,140 142,140" fill="rgba(200,169,126,0.14)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(200,169,126,0.28)" strokeWidth="2.5"/>
        <rect x="155" y="260" width="50" height="260" rx="3" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(200,169,126,0.08)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(200,169,126,0.10)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(200,169,126,0.10)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.12)" strokeWidth="1"/>
      </svg>
      <svg className="db-buildings db-buildings--right" viewBox="0 0 340 520" fill="none" aria-hidden="true">
        <rect x="282" y="80" width="40" height="440" rx="3" fill="rgba(200,169,126,0.10)"/>
        <rect x="198" y="150" width="76" height="370" rx="4" fill="rgba(200,169,126,0.12)"/>
        <polygon points="236,115 198,150 274,150" fill="rgba(200,169,126,0.14)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(200,169,126,0.28)" strokeWidth="2.5"/>
        <rect x="130" y="280" width="54" height="240" rx="3" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(200,169,126,0.07)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(200,169,126,0.10)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(200,169,126,0.09)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.12)" strokeWidth="1"/>
      </svg>

      <div className="arc-inner">

        {/* رأس الصفحة */}
        <div className="arc-header">
          <div className="arc-header-start">
            <button
              type="button"
              className="sc-toolbar-back"
              onClick={() => navigate("/dashboard")}
              aria-label="رجوع"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                <path d="M8 6l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              رجوع
            </button>
            <div className="arc-title-block">
              <span className="arc-title-icon">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <rect x="2" y="3" width="24" height="7" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M3 10v13a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M10 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <h1 className="arc-title">الأرشيف</h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className="arc-count-badge">{filtered.length} عقد</span>
            <LogoutButton className="arc-logout-btn" />
            <ThemeToggle />
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="arc-filters" dir="rtl">
          <div className="arc-search-wrap">
            <svg className="arc-search-icon" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12.5 12.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className="arc-search"
              type="text"
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              dir="rtl"
            />
            {search && (
              <button type="button" className="arc-search-clear" onClick={() => setSearch("")} aria-label="مسح البحث">
                ×
              </button>
            )}
          </div>

          <select
            className="arc-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="نوع العقد"
          >
            <option value="الكل">كل الأنواع</option>
            <option value="عقد بيع">عقد بيع</option>
            <option value="عقد إيجار">عقد إيجار</option>
          </select>

          <select
            className="arc-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="الحالة"
          >
            <option value="الكل">كل الحالات</option>
            <option value="مسودة">مسودة</option>
            <option value="مؤكد">مؤكد</option>
          </select>

          <select
            className="arc-select arc-select--sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="ترتيب"
          >
            <option value="date-desc">الأحدث أولاً</option>
            <option value="date-asc">الأقدم أولاً</option>
          </select>
        </div>

        {docError ? (
          <p className="arc-doc-hint" role="status">
            {docError}
          </p>
        ) : null}

        {/* قائمة العقود */}
        <div className="arc-grid">
          {loading ? (
            <div className="arc-empty">
              <p>جارٍ تحميل العقود...</p>
            </div>
          ) : null}

          {!loading && errorMessage ? (
            <div className="arc-empty">
              <p>{errorMessage}</p>
            </div>
          ) : null}

          {!loading && !errorMessage && filtered.length === 0 ? (
            <div className="arc-empty">
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="25" stroke="var(--ak-gold-soft)" strokeWidth="2"/>
                <path d="M17 20h20M17 27h14M17 34h10" stroke="var(--ak-gold)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>لا توجد عقود مطابقة للبحث</p>
            </div>
          ) : null}

          {!loading && !errorMessage && filtered.length > 0 ? (
            filtered.map((contract) => (
              <ContractRow
                key={contract.id}
                contract={contract}
                onView={() => {}}
                onDownloadPdf={handleDownloadPdf}
                isDownloadingPdf={docLoadingId === contract.id}
              />
            ))
          ) : null}
        </div>

      </div>
    </div>
  );
}
