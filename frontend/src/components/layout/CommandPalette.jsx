import { useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiCornerDownLeft,
  FiSearch,
  FiZap,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

function CommandPalette({ onClose, actions }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredActions = actions.filter((action) => {
    if (!normalizedQuery) {
      return true;
    }

    return [action.title, action.description, action.type]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const recentAction =
    actions.find((action) => action.to === location.pathname) ?? actions[0];

  const handleAction = (action) => {
    onClose();

    if (action.to) {
      navigate(action.to);
    }
  };

  return (
    <div
      className="command-palette-backdrop"
      aria-hidden="true"
      onClick={onClose}
    >
      <div
        className="command-palette"
        aria-labelledby="command-palette-title"
        aria-modal="true"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-palette-search">
          <FiSearch />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && filteredActions[0]) {
                handleAction(filteredActions[0]);
              }
            }}
            placeholder="Search actions, pages, and workflows"
          />
          <button className="command-palette-close" type="button" onClick={onClose}>
            Esc
          </button>
        </div>

        <div className="command-palette-grid">
          <div className="command-palette-results">
            <div className="command-palette-section-head">
              <p id="command-palette-title">Suggested commands</p>
              <span>{filteredActions.length} items</span>
            </div>

            <div className="command-palette-list">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  className="command-palette-item"
                  type="button"
                  onClick={() => handleAction(action)}
                >
                  <div className="command-palette-item-icon">
                    <FiZap />
                  </div>
                  <div>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                  <div className="command-palette-item-meta">
                    <span>{action.type}</span>
                    <FiArrowRight />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="command-palette-side">
            <div className="command-palette-note">
              <div className="command-palette-section-head">
                <p>Recently focused</p>
              </div>
              <div className="command-palette-recent">
                <FiClock />
                <div>
                  <strong>{recentAction.title}</strong>
                  <span>{recentAction.description}</span>
                </div>
              </div>
            </div>

            <div className="command-palette-note">
              <div className="command-palette-section-head">
                <p>Keyboard rhythm</p>
              </div>
              <div className="command-shortcuts">
                <div>
                  <span>Open palette</span>
                  <strong>Ctrl/Cmd + K</strong>
                </div>
                <div>
                  <span>Run action</span>
                  <strong>Enter</strong>
                </div>
                <div>
                  <span>Dismiss</span>
                  <strong>Esc</strong>
                </div>
              </div>
            </div>

            <div className="command-palette-note command-palette-note-accent">
              <FiCornerDownLeft />
              <p>
                AI assistance is built into the workflow here. The palette is
                for navigation and action orchestration, not a separate AI silo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
