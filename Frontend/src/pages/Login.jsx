import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>تسجيل الدخول</h1>

        <input type="text" placeholder="اسم المستخدم" />
        <input type="password" placeholder="كلمة المرور" />

        <button type="submit">دخول</button>
      </form>
    </div>
  );
}