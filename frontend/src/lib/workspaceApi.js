import { apiClient } from "./api";

export async function getDashboardSummary() {
  const response = await apiClient.get("/dashboard/summary");
  return response.data.summary;
}

export async function listProjects(params = {}) {
  const response = await apiClient.get("/projects", { params });
  return response.data.projects;
}

export async function getProject(projectId) {
  const response = await apiClient.get(`/projects/${projectId}`);
  return response.data.project;
}

export async function createProject(payload) {
  const response = await apiClient.post("/projects", payload);
  return response.data;
}

export async function updateProject(projectId, payload) {
  const response = await apiClient.patch(`/projects/${projectId}`, payload);
  return response.data;
}

export async function listAlerts(params = {}) {
  const response = await apiClient.get("/alerts", { params });
  return response.data.alerts;
}

export async function createAlert(payload) {
  const response = await apiClient.post("/alerts", payload);
  return response.data;
}

export async function updateAlert(alertId, payload) {
  const response = await apiClient.patch(`/alerts/${alertId}`, payload);
  return response.data;
}

export async function listVendors() {
  const response = await apiClient.get("/vendors");
  return response.data.vendors;
}

export async function createVendor(payload) {
  const response = await apiClient.post("/vendors", payload);
  return response.data;
}

export async function updateVendor(vendorId, payload) {
  const response = await apiClient.patch(`/vendors/${vendorId}`, payload);
  return response.data;
}

export async function listReports() {
  const response = await apiClient.get("/reports");
  return response.data.reports;
}

export async function createReport(payload) {
  const response = await apiClient.post("/reports", payload);
  return response.data;
}

export async function updateReport(reportId, payload) {
  const response = await apiClient.patch(`/reports/${reportId}`, payload);
  return response.data;
}

export async function listSimulationRuns() {
  const response = await apiClient.get("/simulations");
  return response.data.simulationRuns;
}

export async function createSimulationRun(payload) {
  const response = await apiClient.post("/simulations", payload);
  return response.data;
}

export async function predictWithMl(payload) {
  const response = await apiClient.post("/ml/predict", payload);
  return response.data;
}

export async function getMlStatus() {
  const response = await apiClient.get("/ml/status");
  return response.data.status;
}

export async function trainMlModels() {
  const response = await apiClient.post("/ml/train");
  return response.data;
}
