import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiBell,
  FiCommand,
  FiX,
  FiFileText,
  FiFolder,
  FiLayers,
  FiSettings,
  FiSliders,
  FiTruck,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { appNavigation } from "../../data/platformData";

const navIcons = {
  "/app/dashboard": <FiLayers />,
  "/app/projects": <FiFolder />,
  "/app/alerts": <FiBell />,
  "/app/simulation": <FiSliders />,
  "/app/vendors": <FiTruck />,
  "/app/reports": <FiFileText />,
  "/app/settings": <FiSettings />,
};

function AppSidebar({ isOpen, onClose, onOpenCommandPalette }) {
  const { user } = useAuth();

  return (
    <aside className={isOpen ? "app-sidebar open" : "app-sidebar"}>
      <div className="app-sidebar-top">
        <div className="app-sidebar-brand">
          <div className="brand-mark">
            <span className="brand-core"></span>
          </div>

          <div className="brand-copy">
            <h3>PRISM-GRID</h3>
            <p>Predictive project intelligence</p>
          </div>
        </div>

        <button
          className="sidebar-close-btn"
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>

      <div className="sidebar-status-card">
        <div className="sidebar-status-head">
          <span className="eyebrow">Workspace</span>
          <div className="status-chip success">
            <FiActivity />
            Live
          </div>
        </div>
        <h4>{user?.organization ?? "PRISM-GRID Workspace"}</h4>
        <p>{user?.title ?? "Portfolio Control Lead"}</p>
        <span className="sidebar-status-note">
          Signed in as {user?.fullName ?? "Workspace user"}
        </span>
      </div>

      <nav className="app-sidebar-links" aria-label="Workspace navigation">
        {appNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span>{navIcons[item.to]}</span>
            <strong className="sidebar-link-label">{item.label}</strong>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-command-btn" type="button" onClick={onOpenCommandPalette}>
        <span className="sidebar-command-label">Quick command palette</span>
        <div className="sidebar-command-keys">
          <FiCommand />
          <span>K</span>
        </div>
      </button>
    </aside>
  );
}

export default AppSidebar;
