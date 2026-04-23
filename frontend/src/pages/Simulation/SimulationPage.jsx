import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { scenarioPresets } from "../../data/platformData";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../lib/permissions";
import {
  createSimulationRun,
  listProjects,
  listSimulationRuns,
  predictWithMl,
} from "../../lib/workspaceApi";
import "../../styles/pages.css";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function levelFromValue(value, lowThreshold, highThreshold) {
  if (value >= highThreshold) {
    return "High";
  }
  if (value >= lowThreshold) {
    return "Medium";
  }
  return "Low";
}

function mapScenarioToMlPayload(formValues) {
  const vendorRating = clamp(Math.round(formValues.vendor / 20), 1, 5);
  const rainfallLevel = levelFromValue(formValues.timeline, 8, 18);
  const laborAvailability =
    formValues.manpower >= 78 ? "High" : formValues.manpower >= 52 ? "Medium" : "Low";
  const materialAvailability =
    formValues.budget >= 20 ? "High" : formValues.budget >= 10 ? "Medium" : "Low";
  const projectComplexity = levelFromValue(
    formValues.timeline + (100 - formValues.manpower) / 8,
    8,
    16
  );
  const budgetUtilization = clamp(100 - formValues.budget * 1.8, 35, 100);
  const scheduleVarianceDays = clamp(formValues.timeline, -10, 60);
  const complianceIssues = clamp(
    Math.round((100 - formValues.vendor) / 22 + formValues.timeline / 10),
    0,
    8
  );
  const teamExperienceYears = clamp(Number((4 + formValues.manpower / 10).toFixed(1)), 1, 20);
  const changeRequestCount = clamp(
    Math.round((100 - formValues.vendor) / 7 + formValues.timeline / 5),
    0,
    25
  );
  const safetyIncidents = clamp(
    Math.round((formValues.timeline + (100 - formValues.manpower) / 5) / 12),
    0,
    6
  );

  return {
    Vendor_Rating: vendorRating,
    Rainfall_Level: rainfallLevel,
    Labor_Availability: laborAvailability,
    Material_Availability: materialAvailability,
    Project_Complexity: projectComplexity,
    Budget_Utilization: Number(budgetUtilization.toFixed(2)),
    Schedule_Variance_Days: Number(scheduleVarianceDays.toFixed(2)),
    Compliance_Issues: complianceIssues,
    Team_Experience_Years: teamExperienceYears,
    Change_Request_Count: changeRequestCount,
    Safety_Incidents: safetyIncidents,
  };
}

function computeFallbackScenarioOutcome({ budget, vendor, manpower, timeline }) {
  const simulatedRisk = Math.max(
    22,
    92 - budget * 0.72 - vendor * 0.21 - manpower * 0.16 + timeline * 0.96
  );
  const delayProbability = Math.max(
    16,
    86 - budget * 0.58 - manpower * 0.17 - vendor * 0.14 + timeline * 0.88
  );
  const costOverrunCr = Math.max(0.2, 4.4 - budget * 0.06 - vendor * 0.018);

  return {
    simulatedRisk: Number(simulatedRisk.toFixed(0)),
    delayProbability: Number(delayProbability.toFixed(0)),
    costOverrunCr: Number(costOverrunCr.toFixed(1)),
    riskLevel: simulatedRisk > 70 ? "High" : simulatedRisk > 45 ? "Medium" : "Low",
    confidence: 0,
    recommendations: [
      "Run ML forecast to generate data-driven recommendations.",
    ],
  };
}

function SimulationPage() {
  const { hasPermission } = useAuth();
  const canSaveScenarios = hasPermission(PERMISSIONS.SIMULATIONS_WRITE);
  const canRunMl = hasPermission(PERMISSIONS.ML_PREDICT);
  const [projects, setProjects] = useState([]);
  const [savedRuns, setSavedRuns] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [predictionStatus, setPredictionStatus] = useState({
    loading: false,
    error: "",
  });
  const [mlPrediction, setMlPrediction] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "Budget Protection",
    projectId: "",
    budget: 18,
    vendor: 72,
    manpower: 74,
    timeline: 10,
    summary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadSimulationWorkspace() {
      setStatus((currentStatus) => ({ ...currentStatus, loading: true, error: "" }));

      try {
        const [nextRuns, nextProjects] = await Promise.all([
          listSimulationRuns(),
          listProjects(),
        ]);

        if (!isActive) {
          return;
        }

        setSavedRuns(nextRuns);
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

    loadSimulationWorkspace();

    return () => {
      isActive = false;
    };
  }, []);

  const runMlForecast = async (currentValues) => {
    if (!canRunMl) {
      return;
    }

    setPredictionStatus({
      loading: true,
      error: "",
    });

    try {
      const payload = mapScenarioToMlPayload(currentValues);
      const response = await predictWithMl(payload);
      setMlPrediction(response.prediction);
      setPredictionStatus({
        loading: false,
        error: "",
      });
    } catch (error) {
      setPredictionStatus({
        loading: false,
        error: error.message,
      });
    }
  };

  useEffect(() => {
    if (!canRunMl) {
      return;
    }

    let isActive = true;
    const timerId = setTimeout(async () => {
      setPredictionStatus({
        loading: true,
        error: "",
      });

      try {
        const payload = mapScenarioToMlPayload(formValues);
        const response = await predictWithMl(payload);

        if (!isActive) {
          return;
        }

        setMlPrediction(response.prediction);
        setPredictionStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setPredictionStatus({
          loading: false,
          error: error.message,
        });
      }
    }, 320);

    return () => {
      isActive = false;
      clearTimeout(timerId);
    };
  }, [canRunMl, formValues]);

  const applyPreset = (preset) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      name: preset.name,
      budget: preset.budget,
      vendor: preset.vendor,
      manpower: preset.manpower,
      timeline: preset.timeline,
      summary: preset.summary,
    }));
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]:
        ["budget", "vendor", "manpower", "timeline"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSaveScenario = async () => {
    setIsSubmitting(true);
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await createSimulationRun(formValues);
      const nextRuns = await listSimulationRuns();
      setSavedRuns(nextRuns);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Scenario saved successfully.",
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

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === formValues.projectId) ?? null,
    [projects, formValues.projectId]
  );

  const fallbackResults = useMemo(
    () => computeFallbackScenarioOutcome(formValues),
    [formValues]
  );

  const simulationResults = useMemo(() => {
    if (!mlPrediction) {
      return fallbackResults;
    }

    const delayProbability = clamp(
      Math.round(Number(mlPrediction.delay_probability ?? 0) * 100),
      0,
      100
    );
    const predictedCostOverrunPct = clamp(
      Number(mlPrediction.predicted_cost_overrun_pct ?? 0),
      0,
      100
    );
    const costOverrunCr = selectedProject?.budgetCr
      ? Number(((selectedProject.budgetCr * predictedCostOverrunPct) / 100).toFixed(2))
      : Number((predictedCostOverrunPct / 10).toFixed(2));
    const simulatedRisk = clamp(
      Math.round(delayProbability * 0.68 + predictedCostOverrunPct * 0.95),
      0,
      100
    );

    return {
      simulatedRisk,
      delayProbability,
      costOverrunCr: Math.max(0.2, costOverrunCr),
      riskLevel: mlPrediction.risk_level ?? "Medium",
      confidence: Number(mlPrediction.confidence ?? 0),
      recommendations: Array.isArray(mlPrediction.recommendations)
        ? mlPrediction.recommendations
        : fallbackResults.recommendations,
    };
  }, [fallbackResults, mlPrediction, selectedProject]);

  return (
    <div>
      <PageHeader
        eyebrow="Scenario Planning"
        title="Scenario Lab"
        subtitle="Stress-test recovery moves before committing them to the portfolio. This view now uses the trained ML engine for delay and cost forecasting."
        meta={[
          "Delay model (RandomForest)",
          "Cost model (RandomForest)",
          "Rule-based risk and recommendations",
        ]}
        action={
          <div className="form-actions">
            {canRunMl ? (
              <button
                className="secondary-btn"
                type="button"
                onClick={() => runMlForecast(formValues)}
                disabled={predictionStatus.loading}
              >
                {predictionStatus.loading ? "Running AI forecast..." : "Run AI forecast"}
              </button>
            ) : null}
            {canSaveScenarios ? (
              <button
                className="primary-btn"
                type="button"
                onClick={handleSaveScenario}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving scenario..." : "Save scenario"}
              </button>
            ) : null}
          </div>
        }
      />

      {status.message ? <p className="settings-status">{status.message}</p> : null}
      {status.error ? <p className="settings-status form-error">{status.error}</p> : null}
      {predictionStatus.error ? (
        <p className="settings-status form-error">
          ML forecast unavailable, using fallback estimation: {predictionStatus.error}
        </p>
      ) : null}

      <section className="preset-row">
        {scenarioPresets.map((preset) => (
          <button
            className="preset-card"
            key={preset.name}
            type="button"
            onClick={() => applyPreset(preset)}
          >
            <span className="eyebrow">Preset</span>
            <strong>{preset.name}</strong>
            <p>{preset.summary}</p>
          </button>
        ))}
      </section>

      <div className="simulation-grid">
        <section className="simulation-panel">
          <h3>Control variables</h3>

          <div className="form-grid-two compact">
            <input
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleFieldChange}
              placeholder="Scenario name"
            />
            <select name="projectId" value={formValues.projectId} onChange={handleFieldChange}>
              <option value="">Portfolio-wide scenario</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="summary"
            value={formValues.summary}
            onChange={handleFieldChange}
            placeholder="Brief note about this scenario"
            rows="3"
          />

          <div className="simulation-input-block">
            <div className="simulation-input-head">
              <label>Budget flexibility</label>
              <span className="simulation-value">{formValues.budget}%</span>
            </div>
            <input
              name="budget"
              type="range"
              min="0"
              max="30"
              value={formValues.budget}
              onChange={handleFieldChange}
            />
          </div>

          <div className="simulation-input-block">
            <div className="simulation-input-head">
              <label>Vendor reliability</label>
              <span className="simulation-value">{formValues.vendor}</span>
            </div>
            <input
              name="vendor"
              type="range"
              min="20"
              max="100"
              value={formValues.vendor}
              onChange={handleFieldChange}
            />
          </div>

          <div className="simulation-input-block">
            <div className="simulation-input-head">
              <label>Workforce availability</label>
              <span className="simulation-value">{formValues.manpower}</span>
            </div>
            <input
              name="manpower"
              type="range"
              min="20"
              max="100"
              value={formValues.manpower}
              onChange={handleFieldChange}
            />
          </div>

          <div className="simulation-input-block">
            <div className="simulation-input-head">
              <label>Timeline pressure</label>
              <span className="simulation-value">{formValues.timeline}</span>
            </div>
            <input
              name="timeline"
              type="range"
              min="0"
              max="30"
              value={formValues.timeline}
              onChange={handleFieldChange}
            />
          </div>
        </section>

        <section className="simulation-results">
          <div className="metric-box">
            <span>Simulated risk score ({simulationResults.riskLevel})</span>
            <h2>{simulationResults.simulatedRisk}</h2>
          </div>

          <div className="metric-box">
            <span>Predicted delay probability</span>
            <h2>{simulationResults.delayProbability}%</h2>
          </div>

          <div className="metric-box">
            <span>Estimated cost drift</span>
            <h2>INR {simulationResults.costOverrunCr}Cr</h2>
          </div>

          <div className="info-card">
            <h3>Model confidence</h3>
            <p>
              {simulationResults.confidence
                ? `Delay classifier confidence: ${(simulationResults.confidence * 100).toFixed(1)}%`
                : "Confidence is shown after the ML forecast is available."}
            </p>
          </div>

          <div className="info-card">
            <h3>AI recommendations</h3>
            <ul className="details-list compact">
              {simulationResults.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <div className="info-card-head">
              <h3>Saved scenarios</h3>
              <span className="eyebrow">{savedRuns.length} recent runs</span>
            </div>
            {status.loading ? (
              <p>Loading recent saved scenarios...</p>
            ) : (
              <div className="history-stack">
                {savedRuns.map((run) => (
                  <article className="history-item" key={run.id}>
                    <div>
                      <strong>{run.name}</strong>
                      <p>{run.projectName || "Portfolio-wide"}</p>
                    </div>
                    <div className="history-metrics">
                      <span>Risk {run.simulatedRisk}</span>
                      <span>Delay {run.delayProbability}%</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SimulationPage;
