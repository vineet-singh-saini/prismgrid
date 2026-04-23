export const PERMISSIONS = {
  DASHBOARD_READ: "dashboard.read",
  PROJECTS_READ: "projects.read",
  PROJECTS_WRITE: "projects.write",
  ALERTS_READ: "alerts.read",
  ALERTS_WRITE: "alerts.write",
  VENDORS_READ: "vendors.read",
  VENDORS_WRITE: "vendors.write",
  REPORTS_READ: "reports.read",
  REPORTS_WRITE: "reports.write",
  SIMULATIONS_READ: "simulations.read",
  SIMULATIONS_WRITE: "simulations.write",
  ML_PREDICT: "ml.predict",
  ML_TRAIN: "ml.train",
  WORKSPACE_READ: "workspace.read",
  WORKSPACE_MANAGE: "workspace.manage",
};

export function hasUserPermission(user, permission) {
  return Boolean(user?.permissions?.includes(permission));
}
