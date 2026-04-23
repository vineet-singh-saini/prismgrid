import { Link, useLocation } from "react-router-dom";
import {
  FiLogOut,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { appNavigation } from "../../data/platformData";

function AppTopBar({ onOpenSidebar }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentRoute = appNavigation.find((item) =>
    location.pathname.startsWith(item.to)
  );
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PG";

  return (
    <header className="app-topbar">
      <div className="topbar-primary">
        <button
          className="topbar-menu-btn"
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenSidebar}
        >
          <FiMenu />
        </button>

        <div className="topbar-intro">
          <span className="eyebrow">Current workspace</span>
          <h1>{currentRoute?.label ?? "Workspace"}</h1>
        </div>
      </div>

      <div className="topbar-meta topbar-meta-simple">
        <Link className="topbar-profile-btn" to="/app/settings">
          <span className="topbar-profile-avatar">{initials}</span>
          <span className="topbar-profile-name">{user?.fullName ?? "Workspace user"}</span>
          <FiUser />
        </Link>

        <button className="topbar-logout-btn" type="button" onClick={logout}>
          <FiLogOut />
          Sign out
        </button>
      </div>
    </header>
  );
}

export default AppTopBar;
