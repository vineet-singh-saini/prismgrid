import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { buildDefaultMilestones, parseLineList } from "../../lib/formUtils";
import { PERMISSIONS } from "../../lib/permissions";
import { createProject, listProjects } from "../../lib/workspaceApi";
import "../../styles/pages.css";

const initialProjectForm = {
  code: "",
  name: "",
  region: "",
  sector: "",
  status: "Managed watch",
  riskLevel: "medium",
  riskScore: 60,
  progress: 20,
  confidence: 74,
  delayProbability: 42,
  costVarianceCr: 0.4,
  budgetCr: 40,
  spentCr: 8,
  manager: "",
  nextMilestone: "",
  deadlineAt: "",
  summary: "",
  drivers: "",
  interventions: "",
  decisionLog: "",
  vendorNotes: "",
};

function ProjectsPage() {
  const { user, hasPermission } = useAuth();
  const canWriteProjects = hasPermission(PERMISSIONS.PROJECTS_WRITE);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    ...initialProjectForm,
    manager: user?.fullName ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setProjectForm((currentForm) => ({
      ...currentForm,
      manager: currentForm.manager || user?.fullName || "",
    }));
  }, [user]);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      setStatus((currentStatus) => ({
        ...currentStatus,
        loading: true,
        error: "",
      }));

      try {
        const nextProjects = await listProjects({
          search,
          risk: riskFilter,
          status: statusFilter,
        });

        if (!isActive) {
          return;
        }

        setProjects(nextProjects);
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

    loadProjects();

    return () => {
      isActive = false;
    };
  }, [riskFilter, search, statusFilter]);

  const meta = useMemo(
    () => [
      `${projects.length} tracked programs`,
      `${projects.filter((project) => project.riskLevel === "high").length} critical watch`,
      canWriteProjects ? "Create and update enabled" : "Read-only access",
    ],
    [canWriteProjects, projects]
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setStatus((currentStatus) => ({ ...currentStatus, message: "", error: "" }));
    setIsSubmitting(true);

    try {
      const payload = {
        ...projectForm,
        riskScore: Number(projectForm.riskScore),
        progress: Number(projectForm.progress),
        confidence: Number(projectForm.confidence),
        delayProbability: Number(projectForm.delayProbability),
        costVarianceCr: Number(projectForm.costVarianceCr),
        budgetCr: Number(projectForm.budgetCr),
        spentCr: Number(projectForm.spentCr),
        drivers: parseLineList(projectForm.drivers),
        interventions: parseLineList(projectForm.interventions),
        decisionLog: parseLineList(projectForm.decisionLog),
        vendorNotes: parseLineList(projectForm.vendorNotes),
        milestones: buildDefaultMilestones(projectForm.nextMilestone || "Executive review"),
      };

      await createProject(payload);
      const nextProjects = await listProjects({
        search,
        risk: riskFilter,
        status: statusFilter,
      });

      setProjects(nextProjects);
      setProjectForm({
        ...initialProjectForm,
        manager: user?.fullName ?? "",
      });
      setProjectFormOpen(false);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Project workspace created successfully.",
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

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio View"
        title="Projects"
        subtitle="A delivery-first view of schedule exposure, forecast confidence, and intervention readiness across the portfolio."
        meta={meta}
        action={
          canWriteProjects ? (
            <button
              className="primary-btn"
              type="button"
              onClick={() => setProjectFormOpen((currentValue) => !currentValue)}
            >
              {projectFormOpen ? "Close project form" : "Create project workspace"}
            </button>
          ) : null
        }
      />

      {projectFormOpen ? (
        <section className="info-card form-shell">
          <div className="info-card-head">
            <h3>Create project workspace</h3>
            <span className="eyebrow">Live Mongo-backed portfolio record</span>
          </div>

          <form className="form-grid" onSubmit={handleCreateProject}>
            <div className="form-grid-two">
              <input
                required
                name="code"
                type="text"
                value={projectForm.code}
                onChange={handleFormChange}
                placeholder="Program code"
              />
              <input
                required
                name="name"
                type="text"
                value={projectForm.name}
                onChange={handleFormChange}
                placeholder="Project name"
              />
              <input
                required
                name="region"
                type="text"
                value={projectForm.region}
                onChange={handleFormChange}
                placeholder="Region"
              />
              <input
                required
                name="sector"
                type="text"
                value={projectForm.sector}
                onChange={handleFormChange}
                placeholder="Sector"
              />
              <input
                required
                name="manager"
                type="text"
                value={projectForm.manager}
                onChange={handleFormChange}
                placeholder="Program owner"
              />
              <input
                required
                name="nextMilestone"
                type="text"
                value={projectForm.nextMilestone}
                onChange={handleFormChange}
                placeholder="Next milestone"
              />
              <input
                required
                name="deadlineAt"
                type="date"
                value={projectForm.deadlineAt}
                onChange={handleFormChange}
              />
              <select name="status" value={projectForm.status} onChange={handleFormChange}>
                <option>Stable</option>
                <option>Managed watch</option>
                <option>Critical watch</option>
              </select>
              <select name="riskLevel" value={projectForm.riskLevel} onChange={handleFormChange}>
                <option value="low">Stable / low risk</option>
                <option value="medium">Managed watch</option>
                <option value="high">Critical watch</option>
              </select>
              <input
                required
                min="0"
                max="100"
                name="riskScore"
                type="number"
                value={projectForm.riskScore}
                onChange={handleFormChange}
                placeholder="Risk score"
              />
              <input
                required
                min="0"
                max="100"
                name="progress"
                type="number"
                value={projectForm.progress}
                onChange={handleFormChange}
                placeholder="Progress"
              />
              <input
                required
                min="0"
                max="100"
                name="confidence"
                type="number"
                value={projectForm.confidence}
                onChange={handleFormChange}
                placeholder="Confidence"
              />
              <input
                required
                min="0"
                max="100"
                name="delayProbability"
                type="number"
                value={projectForm.delayProbability}
                onChange={handleFormChange}
                placeholder="Delay probability"
              />
              <input
                required
                min="0"
                step="0.1"
                name="costVarianceCr"
                type="number"
                value={projectForm.costVarianceCr}
                onChange={handleFormChange}
                placeholder="Cost variance (Cr)"
              />
              <input
                required
                min="0"
                step="0.1"
                name="budgetCr"
                type="number"
                value={projectForm.budgetCr}
                onChange={handleFormChange}
                placeholder="Budget (Cr)"
              />
              <input
                required
                min="0"
                step="0.1"
                name="spentCr"
                type="number"
                value={projectForm.spentCr}
                onChange={handleFormChange}
                placeholder="Spent (Cr)"
              />
            </div>

            <textarea
              required
              name="summary"
              value={projectForm.summary}
              onChange={handleFormChange}
              placeholder="Program summary"
              rows="4"
            />
            <textarea
              required
              name="drivers"
              value={projectForm.drivers}
              onChange={handleFormChange}
              placeholder="Primary risk drivers, one per line"
              rows="4"
            />
            <textarea
              required
              name="interventions"
              value={projectForm.interventions}
              onChange={handleFormChange}
              placeholder="Mitigation playbook actions, one per line"
              rows="4"
            />
            <textarea
              name="decisionLog"
              value={projectForm.decisionLog}
              onChange={handleFormChange}
              placeholder="Decision log entries, one per line"
              rows="3"
            />
            <textarea
              name="vendorNotes"
              value={projectForm.vendorNotes}
              onChange={handleFormChange}
              placeholder="Vendor notes, one per line"
              rows="3"
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating project..." : "Create project"}
              </button>
              <button
                className="secondary-btn"
                type="button"
                onClick={() => setProjectFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {status.message ? <p className="settings-status">{status.message}</p> : null}
      {status.error ? <p className="settings-status form-error">{status.error}</p> : null}

      <section className="filters-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by project, region, manager, or code"
        />

        <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
          <option value="all">All risk bands</option>
          <option value="high">Critical watch</option>
          <option value="medium">Managed watch</option>
          <option value="low">Stable</option>
        </select>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="critical">Critical watch</option>
          <option value="managed">Managed watch</option>
          <option value="stable">Stable</option>
        </select>
      </section>

      {status.loading ? (
        <section className="info-card page-state compact">
          <h3>Loading project workspaces</h3>
          <p>Filtering live portfolio records from MongoDB.</p>
        </section>
      ) : null}

      {!status.loading && !projects.length ? (
        <section className="info-card page-state">
          <h3>No projects match the current filters</h3>
          <p>Adjust the filters or create a new project workspace to expand the portfolio.</p>
        </section>
      ) : null}

      <section className="project-card-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-top">
              <div>
                <span className="eyebrow">{project.code}</span>
                <h3>{project.name}</h3>
                <p>
                  {project.region} | {project.sector}
                </p>
              </div>
              <span className={`status-chip ${project.riskLevel}`}>{project.status}</span>
            </div>

            <p className="project-card-summary">{project.summary}</p>

            <div className="project-card-metrics">
              <div>
                <span>Risk score</span>
                <strong>{project.riskScore}</strong>
              </div>
              <div>
                <span>Delay probability</span>
                <strong>{project.delayProbability}%</strong>
              </div>
              <div>
                <span>Confidence</span>
                <strong>{project.confidence}%</strong>
              </div>
              <div>
                <span>Next milestone</span>
                <strong>{project.nextMilestone}</strong>
              </div>
            </div>

            <div className="project-card-footer">
              <div className="project-card-meta">
                <span>{project.manager}</span>
                <span>{project.deadline}</span>
              </div>

              <Link className="table-link-btn" to={`/app/projects/${project.id}`}>
                Open workspace
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ProjectsPage;
