export function parseLineList(value) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinLineList(items) {
  return Array.isArray(items) ? items.join("\n") : "";
}

export function buildDefaultMilestones(nextMilestone) {
  return [
    { label: "Mobilization and planning", status: "Completed" },
    { label: nextMilestone, status: "In progress" },
    { label: "Executive recovery review", status: "Upcoming" },
  ];
}
