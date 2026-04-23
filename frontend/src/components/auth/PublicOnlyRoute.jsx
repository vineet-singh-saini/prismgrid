import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-mark"></div>
        <p>Restoring your workspace session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/app/dashboard" />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
