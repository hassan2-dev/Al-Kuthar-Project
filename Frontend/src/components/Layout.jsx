import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "لوحة التحكم",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    to: "/sale-contract",
    label: "عقد بيع",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 2h9l3 3v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M5 8h8M5 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/rent-contract",
    label: "عقد إيجار",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 7.5L9 2l7 5.5V16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 17v-6h6v6" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    to: "/archive",
    label: "الأرشيف",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M2 6v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 10h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Layout({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
          <img src="/logo-mark.png" alt="الكوثر" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">الكوثر</span>
            <span className="sidebar-brand-sub">للعقارات والاستشارات</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-item${active ? " nav-item--active" : ""}`}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer logout hint */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-logout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>تسجيل الخروج</span>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <h1>{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
