import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="db-page">
      <div className="db-bg-overlay" />

      {/* مباني يسار */}
      <svg className="db-buildings db-buildings--left" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* برج خلفي رفيع */}
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
        {/* هوائي */}
        <line x1="39" y1="60" x2="39" y2="20" stroke="rgba(200,169,126,0.30)" strokeWidth="2"/>
        <line x1="34" y1="35" x2="44" y2="35" stroke="rgba(200,169,126,0.25)" strokeWidth="1.5"/>

        {/* البرج الرئيسي */}
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
        {/* قمة مثلث */}
        <polygon points="106,110 70,140 142,140" fill="rgba(200,169,126,0.18)"/>
        <line x1="106" y1="110" x2="106" y2="80" stroke="rgba(200,169,126,0.32)" strokeWidth="2.5"/>

        {/* مبنى أمامي صغير */}
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

        {/* شجرة */}
        <ellipse cx="240" cy="440" rx="22" ry="30" fill="rgba(200,169,126,0.10)"/>
        <ellipse cx="240" cy="415" rx="15" ry="22" fill="rgba(200,169,126,0.13)"/>
        <rect x="237" y="470" width="6" height="50" fill="rgba(200,169,126,0.12)"/>

        {/* شجرة صغيرة */}
        <ellipse cx="290" cy="460" rx="14" ry="20" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="290" cy="443" rx="10" ry="16" fill="rgba(200,169,126,0.12)"/>
        <rect x="288" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>

        {/* خط الأرض */}
        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      {/* مباني يمين */}
      <svg className="db-buildings db-buildings--right" viewBox="0 0 340 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* برج خلفي */}
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

        {/* البرج الرئيسي اليميني */}
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
        {/* قمة */}
        <polygon points="236,115 198,150 274,150" fill="rgba(200,169,126,0.17)"/>
        <line x1="236" y1="115" x2="236" y2="85" stroke="rgba(200,169,126,0.30)" strokeWidth="2.5"/>
        <rect x="232" y="82" width="8" height="5" rx="1" fill="rgba(200,169,126,0.28)"/>

        {/* مبنى أمامي صغير */}
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

        {/* شجرة */}
        <ellipse cx="85" cy="445" rx="20" ry="28" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="85" cy="422" rx="14" ry="20" fill="rgba(200,169,126,0.12)"/>
        <rect x="82" y="473" width="6" height="47" fill="rgba(200,169,126,0.11)"/>

        {/* شجرة صغيرة */}
        <ellipse cx="42" cy="462" rx="13" ry="18" fill="rgba(200,169,126,0.09)"/>
        <ellipse cx="42" cy="447" rx="9" ry="14" fill="rgba(200,169,126,0.11)"/>
        <rect x="40" y="480" width="4" height="40" fill="rgba(200,169,126,0.10)"/>

        <line x1="0" y1="520" x2="340" y2="520" stroke="rgba(200,169,126,0.15)" strokeWidth="1"/>
      </svg>

      <div className="db-inner">

        {/* زر الوضع الداكن */}
        <div className="db-theme-row">
          <LogoutButton className="db-logout-btn" />
          <ThemeToggle />
        </div>

        {/* الشعار */}
        <div className="db-brand">
          <img src="/logo-mark.png" alt="الكوثر" className="db-brand-logo" />
        </div>

        {/* البطاقات */}
        <div className="db-grid">

          {/* عقد بيع */}
          <button className="db-card" onClick={() => navigate("/sale-contract")}>
            <span className="db-card-icon">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M2 10l6 6 4-2 6 6 6-6-6-6-4 2-6-6-6 6z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M8 16l4 4M18 10l4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="db-card-body">
              <span className="db-card-title">عقد بيع</span>
              <span className="db-card-desc">إنشاء عقد بيع جديد</span>
            </div>
            <span className="db-card-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                <path d="M10 6L7 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          {/* عقد إيجار */}
          <button className="db-card" onClick={() => navigate("/rent-contract")}>
            <span className="db-card-icon">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M3 13L15 4l12 9v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V13z" stroke="white" strokeWidth="1.8"/>
                <circle cx="15" cy="17" r="2.5" stroke="white" strokeWidth="1.6"/>
                <path d="M17.5 17h3v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="db-card-body">
              <span className="db-card-title">عقد إيجار</span>
              <span className="db-card-desc">إنشاء عقد إيجار جديد</span>
            </div>
            <span className="db-card-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                <path d="M10 6L7 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

          {/* الأرشيف — عرض كامل */}
          <button className="db-card db-card--wide" onClick={() => navigate("/archive")}>
            <span className="db-card-icon">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect x="2" y="3" width="26" height="8" rx="2" stroke="white" strokeWidth="1.8"/>
                <path d="M3 11v14a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V11" stroke="white" strokeWidth="1.8"/>
                <path d="M11 18h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="db-card-body">
              <span className="db-card-title">الأرشيف</span>
              <span className="db-card-desc">استعراض وإدارة جميع العقود المحفوظة</span>
            </div>
            <span className="db-card-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5"/>
                <path d="M10 6L7 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
