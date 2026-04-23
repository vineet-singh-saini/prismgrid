import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { joinLineList, parseLineList } from "../../lib/formUtils";
import { PERMISSIONS } from "../../lib/permissions";
import { getProject, updateProject } from "../../lib/workspaceApi";
import "../../styles/pages.css";

function ProjectDetailsPage() {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const canEditProject = hasPermission(PERMISSIONS.PROJECTS_WRITE);
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [formValues, setFormValues] = useState({
    status: "Managed watch",
    riskLevel: "medium",
    riskScore: 60,
    progress: 40,
    confidence: 74,
    delayProbability: 42,
    nextMilestone: "",
    deadlineAt: "",
    summary: "",
    drivers: "",
    interventions: "",
    decisionLog: "",
    vendorNotes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadProject() {
      setStatus({ loading: true, error: "", message: "" });

      try {
        const nextProject = await getProject(id);

        if (!isActive) {
          return;
        }

        setProject(nextProject);
        setFormValues({
          status: nextProject.status,
          riskLevel: nextProject.riskLevel,
          riskScore: nextProject.riskScore,
          progress: nextProject.progress,
          confidence: nextProject.confidence,
          delayProbability: nextProject.delayProbability,
          nextMilestone: nextProject.nextMilestone,
          deadlineAt: nextProject.deadlineAt?.slice(0, 10) ?? "",
          summary: nextProject.summary,
          drivers: joinLineList(nextProject.drivers),
          interventions: joinLineList(nextProject.interventions),
          decisionLog: joinLineList(nextProject.decisionLog),
          vendorNotes: joinLineList(nextProject.vendorNotes),
        });
        setStatus({ loading: false, error: "", message: "" });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({ loading: false, error: error.message, message: "" });
      }
    }

    loadProject();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      const response = await updateProject(id, {
        status: formValues.status,
        riskLevel: formValues.riskLevel,
        riskScore: Number(formValues.riskScore),
        progress: Number(formValues.progress),
        confidence: Number(formValues.confidence),
        delayProbability: Number(formValues.delayProbability),
        nextMilestone: formValues.nextMilestone,
        deadlineAt: formValues.deadlineAt,
        summary: formValues.summary,
        drivers: parseLineList(formValues.drivers),
        interventions: parseLineList(formValues.interventions),
        decisionLog: parseLineList(formValues.decisionLog),
        vendorNotes: parseLineList(formValues.vendorNotes),
      });

      setProject(response.project);
      setIsEditing(false);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Project workspace updated successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message,
      }));
    } finally {
      setIsSaving(false);
    }
  };

  if (status.loading) {
    return (
      <section className="info-card page-state">
        <h3>Loading project workspace</h3>
        <p>Hydrating the full program record, mitigation playbook, and live detail panels.</p>
      </section>
    );
  }

  if (status.error && !project) {
    return (
      <section className="info-card page-state">
        <h3>Project workspace unavailable</h3>
        <p>{status.error}</p>
      </section>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={project.code}
        title={project.name}
        subtitle={project.summary}
        meta={[
          `${project.region} | ${project.sector}`,
          `${project.manager} | owner`,
          `${project.deadline} target`,
        ]}
        action={
          canEditProject ? (
            <button
              className="primary-btn"
              type="button"
              onClick={() => setIsEditing((currentValue) => !currentValue)}
            >
              {isEditing ? "Close editor" : "Edit project"}
            </button>
          ) : null
        }
      />

      {status.message ? <p className="settings-status">{status.message}</p> : null}
      {status.error && project ? <p className="settings-status form-error">{status.error}</p> : null}

      {isEditing ? (
        <section className="info-card form-shell">
          <div className="info-card-head">
            <h3>Edit project workspace</h3>
            <span className="eyebrow">Authorized changes only</span>
          </div>

          <form className="form-grid" onSubmit={handleSave}>
            <div className="form-grid-two">
              <select name="status" value={formValues.status} onChange={handleFormChange}>
                <option>Stable</option>
                <option>Managed watch</option>
                <option>Critical watch</option>
              </select>
              <select name="riskLevel" value={formValues.riskLevel} onChange={handleFormChange}>
                <option value="low">Stable / low risk</option>
                <option value="medium">Managed watch</option>
                <option value="high">Critical watch</option>
              </select>
              <input
                min="0"
                max="100"
                name="riskScore"
                type="number"
                value={formValues.riskScore}
                onChange={handleFormChange}
                placeholder="Risk score"
              />
              <input
                min="0"
                max="100"
                name="progress"
                type="number"
                value={formValues.progress}
                onChange={handleFormChange}
                placeholder="Progress"
              />
              <input
                min="0"
                max="100"
                name="confidence"
                type="number"
                value={formValues.confidence}
                onChange={handleFormChange}
                placeholder="Confidence"
              />
              <input
                min="0"
                max="100"
                name="delayProbability"
                type="number"
                value={formValues.delayProbability}
                onChange={handleFormChange}
                placeholder="Delay probability"
              />
              <input
                name="nextMilestone"
                type="text"
                value={formValues.nextMilestone}
                onChange={handleFormChange}
                placeholder="Next milestone"
              />
              <input
                name="deadlineAt"
                type="date"
                value={formValues.deadlineAt}
                onChange={handleFormChange}
              />
            </div>

            <textarea
              name="summary"
              value={formValues.summary}
              onChange={handleFormChange}
              placeholder="Program summary"
              rows="4"
            />
            <textarea
              name="drivers"
              value={formValues.drivers}
              onChange={handleFormChange}
              placeholder="Primary risk drivers, one per line"
              rows="4"
            />
            <textarea
              name="interventions"
              value={formValues.interventions}
              onChange={handleFormChange}
              placeholder="Mitigation playbook, one per line"
              rows="4"
            />
            <textarea
              name="decisionLog"
              value={formValues.decisionLog}
              onChange={handleFormChange}
              placeholder="Decision log, one per line"
              rows="3"
            />
            <textarea
              name="vendorNotes"
              value={formValues.vendorNotes}
              onChange={handleFormChange}
              placeholder="Vendor notes, one per line"
              rows="3"
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={isSaving}>
                {isSaving ? "Saving changes..." : "Save project changes"}
              </button>
              <button className="secondary-btn" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="details-grid">
        <div className="details-main">
          <section className="info-card">
            <div className="info-card-head">
              <h3>Program overview</h3>
              <span className={`status-chip ${project.riskLevel}`}>{project.status}</span>
            </div>

            <div className="info-grid">
              <div>
                <span>Budget</span>
                <strong>{project.budget}</strong>
              </div>
              <div>
                <span>Spent</span>
                <strong>{project.spent}</strong>
              </div>
              <div>
                <span>Delay probability</span>
                <strong>{project.delayProbability}%</strong>
              </div>
              <div>
                <span>Forecast confidence</span>
                <strong>{project.confidence}%</strong>
              </div>
            </div>
          </section>

          <section className="info-card">
            <h3>Primary risk drivers</h3>
            <div className="tag-list">
              {project.drivers.map((item) => (
                <span className="soft-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="info-card">
            <h3>Mitigation playbook</h3>
            <ul className="details-list">
              {project.interventions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="info-card">
            <h3>Milestone health</h3>
            <div className="timeline-list">
              {project.milestones.map((item) => (
                <article className="timeline-item" key={item.label}>
                  <div className="timeline-dot"></div>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.status}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="info-card">
            <h3>Decision log</h3>
            <div className="decision-log">
              {project.decisionLog.map((item) => (
                <article className="decision-item" key={item}>
                  <span className="eyebrow">Logged action</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="details-side">
          <section className="metric-box">
            <span>Risk score</span>
            <h2>{project.riskScore}</h2>
          </section>

          <section className="metric-box">
            <span>Progress</span>
            <h2>{project.progress}%</h2>
          </section>

          <section className="metric-box">
            <span>Predicted cost drift</span>
            <h2>{project.costVariance}</h2>
          </section>

          <section className="info-card">
            <h3>Vendor notes</h3>
            <ul className="details-list compact">
              {project.vendorNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="info-card project-narrative-card">
            <span className="eyebrow">Operational narrative</span>
            <p>
              {project.name} is elevated because the current operating rhythm cannot fully
              offset the combination of external dependency pressure and compressed delivery
              slack around {project.nextMilestone.toLowerCase()}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
