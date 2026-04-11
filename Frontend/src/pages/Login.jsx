import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { loginUser } from "../api/authApi";
import { setAuthToken } from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await loginUser({ username, password });
      const token = data?.token || data?.jwt || data?.accessToken;

      if (!token) {
        throw new Error("لم يتم استلام رمز الدخول. تحقق من الاتصال وحاول مرة أخرى.");
      }

      setAuthToken(token);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "فشل تسجيل الدخول، تحقق من البيانات";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lp-page">

      {/* مباني يسار */}
      <svg className="db-buildings db-buildings--left" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="20" y="60" width="38" height="460" rx="3" fill="rgba(200,169,126,0.13)"/>
        <rect x="24" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="34" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="44" y="80" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="24" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="34" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.30)"/>
        <rect x="44" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="24" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="34" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.15)"/>
        <rect x="44" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="24" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="34" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="44" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="24" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="34" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.15)"/>
        <rect x="44" y="160" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <line x1="39" y1="60" x2="39" y2="20" stroke="rgba(200,169,126,0.30)" strokeWidth="2"/>
        <line x1="34" y1="35" x2="44" y2="35" stroke="rgba(200,169,126,0.25)" strokeWidth="1.5"/>
        <rect x="70" y="140" width="72" height="380" rx="4" fill="rgba(200,169,126,0.16)"/>
        <rect x="82" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.30)"/>
        <rect x="98" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="114" y="160" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.30)"/>
        <rect x="82" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="98" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.35)"/>
        <rect x="114" y="185" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.22)"/>
        <rect x="82" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="98" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="114" y="210" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="82" y="235" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="98" y="235" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.30)"/>
        <rect x="114" y="235" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="82" y="260" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.26)"/>
        <rect x="98" y="260" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="114" y="260" width="10" height="14" rx="1.5" fill="rgba(200,169,126,0.26)"/>
        <polygon points="106,110 70,140 142,140" fill="rgba(200,169,126,0.18)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(200,169,126,0.32)" strokeWidth="2.5"/>
        <rect x="155" y="260" width="50" height="260" rx="3" fill="rgba(200,169,126,0.12)"/>
        <rect x="162" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="175" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="188" y="275" width="8" height="10" rx="1" fill="rgba(200,169,126,0.25)"/>
        <rect x="162" y="296" width="8" height="10" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="175" y="296" width="8" height="10" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="188" y="296" width="8" height="10" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="162" y="318" width="8" height="10" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="175" y="318" width="8" height="10" rx="1" fill="rgba(200,169,126,0.15)"/>
        <rect x="188" y="318" width="8" height="10" rx="1" fill="rgba(200,169,126,0.22)"/>
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(200,169,126,0.10)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(200,169,126,0.13)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(200,169,126,0.12)"/>
        <ellipse cx="290" cy="460" rx="14" ry="20" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="290" cy="443" rx="10" ry="16" fill="rgba(200,169,126,0.12)"/>
        <rect x="288" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      {/* مباني يمين */}
      <svg className="db-buildings db-buildings--right" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="282" y="80" width="40" height="440" rx="3" fill="rgba(200,169,126,0.12)"/>
        <rect x="287" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="297" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.30)"/>
        <rect x="307" y="100" width="6" height="8" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="287" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="297" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.18)"/>
        <rect x="307" y="120" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="287" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="297" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="307" y="140" width="6" height="8" rx="1" fill="rgba(200,169,126,0.20)"/>
        <line x1="302" y1="80" x2="302" y2="40" stroke="rgba(200,169,126,0.28)" strokeWidth="2"/>
        <line x1="295" y1="58" x2="309" y2="58" stroke="rgba(200,169,126,0.22)" strokeWidth="1.5"/>
        <rect x="198" y="150" width="76" height="370" rx="4" fill="rgba(200,169,126,0.15)"/>
        <rect x="208" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="225" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="242" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="259" y="168" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="208" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="225" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.32)"/>
        <rect x="242" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.20)"/>
        <rect x="259" y="194" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.25)"/>
        <rect x="208" y="220" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.26)"/>
        <rect x="225" y="220" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.16)"/>
        <rect x="242" y="220" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.26)"/>
        <rect x="259" y="220" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="208" y="246" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="225" y="246" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.28)"/>
        <rect x="242" y="246" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.18)"/>
        <rect x="259" y="246" width="11" height="15" rx="1.5" fill="rgba(200,169,126,0.26)"/>
        <polygon points="236,115 198,150 274,150" fill="rgba(200,169,126,0.17)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(200,169,126,0.30)" strokeWidth="2.5"/>
        <rect x="232" y="82" width="8" height="5" rx="1" fill="rgba(200,169,126,0.28)"/>
        <rect x="130" y="280" width="54" height="240" rx="3" fill="rgba(200,169,126,0.11)"/>
        <rect x="138" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="152" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.16)"/>
        <rect x="166" y="294" width="9" height="12" rx="1" fill="rgba(200,169,126,0.22)"/>
        <rect x="138" y="316" width="9" height="12" rx="1" fill="rgba(200,169,126,0.16)"/>
        <rect x="152" y="316" width="9" height="12" rx="1" fill="rgba(200,169,126,0.26)"/>
        <rect x="166" y="316" width="9" height="12" rx="1" fill="rgba(200,169,126,0.16)"/>
        <rect x="138" y="338" width="9" height="12" rx="1" fill="rgba(200,169,126,0.20)"/>
        <rect x="152" y="338" width="9" height="12" rx="1" fill="rgba(200,169,126,0.14)"/>
        <rect x="166" y="338" width="9" height="12" rx="1" fill="rgba(200,169,126,0.20)"/>
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(200,169,126,0.12)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(200,169,126,0.11)"/>
        <ellipse cx="42" cy="462" rx="13" ry="18" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="42" cy="447" rx="9" ry="14" fill="rgba(200,169,126,0.11)"/>
        <rect x="40" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      {/* Theme toggle */}
      <div className="lp-theme-btn">
        <ThemeToggle />
      </div>

      <div className="lp-card">

        {/* ── Left brand panel ── */}
        <div className="lp-left">
          <div className="lp-left-deco-top" />
          <div className="lp-left-deco-bot" />
          <div className="lp-left-content">
            <img src="/logo-mark.png" alt="الكوثر" className="lp-left-logo" />
            <div className="lp-left-divider" />
            <p className="lp-left-ar" dir="rtl" lang="ar">
              للعقارات والاستشارات العقارية
            </p>
            <span className="lp-left-tag">نظام إدارة العقود</span>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lp-right">

          {/* logo shown only on mobile */}
          <div className="lp-mobile-brand">
            <img src="/logo-mark.png" alt="الكوثر" className="lp-mobile-logo" />
          </div>

          <div className="lp-right-header">
            <h2 className="lp-right-title">تسجيل الدخول</h2>
            <p className="lp-right-sub">سجّل دخولك إلى حسابك للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="lp-form">

            {/* Username */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <svg width="17" height="13" viewBox="0 0 18 14" fill="none">
                  <path d="M1 1h16v12H1V1zm0 0l8 7 8-7" stroke="var(--ak-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="أدخل اسم المستخدم"
                className="lp-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <svg width="15" height="17" viewBox="0 0 16 18" fill="none">
                  <rect x="1" y="7" width="14" height="10" rx="2" stroke="var(--ak-gold)" strokeWidth="1.6"/>
                  <path d="M4 7V5a4 4 0 0 1 8 0v2" stroke="var(--ak-gold)" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="8" cy="12" r="1.2" fill="var(--ak-gold)"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className="lp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                    <path d="M1 7s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="var(--ak-text-muted)" strokeWidth="1.5"/>
                    <circle cx="9" cy="7" r="2.2" stroke="var(--ak-text-muted)" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M1 1l16 14M7.6 3.3C8 3.1 8.5 3 9 3c5 0 8 5 8 5s-.9 1.5-2.4 3M3.4 5.4C2.1 6.6 1 8 1 8s3 5 8 5c1.3 0 2.5-.3 3.5-.9" stroke="var(--ak-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
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

            {errorMessage ? (
              <p style={{ color: "#c86464", margin: 0, textAlign: "center" }}>{errorMessage}</p>
            ) : null}

            {/* Submit */}
            <button type="submit" className="lp-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}</span>
              <span className="lp-btn-arrow">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8.25" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
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
