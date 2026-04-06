import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="lp-page">
      <div className="lp-card">

        {/* ── Left brand panel ── */}
        <div className="lp-left">
          <div className="lp-left-deco-top" />
          <div className="lp-left-deco-bot" />
          <div className="lp-left-content">
            <img src="/logo-mark.png" alt="Al Kuthar" className="lp-left-logo" />
            <div className="lp-left-divider" />
            <p className="lp-left-ar" dir="rtl" lang="ar">
              للعقارات و الاستشارات العقارية
            </p>
            <p className="lp-left-en">العقارات والاستشارات</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lp-right">

          {/* logo shown only on mobile */}
          <div className="lp-mobile-brand">
            <img src="/logo-mark.png" alt="Al Kuthar" className="lp-mobile-logo" />
            <p className="lp-mobile-ar" dir="rtl" lang="ar">
              للعقارات و الاستشارات العقارية
            </p>
          </div>

          <div className="lp-right-header">
            <h2 className="lp-right-title">تسجيل الدخول</h2>
            <p className="lp-right-sub">سجّل دخولك إلى حسابك للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="lp-form">

            {/* Email */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 1h16v12H1V1zm0 0l8 7 8-7" stroke="#B8ABA1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="lp-input"
                required
              />
            </div>

            {/* Password */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <rect x="1" y="7" width="14" height="10" rx="2" stroke="#B8ABA1" strokeWidth="1.6"/>
                  <path d="M4 7V5a4 4 0 0 1 8 0v2" stroke="#B8ABA1" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="8" cy="12" r="1.2" fill="#B8ABA1"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className="lp-input"
                required
              />
              <button
                type="button"
                className="lp-toggle-pass"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label="إظهار/إخفاء كلمة المرور"
              >
                {showPass ? (
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path d="M1 7s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#B8ABA1" strokeWidth="1.5"/>
                    <circle cx="9" cy="7" r="2.2" stroke="#B8ABA1" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M1 1l16 14M7.6 3.3C8 3.1 8.5 3 9 3c5 0 8 5 8 5s-.9 1.5-2.4 3M3.4 5.4C2.1 6.6 1 8 1 8s3 5 8 5c1.3 0 2.5-.3 3.5-.9" stroke="#B8ABA1" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Remember / Forgot */}
            <div className="lp-meta">
              <label className="lp-remember">
                <input type="checkbox" className="lp-checkbox" />
                <span>تذكّرني</span>
              </label>
              <a href="#" className="lp-forgot">نسيت كلمة المرور؟</a>
            </div>

            {/* Submit */}
            <button type="submit" className="lp-btn">
              <span>تسجيل الدخول</span>
              <span className="lp-btn-arrow">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8.25" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <path d="M7 9h4M9 7l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
