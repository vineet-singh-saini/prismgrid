import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../lib/permissions";
import { createReport, listReports, updateReport } from "../../lib/workspaceApi";
import "../../styles/pages.css";

const initialReportForm = {
  title: "",
  subtitle: "",
  cadence: "Ad hoc",
  status: "Draft",
};

function ReportsPage() {
  const { hasPermission } = useAuth();
  const canWriteReports = hasPermission(PERMISSIONS.REPORTS_WRITE);
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialReportForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadReports() {
      setStatus((currentStatus) => ({ ...currentStatus, loading: true, error: "" }));

      try {
        const nextReports = await listReports();

        if (!isActive) {
          return;
        }

        setReports(nextReports);
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

    loadReports();

    return () => {
      isActive = false;
    };
  }, []);

  const meta = useMemo(
    () => [
      `${reports.length} reporting packs`,
      `${reports.filter((report) => report.status === "Ready").length} ready now`,
      canWriteReports ? "Live pack generation" : "Read-only reporting view",
    ],
    [canWriteReports, reports]
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleCreateReport = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await createReport(formValues);
      const nextReports = await listReports();
      setReports(nextReports);
      setFormValues(initialReportForm);
      setFormOpen(false);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Report pack created successfully.",
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

  const handleRefreshReport = async (report) => {
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await updateReport(report.id, {
        status: "Ready",
      });
      const nextReports = await listReports();
      setReports(nextReports);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: `${report.title} refreshed successfully.`,
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
        eyebrow="Reporting Layer"
        title="Executive Reporting"
        subtitle="Board-ready briefings, vendor packs, and scenario reviews built from the same operating data used by delivery teams."
        meta={meta}
        action={
          canWriteReports ? (
            <button className="primary-btn" type="button" onClick={() => setFormOpen((value) => !value)}>
              {formOpen ? "Close report form" : "Create reporting pack"}
            </button>
          ) : null
        }
      />

      {formOpen ? (
        <section className="info-card form-shell">
          <div className="info-card-head">
            <h3>Create reporting pack</h3>
            <span className="eyebrow">Narrative brief or operational pack</span>
          </div>

          <form className="form-grid" onSubmit={handleCreateReport}>
            <div className="form-grid-two">
              <input
                required
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleFormChange}
                placeholder="Report title"
              />
              <input
                required
                name="cadence"
                type="text"
                value={formValues.cadence}
                onChange={handleFormChange}
                placeholder="Cadence"
              />
              <select name="status" value={formValues.status} onChange={handleFormChange}>
                <option>Draft</option>
                <option>Ready</option>
                <option>Queued</option>
              </select>
            </div>
            <textarea
              required
              name="subtitle"
              value={formValues.subtitle}
              onChange={handleFormChange}
              placeholder="Summary of the report pack"
              rows="4"
            />
            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating pack..." : "Create pack"}
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

      {status.loading ? (
        <section className="info-card page-state compact">
          <h3>Loading reporting packs</h3>
          <p>Fetching executive, vendor, and scenario reporting assets.</p>
        </section>
      ) : null}

      <div className="reports-grid">
        {reports.map((report) => (
          <article className="report-card" key={report.id}>
            <div>
              <span className="eyebrow">{report.cadence}</span>
              <h3>{report.title}</h3>
              <p>{report.subtitle}</p>
            </div>

            <div className="report-bottom">
              <div className="report-meta-stack">
                <span className={`severity-pill ${report.status === "Ready" ? "low" : "medium"}`}>
                  {report.status}
                </span>
                <small>{report.generatedAtLabel || "Generated just now"}</small>
              </div>
              {canWriteReports ? (
                <button className="secondary-btn" type="button" onClick={() => handleRefreshReport(report)}>
                  {report.status === "Ready" ? "Refresh pack" : "Mark ready"}
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
