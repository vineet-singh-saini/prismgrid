import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = location.state?.from?.pathname ?? "/app/dashboard";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setIsSubmitting(true);

    try {
      await login({
        email: formValues.email,
        password: formValues.password,
      });

      navigate(nextPath, { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-story">
          <span className="section-tag">Secure workspace access</span>
          <h1>Enter the command layer for predictive project delivery.</h1>
          <p>
            Sign in to review risk exposure, intervene earlier, monitor vendor drift,
            and keep leadership aligned on the same operational picture.
          </p>

          <div className="auth-story-grid">
            <article className="auth-story-card">
              <span className="eyebrow">Workspace posture</span>
              <strong>14 monitored programs</strong>
              <p>Cross-project visibility with explainable scoring and live interventions.</p>
            </article>

            <article className="auth-story-card">
              <span className="eyebrow">Review rhythm</span>
              <strong>Next executive brief in 18 min</strong>
              <p>Operational and board-level views stay aligned without duplicate prep.</p>
            </article>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-form-head">
            <span className="eyebrow">Sign in</span>
            <h2>Access your workspace</h2>
            <p>Use the form below to enter the secure PRISM-GRID workspace.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <div className="input-shell">
                <FiMail />
                <input
                  required
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-shell">
                <FiLock />
                <input
                  required
                  minLength="8"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <label className="checkbox-row">
              <input
                name="rememberMe"
                type="checkbox"
                checked={formValues.rememberMe}
                onChange={handleChange}
              />
              <span>Keep me signed in on this device</span>
            </label>

            {status.message ? (
              <p className={status.type === "error" ? "auth-status error" : "auth-status"}>
                {status.message}
              </p>
            ) : null}

            <button className="primary-btn premium-auth-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Enter workspace"}
              <FiArrowRight />
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
