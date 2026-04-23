export const appNavigation = [
  { to: "/app/dashboard", label: "Command Center", shortLabel: "Dashboard" },
  { to: "/app/projects", label: "Portfolio", shortLabel: "Projects" },
  { to: "/app/alerts", label: "Risk Board", shortLabel: "Alerts" },
  { to: "/app/simulation", label: "Scenario Lab", shortLabel: "Simulation" },
  { to: "/app/vendors", label: "Vendor Ops", shortLabel: "Vendors" },
  { to: "/app/reports", label: "Reporting", shortLabel: "Reports" },
  { to: "/app/settings", label: "Workspace", shortLabel: "Settings" },
];

export const commandActions = [
  {
    id: "critical-portfolio",
    title: "Open Critical Portfolio",
    description: "Jump to the highest-exposure projects in the portfolio.",
    to: "/app/projects",
    type: "Navigation",
  },
  {
    id: "scenario-lab",
    title: "Run Scenario Lab",
    description: "Simulate funding, timeline, and vendor adjustments.",
    to: "/app/simulation",
    type: "Action",
  },
  {
    id: "risk-board",
    title: "Review Risk Board",
    description: "Triage live alerts and assign next actions.",
    to: "/app/alerts",
    type: "Navigation",
  },
  {
    id: "vendor-watch",
    title: "Inspect Vendor Watchlist",
    description: "See suppliers with reliability drift or compliance flags.",
    to: "/app/vendors",
    type: "Action",
  },
  {
    id: "report-run",
    title: "Open Executive Reporting",
    description: "Review export-ready board and weekly intelligence packs.",
    to: "/app/reports",
    type: "Navigation",
  },
];

export const landingStats = [
  { value: "32%", label: "faster mitigation cycle" },
  { value: "6.8h", label: "average time saved per weekly review" },
  { value: "24/7", label: "continuous portfolio monitoring" },
];

export const landingProof = [
  {
    title: "Delay prediction before slippage compounds",
    detail:
      "Surface schedule drift from procurement, site conditions, and vendor performance before the weekly review catches it.",
  },
  {
    title: "Explainable risk instead of black-box scoring",
    detail:
      "Show the exact drivers, confidence, and recommended intervention path behind every elevated project score.",
  },
  {
    title: "One command layer across teams",
    detail:
      "Portfolio leads, PMOs, vendors, and compliance teams all work from the same operating picture with role-appropriate depth.",
  },
];

export const productModules = [
  {
    name: "Risk Intelligence",
    summary:
      "Portfolio-wide signals, predictive scoring, and narrative summaries built into the flow of work.",
  },
  {
    name: "Vendor Ops",
    summary:
      "Reliability scoring, drift detection, compliance risk, and remediation pathways for supplier-heavy programs.",
  },
  {
    name: "Scenario Lab",
    summary:
      "What-if modeling for budget, vendor swaps, sequencing, workforce allocation, and schedule compression.",
  },
  {
    name: "Compliance Watch",
    summary:
      "Regulatory checkpoints, audit posture, document gaps, and proactive alerts on changing obligations.",
  },
  {
    name: "Collaboration Layer",
    summary:
      "Decision logs, stakeholder tagging, review notes, and shared operating context without email chaos.",
  },
  {
    name: "Executive Reporting",
    summary:
      "Board-ready exports, narrative insights, drill-down packs, and leadership-ready weekly briefings.",
  },
];

export const landingWorkflow = [
  {
    step: "01",
    title: "Ingest fragmented operational signals",
    detail:
      "Schedules, cost controls, vendor feeds, compliance updates, field observations, and weather risk are normalized into one workspace.",
  },
  {
    step: "02",
    title: "Score exposure with explainable intelligence",
    detail:
      "Risk models combine historical patterns with live operational changes to estimate delay and cost pressure.",
  },
  {
    step: "03",
    title: "Trigger interventions before the review cycle",
    detail:
      "Teams receive ranked actions, ownership cues, and simulation paths while there is still time to act.",
  },
];

export const dashboardMetrics = [
  {
    title: "Projects Under Active Surveillance",
    value: "14",
    change: "3 newly promoted to watchlist this week",
    tone: "neutral",
  },
  {
    title: "Portfolio Delay Exposure",
    value: "61%",
    change: "Down 4 pts after vendor recovery actions",
    tone: "warning",
  },
  {
    title: "Predicted Cost Drift",
    value: "INR 3.2Cr",
    change: "Largest driver: bridge and signaling packages",
    tone: "danger",
  },
  {
    title: "Mitigations In Motion",
    value: "09",
    change: "5 owned by PMO, 4 with vendors",
    tone: "success",
  },
];

export const portfolioTrend = [
  { month: "Jan", risk: 44, delay: 39, cost: 33, confidence: 71 },
  { month: "Feb", risk: 48, delay: 43, cost: 36, confidence: 74 },
  { month: "Mar", risk: 56, delay: 49, cost: 42, confidence: 76 },
  { month: "Apr", risk: 63, delay: 55, cost: 47, confidence: 78 },
  { month: "May", risk: 67, delay: 61, cost: 54, confidence: 81 },
  { month: "Jun", risk: 61, delay: 57, cost: 49, confidence: 84 },
];

export const portfolioMix = [
  { name: "Stable", value: 4 },
  { name: "Watch", value: 6 },
  { name: "Critical", value: 4 },
];

export const interventionImpact = [
  { name: "Metro Phase 2", baseline: 78, mitigated: 63 },
  { name: "Bridge Link", baseline: 72, mitigated: 58 },
  { name: "Solar Grid", baseline: 59, mitigated: 46 },
  { name: "Water Network", baseline: 41, mitigated: 34 },
];

export const workspaceLenses = [
  "Executive Control",
  "Program Delivery",
  "Vendor Oversight",
];

export const assistantSuggestions = [
  {
    title: "Re-sequence inspection windows for Bridge Link",
    body:
      "Moving environmental checks ahead of concrete reserve delivery improves confidence by 8 points with minimal budget impact.",
    confidence: "84% confidence",
  },
  {
    title: "Escalate Nova Steel to managed watchlist",
    body:
      "Recent reliability drift and two unresolved compliance gaps create a material risk to the signaling dependency chain.",
    confidence: "High priority",
  },
  {
    title: "Protect float on Metro traction systems",
    body:
      "Procurement slippage is starting to compress downstream testing windows faster than field teams can recover.",
    confidence: "Time sensitive",
  },
];

export const operationsFeed = [
  {
    title: "PMO approved alternate logistics route",
    meta: "Western Solar Grid | 11 mins ago",
    detail: "Expected to recover 3 days of transport delay on inverter shipments.",
  },
  {
    title: "Compliance checkpoint slipped",
    meta: "Riverfront Bridge Link | 34 mins ago",
    detail: "Environmental review packet missing latest riverbed survey attachment.",
  },
  {
    title: "Vendor reliability improved",
    meta: "Axis Infra Supply | 1 hr ago",
    detail: "On-time delivery score climbed back above 90 after route balancing.",
  },
  {
    title: "Scenario saved to mitigation board",
    meta: "Metro Line Phase 2 | 2 hrs ago",
    detail: "Budget +7% and dual-sourcing option shared with leadership team.",
  },
];

export const complianceItems = [
  {
    title: "Rail safety inspection renewal",
    owner: "Compliance Office",
    status: "Due in 4 days",
    severity: "warning",
  },
  {
    title: "Bridge environmental packet update",
    owner: "Site Engineering",
    status: "Attention required",
    severity: "danger",
  },
  {
    title: "Solar transmission permit review",
    owner: "Regional Legal",
    status: "On track",
    severity: "success",
  },
];

export const projects = [
  {
    id: "metro-phase-2",
    code: "PRM-201",
    name: "Metro Line Phase 2",
    region: "Delhi NCR",
    sector: "Urban Mobility",
    status: "Critical watch",
    riskLevel: "high",
    riskScore: 82,
    progress: 68,
    confidence: 84,
    delayProbability: 71,
    costVariance: "INR 1.2Cr",
    budget: "INR 120Cr",
    spent: "INR 84Cr",
    manager: "Aarav Mehta",
    nextMilestone: "Traction package approvals",
    deadline: "20 Jul 2026",
    summary:
      "Signal volatility is being driven by traction procurement slippage and lower vendor responsiveness across two key packages.",
    drivers: [
      "Vendor response time dropped 18%",
      "Procurement approvals delayed by 6 days",
      "Testing float compressed by downstream access constraints",
    ],
    interventions: [
      "Activate reserve supplier shortlist for traction hardware",
      "Ringfence PMO approval window for safety-critical purchases",
      "Shift non-critical workforce to station integration backlog",
    ],
    milestones: [
      { label: "Civil packages locked", status: "Completed" },
      { label: "Traction package approvals", status: "At risk" },
      { label: "Integrated systems testing", status: "Upcoming" },
    ],
    decisionLog: [
      "Dual-sourcing scenario moved to leadership review",
      "Weekend procurement checkpoint added for the next two cycles",
    ],
    vendorNotes: [
      "Nova Steel Partners flagged for backup sourcing",
      "Axis Infra Supply maintaining delivery SLA",
    ],
  },
  {
    id: "western-solar-grid",
    code: "PRM-188",
    name: "Western Solar Grid",
    region: "Rajasthan",
    sector: "Energy",
    status: "Managed watch",
    riskLevel: "medium",
    riskScore: 61,
    progress: 57,
    confidence: 79,
    delayProbability: 48,
    costVariance: "INR 0.7Cr",
    budget: "INR 95Cr",
    spent: "INR 61Cr",
    manager: "Riya Sethi",
    nextMilestone: "Inverter field deployment",
    deadline: "14 Aug 2026",
    summary:
      "Permitting and logistics remain the biggest swing factors, but risk is trending down after route adjustments.",
    drivers: [
      "Transmission permit still awaiting final confirmation",
      "Transport lead time volatile during heat-wave routing windows",
      "Crew availability improving after staffing adjustment",
    ],
    interventions: [
      "Maintain alternate logistics route for inverter clusters",
      "Escalate permit follow-up with regional liaison",
      "Keep workforce redistribution plan active for deployment crews",
    ],
    milestones: [
      { label: "Site grading complete", status: "Completed" },
      { label: "Inverter field deployment", status: "In progress" },
      { label: "Transmission readiness review", status: "Upcoming" },
    ],
    decisionLog: [
      "Heat-risk routing approved for northern delivery corridor",
      "Permit dependencies added to weekly leadership brief",
    ],
    vendorNotes: [
      "BuildCore Logistics on monitored improvement plan",
      "TerraGrid Systems maintaining low deviation profile",
    ],
  },
  {
    id: "riverfront-bridge-link",
    code: "PRM-162",
    name: "Riverfront Bridge Link",
    region: "Ahmedabad",
    sector: "Transport",
    status: "Critical watch",
    riskLevel: "high",
    riskScore: 76,
    progress: 79,
    confidence: 82,
    delayProbability: 64,
    costVariance: "INR 0.9Cr",
    budget: "INR 88Cr",
    spent: "INR 72Cr",
    manager: "Kabir Anand",
    nextMilestone: "Inspection and pour sequence",
    deadline: "02 Jun 2026",
    summary:
      "Inspection backlog and concrete reserve instability are lifting risk despite strong construction progress.",
    drivers: [
      "Inspection queue causing sequential site idle windows",
      "Concrete package price drift above monthly trend",
      "River condition alerts affecting schedule confidence",
    ],
    interventions: [
      "Fast-track reserve inspection schedule with compliance team",
      "Lock material buffer for the next two pours",
      "Advance non-river tasks while weather window remains uncertain",
    ],
    milestones: [
      { label: "Structural span completion", status: "Completed" },
      { label: "Inspection and pour sequence", status: "At risk" },
      { label: "Environmental sign-off", status: "Attention" },
    ],
    decisionLog: [
      "Inspection escalation approved by PMO",
      "Reserve material strategy shared with finance controls",
    ],
    vendorNotes: [
      "Nova Steel Partners remains high risk",
      "Concrete supplier monitoring moved to daily cadence",
    ],
  },
  {
    id: "smart-highway-corridor",
    code: "PRM-145",
    name: "Smart Highway Corridor",
    region: "Mumbai-Pune",
    sector: "Mobility Tech",
    status: "Managed watch",
    riskLevel: "medium",
    riskScore: 58,
    progress: 63,
    confidence: 75,
    delayProbability: 44,
    costVariance: "INR 0.5Cr",
    budget: "INR 150Cr",
    spent: "INR 102Cr",
    manager: "Vihaan Malhotra",
    nextMilestone: "Utility shift completion",
    deadline: "05 Oct 2026",
    summary:
      "Utility shifting and vendor handoffs are the main pressure points, but the program remains recoverable.",
    drivers: [
      "Overlapping ownership on sensor and signage packages",
      "Utility relocation sequence has low schedule slack",
      "Minor scope creep requests entering approval queue",
    ],
    interventions: [
      "Freeze non-essential change requests for two reporting cycles",
      "Separate package ownership across corridor segments",
      "Prioritize utility coordination in daily standups",
    ],
    milestones: [
      { label: "Roadway enhancement packages", status: "Completed" },
      { label: "Utility shift completion", status: "In progress" },
      { label: "Smart systems integration", status: "Upcoming" },
    ],
    decisionLog: [
      "Scope freeze endorsed by delivery lead",
      "Segment-based ownership matrix issued to field managers",
    ],
    vendorNotes: [
      "TerraGrid Systems stable",
      "Shared vendor interface needs tighter weekly review",
    ],
  },
  {
    id: "eastern-water-network",
    code: "PRM-133",
    name: "Eastern Water Network",
    region: "Kolkata",
    sector: "Utilities",
    status: "Stable",
    riskLevel: "low",
    riskScore: 37,
    progress: 48,
    confidence: 87,
    delayProbability: 21,
    costVariance: "INR 0.2Cr",
    budget: "INR 73Cr",
    spent: "INR 43Cr",
    manager: "Ananya Roy",
    nextMilestone: "Monitoring unit deployment",
    deadline: "18 Nov 2026",
    summary:
      "The project is performing steadily, with low procurement friction and healthy vendor responsiveness.",
    drivers: [
      "Localized logistics risk remains contained",
      "Civic coordination cadence is stable",
      "Procurement pipeline is within expected variance",
    ],
    interventions: [
      "Maintain current monitoring rhythm",
      "Preserve vendor response SLAs",
      "Continue monthly variance review without escalation",
    ],
    milestones: [
      { label: "Pipe replacement phase one", status: "Completed" },
      { label: "Monitoring unit deployment", status: "Upcoming" },
      { label: "Network optimization tuning", status: "Upcoming" },
    ],
    decisionLog: [
      "No escalation needed during latest PMO review",
      "Monitoring cadence held at current weekly rhythm",
    ],
    vendorNotes: [
      "Axis Infra Supply and TerraGrid both within threshold",
      "No compliance exceptions in current cycle",
    ],
  },
];

export const alerts = [
  {
    id: "alt-01",
    severity: "high",
    title: "Vendor-driven delay risk spiking on Metro traction package",
    project: "Metro Line Phase 2",
    owner: "PMO Procurement",
    time: "10 mins ago",
    reason:
      "Supplier responsiveness dropped and approval latency is starting to compress systems testing float.",
    recommendation:
      "Escalate reserve supplier activation and protect this week's decision window from non-critical reviews.",
  },
  {
    id: "alt-02",
    severity: "medium",
    title: "Inspection backlog threatening bridge pour sequence",
    project: "Riverfront Bridge Link",
    owner: "Compliance + Site Engineering",
    time: "34 mins ago",
    reason:
      "Inspection handoffs are stacking up faster than the team can recover on the next concrete cycle.",
    recommendation:
      "Prioritize environmental packet completion and secure a dedicated inspection recovery window.",
  },
  {
    id: "alt-03",
    severity: "medium",
    title: "Permit confirmation lag still visible in solar deployment path",
    project: "Western Solar Grid",
    owner: "Regional Legal",
    time: "1 hr ago",
    reason:
      "Permitting uncertainty remains the largest contributor to forecast variance despite logistics improvements.",
    recommendation:
      "Escalate permit liaison follow-up and keep alternate routing live until confirmation lands.",
  },
  {
    id: "alt-04",
    severity: "low",
    title: "Scope creep entering smart corridor approvals",
    project: "Smart Highway Corridor",
    owner: "Program Lead",
    time: "Today",
    reason:
      "Non-essential requests are consuming coordination bandwidth and may dilute recovery focus.",
    recommendation:
      "Enforce scope freeze for the next two cycles and route exceptions to weekly steering only.",
  },
];

export const vendors = [
  {
    name: "Axis Infra Supply",
    reliability: 92,
    delayedDeliveries: 1,
    complianceIssues: 0,
    costDeviation: "Low",
    riskLevel: "low",
    status: "Preferred",
    note: "Strong recovery and consistent schedule protection across two portfolios.",
  },
  {
    name: "BuildCore Logistics",
    reliability: 69,
    delayedDeliveries: 4,
    complianceIssues: 1,
    costDeviation: "Medium",
    riskLevel: "medium",
    status: "Monitored",
    note: "Improving after route rebalancing, but still volatile under weather pressure.",
  },
  {
    name: "Nova Steel Partners",
    reliability: 48,
    delayedDeliveries: 7,
    complianceIssues: 2,
    costDeviation: "High",
    riskLevel: "high",
    status: "Watchlist",
    note: "Current weakest link across signaling and bridge dependency chains.",
  },
  {
    name: "TerraGrid Systems",
    reliability: 81,
    delayedDeliveries: 2,
    complianceIssues: 0,
    costDeviation: "Low",
    riskLevel: "low",
    status: "Stable",
    note: "Healthy vendor profile with low variance and predictable support cadence.",
  },
];

export const reports = [
  {
    title: "Executive Risk Command Brief",
    subtitle:
      "Board-ready portfolio summary with key exposure drivers, interventions, and recovery confidence.",
    status: "Ready",
    cadence: "Weekly Monday 08:00",
  },
  {
    title: "Vendor Reliability & Compliance Pack",
    subtitle:
      "Delay trends, supplier heat checks, and remediation watchlists for high-dependency programs.",
    status: "Ready",
    cadence: "Every Wednesday",
  },
  {
    title: "Scenario Decision Review",
    subtitle:
      "Saved what-if models comparing mitigation cost, timing, and confidence outcomes.",
    status: "Draft",
    cadence: "Ad hoc",
  },
];

export const scenarioPresets = [
  {
    name: "Budget Protection",
    budget: 18,
    vendor: 72,
    manpower: 74,
    timeline: 10,
    summary: "Adds limited budget flexibility while preserving current sequencing.",
  },
  {
    name: "Aggressive Recovery",
    budget: 24,
    vendor: 78,
    manpower: 88,
    timeline: 8,
    summary: "Pushes workforce and vendor capacity to recover schedule confidence quickly.",
  },
  {
    name: "Vendor Swap",
    budget: 14,
    vendor: 90,
    manpower: 69,
    timeline: 12,
    summary: "Simulates reliability recovery through stronger vendor performance.",
  },
];
