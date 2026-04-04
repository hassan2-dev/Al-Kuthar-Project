import { Link } from "react-router-dom";

export default function Layout({ title, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="logo">الكوثر</h2>

        <nav className="nav-links">
          <Link to="/dashboard">لوحة التحكم</Link>
          <Link to="/sale-contract">عقد بيع</Link>
          <Link to="/rent-contract">عقد إيجار</Link>
          <Link to="/archive">الأرشيف</Link>
        </nav>
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