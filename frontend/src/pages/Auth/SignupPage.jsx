import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiLayers, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/auth.css";

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Project Manager",
    title: "Portfolio Control Lead",
    organization: "National Infra PMO",
    region: "India West + North",
    shift: "Morning sync",
    acceptedPolicies: false,
  });
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.acceptedPolicies) {
      setStatus({
        type: "error",
        message: "Please accept the platform access and governance policies.",
      });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsSubmitting(true);

    try {
      await register({
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        role: formValues.role,
        title: formValues.title,
        organization: formValues.organization,
        region: formValues.region,
        shift: formValues.shift,
      });

      navigate("/app/dashboard", { replace: true });
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
          <span className="section-tag">Onboard a new workspace</span>
          <h1>Set up PRISM-GRID for PMO teams, vendors, and executive stakeholders.</h1>
          <p>
            Create a role-aware workspace for predictive monitoring, intervention planning,
            compliance watch, and leadership reporting across infrastructure programs.
          </p>

          <div className="auth-story-list">
            <div className="auth-feature-pill">Predictive risk scoring</div>
            <div className="auth-feature-pill">Vendor intelligence</div>
            <div className="auth-feature-pill">Scenario simulation</div>
            <div className="auth-feature-pill">Compliance monitoring</div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-form-head">
            <span className="eyebrow">Create account</span>
            <h2>Start onboarding</h2>
            <p>Create a secure PRISM-GRID workspace and onboard your operating team.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full name</label>
              <div className="input-shell">
                <FiUser />
                <input
                  required
                  name="fullName"
                  type="text"
                  value={formValues.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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

            <div className="auth-form-two-col">
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
                    placeholder="Create password"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Confirm password</label>
                <div className="input-shell">
                  <FiLock />
                  <input
                    required
                    minLength="8"
                    name="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Role</label>
              <div className="input-shell">
                <FiLayers />
                <select name="role" value={formValues.role} onChange={handleChange}>
                  <option>Project Manager</option>
                  <option>Analyst</option>
                  <option>Executive Reviewer</option>
                </select>
              </div>
            </div>

            <label className="checkbox-row">
              <input
                name="acceptedPolicies"
                type="checkbox"
                checked={formValues.acceptedPolicies}
                onChange={handleChange}
              />
              <span>I agree to the platform access and governance policies</span>
            </label>

            {status.message ? (
              <p className={status.type === "error" ? "auth-status error" : "auth-status"}>
                {status.message}
              </p>
            ) : null}

            <button className="primary-btn premium-auth-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating workspace..." : "Create workspace"}
              <FiArrowRight />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default SignupPage;
