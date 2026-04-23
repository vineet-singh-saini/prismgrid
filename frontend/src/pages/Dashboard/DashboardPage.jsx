import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { getDashboardSummary } from "../../lib/workspaceApi";
import "../../styles/dashboard.css";

const mixColors = ["#4c7f6f", "#cf9c57", "#b65358"];

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
  });

  useEffect(() => {
    let isActive = true;

    async function loadSummary() {
      setStatus({ loading: true, error: "" });

      try {
        const nextSummary = await getDashboardSummary();

        if (!isActive) {
          return;
        }

        setSummary(nextSummary);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus({
          loading: false,
          error: error.message,
        });
      }
    }

    loadSummary();

    return () => {
      isActive = false;
    };
  }, []);

  const dashboardMetrics = summary?.dashboardMetrics ?? [];
  const assistantSuggestions = summary?.assistantSuggestions ?? [];
  const portfolioTrend = summary?.portfolioTrend ?? [];
  const portfolioMix = summary?.portfolioMix ?? [];
  const interventionImpact = summary?.interventionImpact ?? [];
  const complianceItems = summary?.complianceItems ?? [];
  const operationsFeed = summary?.operationsFeed ?? [];
  const topProjects = summary?.topProjects ?? [];
  const projectsTable = summary?.projectsTable ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Executive Control"
        title="Command Center"
        subtitle="A calm operational view across predictive risk, live interventions, vendor drift, and compliance pressure."
        meta={[
          `${projectsTable.length || 0} monitored programs`,
          `${topProjects.length || 0} priority reviews`,
          summary ? "Live workspace data" : "Connecting workspace data",
        ]}
        action={
          <Link className="primary-btn" to="/app/reports">
            Open executive brief
          </Link>
        }
      />

      {status.error ? (
        <section className="info-card page-state">
          <h3>Workspace summary unavailable</h3>
          <p>{status.error}</p>
        </section>
      ) : null}

      <section className="command-hero">
        <div className="command-hero-main">
          <span className="eyebrow">Operational summary</span>
          <h2>
            {topProjects[0]
              ? `${topProjects[0].name} is shaping the current cycle, with ${
                  topProjects.length > 1 ? `${topProjects[1].name} also needing attention.` : "the rest of the portfolio stabilizing."
                }`
              : "Building the command view for your workspace."}
          </h2>
          <p>
            {assistantSuggestions[0]?.body ??
              "As live portfolio data arrives, this command layer will summarize the most material delivery, vendor, and compliance movements in one place."}
          </p>

          <div className="command-hero-actions">
            <Link className="primary-btn" to="/app/alerts">
              Review risk board
            </Link>
            <Link className="secondary-btn" to="/app/simulation">
              Run scenario lab
            </Link>
          </div>
        </div>

        <div className="command-hero-side">
          <span className="eyebrow">Recommended next moves</span>
          <div className="suggestion-list">
            {(assistantSuggestions.length ? assistantSuggestions : [{ title: "Loading suggestions", body: "Crunching current workspace signals.", confidence: "Please wait" }]).map(
              (item) => (
                <article className="suggestion-card" key={item.title}>
                  <div className="suggestion-card-top">
                    <h3>{item.title}</h3>
                    <span>{item.confidence}</span>
                  </div>
                  <p>{item.body}</p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <div className="stats-grid">
        {dashboardMetrics.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="dashboard-grid-two">
        <section className="chart-card">
          <div className="card-head">
            <h3>Portfolio risk and confidence movement</h3>
            <p>Risk stays visible, but confidence is recovering as interventions convert into actions.</p>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioTrend}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c98d37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c98d37" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c7f6f" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#4c7f6f" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(17, 24, 39, 0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#667085" />
                <YAxis stroke="#667085" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#b7791f"
                  fill="url(#riskGradient)"
                  strokeWidth={2.2}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#29695d"
                  fill="url(#confidenceGradient)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card">
          <div className="card-head">
            <h3>Current portfolio mix</h3>
            <p>Balanced visibility across stable, managed watch, and critical watch programs.</p>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={portfolioMix} dataKey="value" innerRadius={66} outerRadius={102}>
                  {portfolioMix.map((item, index) => (
                    <Cell key={item.name} fill={mixColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="dashboard-grid-two">
        <section className="chart-card">
          <div className="card-head">
            <h3>Intervention impact forecast</h3>
            <p>Modeled reduction in risk after currently approved recovery actions.</p>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interventionImpact}>
                <CartesianGrid stroke="rgba(17, 24, 39, 0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#667085" />
                <YAxis stroke="#667085" />
                <Tooltip />
                <Bar dataKey="baseline" fill="#d1a160" radius={[10, 10, 0, 0]} />
                <Bar dataKey="mitigated" fill="#29695d" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="list-card">
          <div className="card-head">
            <h3>Compliance watch</h3>
            <p>Regulatory posture surfaced next to delivery risk, not buried in a separate workflow.</p>
          </div>

          <div className="signal-list">
            {complianceItems.map((item) => (
              <article className="signal-item" key={item.title}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.owner}</p>
                </div>
                <span className={`status-chip ${item.severity}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-grid-two">
        <section className="list-card">
          <div className="card-head">
            <h3>Live operations stream</h3>
            <p>The latest decisions and signal movements shaping this review cycle.</p>
          </div>

          <div className="operations-feed">
            {operationsFeed.map((item) => (
              <article className="feed-item" key={item.title}>
                <div className="feed-dot"></div>
                <div>
                  <h4>{item.title}</h4>
                  <span>{item.meta}</span>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="list-card">
          <div className="card-head">
            <h3>Programs needing immediate review</h3>
            <p>Highest concentration of exposure for the current operating cycle.</p>
          </div>

          <div className="priority-projects">
            {topProjects.map((project) => (
              <article className="priority-project-card" key={project.id}>
                <div>
                  <h4>{project.name}</h4>
                  <p>
                    {project.status} | {project.nextMilestone}
                  </p>
                </div>
                <div className="priority-project-metrics">
                  <strong>{project.riskScore}</strong>
                  <span>Risk score</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="table-card">
        <div className="card-head">
          <h3>Portfolio review table</h3>
          <p>Fast scan of the programs currently shaping PMO attention and executive risk posture.</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Delay %</th>
                <th>Confidence</th>
                <th>Next milestone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projectsTable.map((project) => (
                <tr key={project.id}>
                  <td data-label="Project">
                    <strong>{project.name}</strong>
                    <div className="table-subcopy">
                      {project.region} | {project.manager}
                    </div>
                  </td>
                  <td data-label="Status">
                    <span className={`status-chip ${project.riskLevel}`}>{project.status}</span>
                  </td>
                  <td data-label="Risk">{project.riskScore}</td>
                  <td data-label="Delay %">{project.delayProbability}%</td>
                  <td data-label="Confidence">{project.confidence}%</td>
                  <td data-label="Next milestone">{project.nextMilestone}</td>
                  <td data-label="Action">
                    <Link className="table-link-btn" to={`/app/projects/${project.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {status.loading ? (
        <section className="info-card page-state compact">
          <h3>Loading workspace analytics</h3>
          <p>Pulling projects, alerts, vendors, reports, and saved simulations into the command layer.</p>
        </section>
      ) : null}
    </div>
  );
}

export default DashboardPage;
