import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { commandActions } from "../../data/platformData";
import "../../styles/appLayout.css";
import AppSidebar from "./AppSidebar";
import AppTopBar from "./AppTopBar";
import CommandPalette from "./CommandPalette";

function AppLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = commandPaletteOpen || sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [commandPaletteOpen, sidebarOpen]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-main-content">
        Skip to workspace content
      </a>

      {sidebarOpen ? (
        <button
          className="app-shell-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCommandPalette={() => {
          setCommandPaletteOpen(true);
          setSidebarOpen(false);
        }}
      />

      <div className="app-main">
        <AppTopBar
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="app-page-content" id="app-main-content">
          <Outlet />
        </main>
      </div>

      {commandPaletteOpen ? (
        <CommandPalette
          onClose={() => setCommandPaletteOpen(false)}
          actions={commandActions}
        />
      ) : null}
    </div>
  );
}

export default AppLayout;
