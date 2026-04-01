import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function SignInPage() {
  const [form, setForm] = useState({
    email: localStorage.getItem("userEmail") || "",
    password: "",
    remember: Boolean(localStorage.getItem("userEmail")),
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await api.signIn({
        email: form.email,
        password: form.password,
      });

      if (form.remember) {
        localStorage.setItem("userEmail", form.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      if (result?.token) {
        sessionStorage.setItem("authToken", result.token);
      }

      setMessage({ type: "success", text: "Signed in successfully." });
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setMessage({
        type: "error",
        text: "Sign-in backend is not connected yet, but the React login flow is ready.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container sign-in-wrap">
        <div className="auth-layout">
          <div className="auth-panel">
            <p className="eyebrow">Account access</p>
            <h1>Welcome back.</h1>
            <p>
              Sign in to manage donor activity, update your profile, and keep your
              availability current for local searches.
            </p>
          </div>

          <div className="page-card auth-card">
            <form className="stacked-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="check-row">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={updateField}
                />
                <span>Remember my email</span>
              </label>

              {message.text ? (
                <div className={`form-message ${message.type}`}>{message.text}</div>
              ) : null}

              <button className="btn btn-primary wide" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
