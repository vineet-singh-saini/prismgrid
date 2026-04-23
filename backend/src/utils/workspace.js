export function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getWorkspaceKeyFromOrganization(organization) {
  return slugify(organization) || "prism-grid-workspace";
}

export function getWorkspaceKeyForUser(user) {
  return user.workspaceKey || getWorkspaceKeyFromOrganization(user.organization);
}
