import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../lib/permissions";
import { createAlert, listAlerts, listProjects, updateAlert } from "../../lib/workspaceApi";
import "../../styles/pages.css";

const initialAlertForm = {
  title: "",
  severity: "medium",
  projectId: "",
  owner: "",
  assignee: "",
  reason: "",
  recommendation: "",
  status: "open",
};

function AlertsPage() {
  const { user, hasPermission } = useAuth();
  const canWriteAlerts = hasPermission(PERMISSIONS.ALERTS_WRITE);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    ...initialAlertForm,
    owner: user?.title || "PMO Operations",
    assignee: user?.fullName || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAlerts, setEditingAlerts] = useState({});

  useEffect(() => {
    setFormValues((currentValues) => ({
      ...currentValues,
      owner: currentValues.owner || user?.title || "PMO Operations",
      assignee: currentValues.assignee || user?.fullName || "",
    }));
  }, [user]);

  useEffect(() => {
    let isActive = true;

    async function loadPageData() {
      setStatus((currentStatus) => ({ ...currentStatus, loading: true, error: "" }));

      try {
        const [nextAlerts, nextProjects] = await Promise.all([
          listAlerts({ severity: severityFilter }),
          listProjects(),
        ]);

        if (!isActive) {
          return;
        }

        setAlerts(nextAlerts);
        setProjects(nextProjects);
        setEditingAlerts(
          Object.fromEntries(
            nextAlerts.map((alert) => [
              alert.id,
              { assignee: alert.assignee ?? "", status: alert.status },
            ])
          )
        );
        setStatus((currentStatus) => ({
          ...currentStatus,
          loading: false,
          error: "",
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus((currentStatus) => ({
          ...currentStatus,
          loading: false,
          error: error.message,
        }));
      }
    }

    loadPageData();

    return () => {
      isActive = false;
    };
  }, [severityFilter]);

  const meta = useMemo(
    () => [
      `${alerts.length} live alerts`,
      `${alerts.filter((alert) => alert.severity === "high").length} critical`,
      canWriteAlerts ? "Owner-based triage and updates" : "Read-only triage view",
    ],
    [alerts, canWriteAlerts]
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleCreateAlert = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await createAlert(formValues);
      const nextAlerts = await listAlerts({ severity: severityFilter });
      setAlerts(nextAlerts);
      setEditingAlerts((currentValue) => ({
        ...currentValue,
        ...Object.fromEntries(
          nextAlerts.map((alert) => [
            alert.id,
            { assignee: alert.assignee ?? "", status: alert.status },
          ])
        ),
      }));
      setFormValues({
        ...initialAlertForm,
        owner: user?.title || "PMO Operations",
        assignee: user?.fullName || "",
      });
      setFormOpen(false);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Alert created successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAlertEditChange = (alertId, field, value) => {
    setEditingAlerts((currentValue) => ({
      ...currentValue,
      [alertId]: {
        ...(currentValue[alertId] ?? {}),
        [field]: value,
      },
    }));
  };

  const handleUpdateAlert = async (alertId) => {
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await updateAlert(alertId, editingAlerts[alertId]);
      const nextAlerts = await listAlerts({ severity: severityFilter });
      setAlerts(nextAlerts);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Alert updated successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message,
      }));
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Risk Triage"
        title="Risk Board"
        subtitle="Review issues by severity, owner, and recommended recovery path before they snowball into portfolio-level drift."
        meta={meta}
        action={
          canWriteAlerts ? (
            <button className="primary-btn" type="button" onClick={() => setFormOpen((value) => !value)}>
              {formOpen ? "Close alert form" : "Create triage review"}
            </button>
          ) : null
        }
      />

      {formOpen ? (
        <section className="info-card form-shell">
          <div className="info-card-head">
            <h3>Create alert</h3>
            <span className="eyebrow">Signal, owner, and recovery recommendation</span>
          </div>

          <form className="form-grid" onSubmit={handleCreateAlert}>
            <div className="form-grid-two">
              <input
                required
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleFormChange}
                placeholder="Alert title"
              />
              <select name="severity" value={formValues.severity} onChange={handleFormChange}>
                <option value="high">High severity</option>
                <option value="medium">Medium severity</option>
                <option value="low">Low severity</option>
              </select>
              <select name="projectId" value={formValues.projectId} onChange={handleFormChange}>
                <option value="">Portfolio-wide</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select name="status" value={formValues.status} onChange={handleFormChange}>
                <option value="open">Open</option>
                <option value="in-progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <input
                required
                name="owner"
                type="text"
                value={formValues.owner}
                onChange={handleFormChange}
                placeholder="Owning team"
              />
              <input
                name="assignee"
                type="text"
                value={formValues.assignee}
                onChange={handleFormChange}
                placeholder="Assignee"
              />
            </div>

            <textarea
              required
              name="reason"
              value={formValues.reason}
              onChange={handleFormChange}
              placeholder="What signal triggered this alert?"
              rows="4"
            />
            <textarea
              required
              name="recommendation"
              value={formValues.recommendation}
              onChange={handleFormChange}
              placeholder="Recommended recovery move"
              rows="4"
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating alert..." : "Create alert"}
              </button>
              <button className="secondary-btn" type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {status.message ? <p className="settings-status">{status.message}</p> : null}
      {status.error ? <p className="settings-status form-error">{status.error}</p> : null}

      <div className="pill-filter-row">
        {["all", "high", "medium", "low"].map((level) => (
          <button
            key={level}
            type="button"
            className={severityFilter === level ? "pill-filter active" : "pill-filter"}
            onClick={() => setSeverityFilter(level)}
          >
            {level === "all" ? "All alerts" : `${level} severity`}
          </button>
        ))}
      </div>

      {status.loading ? (
        <section className="info-card page-state compact">
          <h3>Loading risk board</h3>
          <p>Pulling the latest alert stream and open triage items.</p>
        </section>
      ) : null}

      <div className="alerts-grid">
        {alerts.map((alert) => (
          <article className="alert-card" key={alert.id}>
            <div className="alert-top">
              <div>
                <span className="eyebrow">{alert.project}</span>
                <h3>{alert.title}</h3>
              </div>
              <span className={`status-chip ${alert.severity}`}>{alert.time}</span>
            </div>

            <div className="alert-body">
              <p>
                <strong>Owner:</strong> {alert.owner}
              </p>
              <p>
                <strong>Signal:</strong> {alert.reason}
              </p>
              <p>
                <strong>Recommended move:</strong> {alert.recommendation}
              </p>
            </div>

            {canWriteAlerts ? (
              <div className="inline-edit-grid">
                <input
                  type="text"
                  value={editingAlerts[alert.id]?.assignee ?? ""}
                  onChange={(event) =>
                    handleAlertEditChange(alert.id, "assignee", event.target.value)
                  }
                  placeholder="Assignee"
                />
                <select
                  value={editingAlerts[alert.id]?.status ?? "open"}
                  onChange={(event) =>
                    handleAlertEditChange(alert.id, "status", event.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => handleUpdateAlert(alert.id)}
                >
                  Save triage
                </button>
              </div>
            ) : null}

            <div className="alert-bottom">
              <span className={`severity-pill ${alert.severity}`}>{alert.severity}</span>
              <span className="eyebrow alert-status-note">{alert.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AlertsPage;
