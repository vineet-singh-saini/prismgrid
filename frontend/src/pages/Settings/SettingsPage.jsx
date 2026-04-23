import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/pages.css";

function SettingsPage() {
  const { user, updateProfile, updatePreferences, changePassword, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    title: "",
    organization: "",
    region: "",
    shift: "",
  });
  const [preferencesForm, setPreferencesForm] = useState({
    notifications: {
      highSeverityRiskAlerts: true,
      vendorComplianceEscalations: true,
      weeklyExecutiveDigest: true,
      scenarioReviewReminders: false,
    },
    workspaceModes: {
      calmDashboardDensity: true,
      focusModeOnCommandCenter: true,
      experimentalAICopilots: false,
    },
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({
    profile: "",
    preferences: "",
    password: "",
  });
  const [savingSection, setSavingSection] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      title: user.title ?? "",
      organization: user.organization ?? "",
      region: user.region ?? "",
      shift: user.shift ?? "",
    });

    setPreferencesForm({
      notifications: {
        highSeverityRiskAlerts:
          user.preferences?.notifications?.highSeverityRiskAlerts ?? true,
        vendorComplianceEscalations:
          user.preferences?.notifications?.vendorComplianceEscalations ?? true,
        weeklyExecutiveDigest:
          user.preferences?.notifications?.weeklyExecutiveDigest ?? true,
        scenarioReviewReminders:
          user.preferences?.notifications?.scenarioReviewReminders ?? false,
      },
      workspaceModes: {
        calmDashboardDensity:
          user.preferences?.workspaceModes?.calmDashboardDensity ?? true,
        focusModeOnCommandCenter:
          user.preferences?.workspaceModes?.focusModeOnCommandCenter ?? true,
        experimentalAICopilots:
          user.preferences?.workspaceModes?.experimentalAICopilots ?? false,
      },
    });
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePreferenceToggle = (group, field) => {
    setPreferencesForm((currentForm) => ({
      ...currentForm,
      [group]: {
        ...currentForm[group],
        [field]: !currentForm[group][field],
      },
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingSection("profile");

    try {
      await updateProfile({
        fullName: profileForm.fullName,
        title: profileForm.title,
        organization: profileForm.organization,
        region: profileForm.region,
        shift: profileForm.shift,
      });

      setStatus((currentStatus) => ({
        ...currentStatus,
        profile: "Profile updated successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        profile: error.message,
      }));
    } finally {
      setSavingSection("");
    }
  };

  const savePreferences = async (event) => {
    event.preventDefault();
    setSavingSection("preferences");

    try {
      await updatePreferences(preferencesForm);
      setStatus((currentStatus) => ({
        ...currentStatus,
        preferences: "Preferences updated successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        preferences: error.message,
      }));
    } finally {
      setSavingSection("");
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setSavingSection("password");

    try {
      const message = await changePassword(passwordForm);
      setStatus((currentStatus) => ({
        ...currentStatus,
        password: message,
      }));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        password: error.message,
      }));
    } finally {
      setSavingSection("");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Workspace Controls"
        title="Workspace"
        subtitle="Manage the operating preferences, alert posture, and UX mode of the PRISM-GRID workspace."
        meta={["Profile", "Alerts", "Workspace modes", "Security"]}
        action={
          <button className="secondary-btn" type="button" onClick={logout}>
            Log out
          </button>
        }
      />

      <div className="settings-grid">
        <section className="info-card">
          <h3>Profile</h3>
          <form className="settings-form" onSubmit={saveProfile}>
            <input
              name="fullName"
              type="text"
              value={profileForm.fullName}
              onChange={handleProfileChange}
            />
            <input type="email" value={profileForm.email} readOnly />
            <input
              name="title"
              type="text"
              value={profileForm.title}
              onChange={handleProfileChange}
            />
            <input
              name="organization"
              type="text"
              value={profileForm.organization}
              onChange={handleProfileChange}
            />
            <input
              name="region"
              type="text"
              value={profileForm.region}
              onChange={handleProfileChange}
            />
            <input
              name="shift"
              type="text"
              value={profileForm.shift}
              onChange={handleProfileChange}
            />
            <input type="text" value={user?.role ?? "Workspace role"} readOnly />
            {status.profile ? <p className="settings-status">{status.profile}</p> : null}
            <button className="primary-btn settings-submit" type="submit" disabled={savingSection === "profile"}>
              {savingSection === "profile" ? "Saving profile..." : "Save profile"}
            </button>
          </form>
        </section>

        <section className="info-card">
          <h3>Notifications</h3>
          <form className="settings-switches" onSubmit={savePreferences}>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.notifications.highSeverityRiskAlerts}
                onChange={() =>
                  handlePreferenceToggle("notifications", "highSeverityRiskAlerts")
                }
              />
              <span>High-severity risk alerts</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.notifications.vendorComplianceEscalations}
                onChange={() =>
                  handlePreferenceToggle("notifications", "vendorComplianceEscalations")
                }
              />
              <span>Vendor compliance escalations</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.notifications.weeklyExecutiveDigest}
                onChange={() =>
                  handlePreferenceToggle("notifications", "weeklyExecutiveDigest")
                }
              />
              <span>Weekly executive digest</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.notifications.scenarioReviewReminders}
                onChange={() =>
                  handlePreferenceToggle("notifications", "scenarioReviewReminders")
                }
              />
              <span>Scenario review reminders</span>
            </label>
            {status.preferences ? (
              <p className="settings-status">{status.preferences}</p>
            ) : null}
            <button className="primary-btn settings-submit" type="submit" disabled={savingSection === "preferences"}>
              {savingSection === "preferences"
                ? "Saving preferences..."
                : "Save preferences"}
            </button>
          </form>
        </section>

        <section className="info-card settings-wide">
          <h3>Workspace modes</h3>
          <form className="settings-switches" onSubmit={savePreferences}>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.workspaceModes.calmDashboardDensity}
                onChange={() =>
                  handlePreferenceToggle("workspaceModes", "calmDashboardDensity")
                }
              />
              <span>Calm dashboard density</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.workspaceModes.focusModeOnCommandCenter}
                onChange={() =>
                  handlePreferenceToggle("workspaceModes", "focusModeOnCommandCenter")
                }
              />
              <span>Focus mode on command center</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={preferencesForm.workspaceModes.experimentalAICopilots}
                onChange={() =>
                  handlePreferenceToggle("workspaceModes", "experimentalAICopilots")
                }
              />
              <span>Experimental AI copilots</span>
            </label>
            {status.preferences ? (
              <p className="settings-status">{status.preferences}</p>
            ) : null}
            <button className="primary-btn settings-submit" type="submit" disabled={savingSection === "preferences"}>
              {savingSection === "preferences"
                ? "Saving preferences..."
                : "Save workspace modes"}
            </button>
          </form>
        </section>

        <section className="info-card settings-wide">
          <h3>Security</h3>
          <form className="settings-form" onSubmit={savePassword}>
            <input
              required
              minLength="8"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current password"
            />
            <input
              required
              minLength="8"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New password"
            />
            <input
              required
              minLength="8"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
            {status.password ? <p className="settings-status">{status.password}</p> : null}
            <button className="primary-btn settings-submit" type="submit" disabled={savingSection === "password"}>
              {savingSection === "password" ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
