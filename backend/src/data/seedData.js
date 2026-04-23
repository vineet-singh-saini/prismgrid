export const seedVendors = [
  {
    name: "Sharma Building Materials",
    reliability: 88,
    delayedDeliveries: 1,
    complianceIssues: 0,
    costDeviation: "Low",
    riskLevel: "low",
    status: "Preferred",
    note: "Delivers cement and aggregates on time for most weekly batches.",
  },
  {
    name: "City Transport Seva",
    reliability: 71,
    delayedDeliveries: 3,
    complianceIssues: 1,
    costDeviation: "Medium",
    riskLevel: "medium",
    status: "Monitored",
    note: "Delivery timing slips during market rush hours, needs fixed slots.",
  },
  {
    name: "Ganga Pipes and Steel",
    reliability: 63,
    delayedDeliveries: 4,
    complianceIssues: 1,
    costDeviation: "Medium",
    riskLevel: "medium",
    status: "Watchlist",
    note: "Pipe stock is available, but dispatch commitments vary week to week.",
  },
];

export const seedProjects = [
  {
    slug: "ward-12-road-drain-upgrade",
    code: "PG-001",
    name: "Ward 12 Road and Drain Upgrade",
    region: "Indore",
    sector: "Civic Infrastructure",
    status: "Managed watch",
    riskLevel: "medium",
    riskScore: 59,
    progress: 46,
    confidence: 81,
    delayProbability: 38,
    costVarianceCr: 0.3,
    budgetCr: 9.5,
    spentCr: 4.6,
    manager: "Rohit Patil",
    nextMilestone: "Main lane concrete pour",
    deadlineAt: "2026-09-15T00:00:00.000Z",
    summary:
      "A basic city-level project focused on repairing roads and side drains in Ward 12 before monsoon peak.",
    drivers: [
      "Evening rainfall is delaying concrete curing by one to two days.",
      "Material truck arrivals are inconsistent during peak bazaar traffic.",
      "Drain chamber layout changed after resident feedback.",
    ],
    interventions: [
      "Shift concrete activity to early-morning work windows for two weeks.",
      "Lock fixed unloading slots with local transport vendor.",
      "Freeze drawing changes after ward engineer sign-off.",
    ],
    milestones: [
      { label: "Drain cleaning and marking", status: "Completed" },
      { label: "Main lane concrete pour", status: "In progress" },
      { label: "Final surface finishing", status: "Upcoming" },
    ],
    decisionLog: [
      "Work timings moved to 6 AM start to avoid traffic and rain overlap.",
      "Extra curing sheets approved for rainy-day protection.",
    ],
    vendorNotes: [
      "Sharma Building Materials remains stable for cement supply.",
      "City Transport Seva needs tighter truck dispatch tracking.",
    ],
  },
  {
    slug: "govt-school-block-a-repair",
    code: "PG-002",
    name: "Govt School Block A Repair",
    region: "Ujjain",
    sector: "Public Buildings",
    status: "Stable",
    riskLevel: "low",
    riskScore: 34,
    progress: 58,
    confidence: 88,
    delayProbability: 19,
    costVarianceCr: 0.1,
    budgetCr: 2.8,
    spentCr: 1.7,
    manager: "Neha Verma",
    nextMilestone: "Classroom repaint and bench setup",
    deadlineAt: "2026-07-28T00:00:00.000Z",
    summary:
      "A straightforward school repair project for classroom paint, minor civil patchwork, and furniture setup.",
    drivers: [
      "Furniture arrival schedule needs one-day advance confirmation.",
      "Paint drying time depends on humidity in closed rooms.",
      "Weekend work gives faster classroom handover.",
    ],
    interventions: [
      "Take furniture delivery confirmation every evening for next-day work.",
      "Keep one spare paint team for fast room rotation.",
      "Complete noisy patchwork after school hours only.",
    ],
    milestones: [
      { label: "Wall crack patching", status: "Completed" },
      { label: "Classroom repaint and bench setup", status: "In progress" },
      { label: "Final quality check", status: "Upcoming" },
    ],
    decisionLog: [
      "Weekend shift approved to avoid class disruption.",
      "Furniture unloading point changed to rear gate for smoother access.",
    ],
    vendorNotes: [
      "Ganga Pipes and Steel provided timely support for minor fittings.",
      "Local transport partner is stable for school-scope deliveries.",
    ],
  },
];

export const seedAlerts = [
  {
    severity: "medium",
    title: "Rain window is slowing concrete progress in Ward 12",
    projectSlug: "ward-12-road-drain-upgrade",
    projectName: "Ward 12 Road and Drain Upgrade",
    owner: "Ward Engineering Team",
    assignee: "Rohit Patil",
    status: "open",
    reason:
      "Late afternoon rainfall is reducing productive curing time and increasing rework risk.",
    recommendation:
      "Prioritize early-morning pouring and keep temporary weather cover ready on-site.",
  },
  {
    severity: "medium",
    title: "Material delivery timing mismatch at narrow lane entry",
    projectSlug: "ward-12-road-drain-upgrade",
    projectName: "Ward 12 Road and Drain Upgrade",
    owner: "Site Operations",
    assignee: "Rohit Patil",
    status: "in-progress",
    reason:
      "Truck arrivals during school and market hours are causing unloading wait time.",
    recommendation:
      "Use pre-approved unloading windows and route guidance for drivers.",
  },
  {
    severity: "low",
    title: "Furniture delivery sequencing needed for school classrooms",
    projectSlug: "govt-school-block-a-repair",
    projectName: "Govt School Block A Repair",
    owner: "School Site Team",
    assignee: "Neha Verma",
    status: "open",
    reason:
      "Benches are reaching before paint cure in a few rooms, creating temporary rework risk.",
    recommendation:
      "Align furniture unloading with room-wise paint completion checklist each day.",
  },
];

export const seedReports = [
  {
    title: "Ward 12 Weekly Progress Snapshot",
    subtitle:
      "Simple weekly brief covering progress, delay signals, and next planned activities.",
    status: "Ready",
    cadence: "Weekly Monday 09:00",
  },
  {
    title: "Ward and School Material Tracker",
    subtitle:
      "Simple tracker for cement, paint, benches, labor attendance, and daily output.",
    status: "Ready",
    cadence: "Every Wednesday",
  },
  {
    title: "Scenario Decision Note",
    subtitle:
      "Saved what-if checks for budget, manpower, and timeline recovery options.",
    status: "Draft",
    cadence: "Ad hoc",
  },
];
