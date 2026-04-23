import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import AppLayout from "./components/layout/AppLayout";

const LandingPage = lazy(() => import("./pages/Landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const ProjectsPage = lazy(() => import("./pages/Projects/ProjectsPage"));
const ProjectDetailsPage = lazy(() =>
  import("./pages/Projects/ProjectDetailsPage")
);
const AlertsPage = lazy(() => import("./pages/Alerts/AlertsPage"));
const SimulationPage = lazy(() => import("./pages/Simulation/SimulationPage"));
const VendorsPage = lazy(() => import("./pages/Vendors/VendorsPage"));
const ReportsPage = lazy(() => import("./pages/Reports/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/Settings/SettingsPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="app-loading-screen">
          <div className="app-loading-mark"></div>
          <p>Loading the PRISM-GRID workspace...</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
