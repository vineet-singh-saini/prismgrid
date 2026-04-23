import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiCommand, FiShield, FiUsers } from "react-icons/fi";
import SectionHeading from "../../components/common/SectionHeading";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import {
  landingProof,
  landingStats,
  landingWorkflow,
  productModules,
} from "../../data/platformData";
import "../../styles/landing.css";

const productionPillars = [
  {
    title: "Explainable intelligence",
    detail:
      "Every recommendation is tied to visible operational signals so teams can act with context, not just confidence scores.",
    icon: <FiCheckCircle />,
  },
  {
    title: "Collaboration without sprawl",
    detail:
      "Decision logs, ownership context, and review rhythm live inside the operational workspace instead of scattered threads.",
    icon: <FiUsers />,
  },
  {
    title: "Compliance built into flow",
    detail:
      "Regulatory posture sits beside delivery signals, so audit pressure and schedule pressure can be managed together.",
    icon: <FiShield />,
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      <main>
        <section className="hero-section" id="platform">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="section-tag">Phase 1 production frontend</span>
              <h1 className="hero-title">
                Turn fragmented project execution into a calm, predictive command layer.
              </h1>
              <p className="hero-text">
                PRISM-GRID is an AI-powered project intelligence platform for delay prediction,
                cost drift prevention, vendor oversight, scenario planning, and executive
                decision support across large-scale infrastructure programs.
              </p>

              <div className="hero-actions">
                <Link className="primary-btn" to="/app/dashboard">
                  Open Command Center
                  <FiArrowRight />
                </Link>
                <a className="secondary-btn" href="#workflow">
                  See operating model
                </a>
              </div>

              <div className="hero-metrics">
                {landingStats.map((item) => (
                  <div key={item.label} className="hero-metric-card">
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-panel">
              <div className="hero-panel-top">
                <div>
                  <span className="eyebrow">Live operating canvas</span>
                  <h3>National Infra PMO</h3>
                </div>
                <div className="status-chip success">Signal sync healthy</div>
              </div>

              <div className="hero-preview-grid">
                <div className="preview-card preview-card-primary">
                  <span className="eyebrow">Delay exposure</span>
                  <h4>61%</h4>
                  <p>Recovery actions on 9 interventions are currently in motion.</p>
                </div>

                <div className="preview-card">
                  <span className="eyebrow">Active watchlist</span>
                  <ul className="preview-list">
                    <li>
                      <strong>Ward 12 Road and Drain Upgrade</strong>
                      <span>Rain delay risk</span>
                    </li>
                    <li>
                      <strong>Govt School Block A Repair</strong>
                      <span>Furniture sequencing</span>
                    </li>
                  </ul>
                </div>

                <div className="preview-card preview-card-wide">
                  <div className="preview-card-head">
                    <span className="eyebrow">AI explanation</span>
                    <FiCommand />
                  </div>
                  <p>
                    Risk rose on Ward 12 because rain windows and late truck arrivals are
                    reducing daily output more than the current recovery plan can absorb.
                  </p>
                </div>

                <div className="preview-card">
                  <span className="eyebrow">Intervention stack</span>
                  <div className="mini-stack">
                    <span>Vendor swap scenario</span>
                    <span>Compliance fast-track</span>
                    <span>Workforce rebalance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading
              tag="Why It Matters"
              title="A proactive operating model for infrastructure teams running high-cost, multi-party execution."
              subtitle="PRISM-GRID is designed to replace reactive dashboard checking with predictive coordination, explainable intelligence, and faster intervention cycles."
            />

            <div className="proof-grid">
              {landingProof.map((item) => (
                <article className="proof-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section workflow-section" id="workflow">
          <div className="container">
            <SectionHeading
              tag="Operating Model"
              title="From fragmented data to interventions that teams can actually execute."
              subtitle="The production direction centers on one shared operational picture with progressive disclosure for leadership, PMOs, vendors, and compliance teams."
              center
            />

            <div className="workflow-track">
              {landingWorkflow.map((item) => (
                <article className="workflow-step" key={item.step}>
                  <span>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="modules">
          <div className="container">
            <SectionHeading
              tag="Feature System"
              title="The product is organized as a modular command surface, not a pile of disconnected pages."
              subtitle="Each module is shaped around real PMO workflows: observe, explain, decide, coordinate, and report."
            />

            <div className="modules-grid">
              {productModules.map((module) => (
                <article className="module-card" key={module.name}>
                  <span className="eyebrow">Module</span>
                  <h3>{module.name}</h3>
                  <p>{module.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section production-section">
          <div className="container production-grid">
            <div>
              <SectionHeading
                tag="Production Path"
                title="Designed to scale from a premium frontend prototype into a full MERN + AI platform."
                subtitle="This frontend milestone now reflects the real product architecture: risk intelligence, vendor scoring, compliance visibility, simulation workflows, and leadership reporting."
              />
            </div>

            <div className="production-stack">
              {productionPillars.map((pillar) => (
                <article className="production-card" key={pillar.title}>
                  <div className="production-icon">{pillar.icon}</div>
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-card">
              <div>
                <span className="section-tag">Next build phase</span>
                <h2>Move from polished frontend to connected production stack.</h2>
                <p>
                  The redesigned workspace is now structured for API integration, real auth,
                  live data feeds, explainable AI, vendor collaboration, and export-ready
                  reporting without rethinking the entire UX later.
                </p>
              </div>

              <div className="cta-actions">
                <Link className="primary-btn" to="/app/dashboard">
                  Explore the workspace
                </Link>
                <Link className="secondary-btn" to="/signup">
                  Open onboarding flow
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
