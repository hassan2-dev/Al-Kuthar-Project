import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../api/axiosInstance";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/", { replace: true });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
      aria-label="تسجيل الخروج"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>تسجيل الخروج</span>
    </button>
  );
}
