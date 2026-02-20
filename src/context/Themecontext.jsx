import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { modeOptions } from "../data/portfolioData";

const ThemeContext = createContext();

function applyThemeToDOM(newTheme) {
  localStorage.setItem("portfolio-theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    return saved;
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleModeSelect = useCallback((modeId) => {
    const resolved =
      modeId === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : modeId;

    setTheme(resolved);
    setTimeout(() => setShowModal(false), 300);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        showModal,
        openModal: () => setShowModal(true),
        closeModal: () => setShowModal(false),
        handleModeSelect,
      }}
    >
      {children}
      {showModal && <ModeSelectionModal />}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/* ── Modal ── */
function ModeSelectionModal() {
  const { theme, handleModeSelect, closeModal } = useTheme();

  return (
    <>
      <div className="mode-modal-overlay" onClick={closeModal} />
      <div className="mode-modal">
        <h2 style={{ marginBottom: "10px", fontSize: "1.75rem" }}>
          Choose Your Theme
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "22px",
            fontSize: "0.93rem",
          }}
        >
          Select your preferred viewing mode
        </p>

        <div className="mode-options">
          {modeOptions.map((opt) => (
            <div
              key={opt.id}
              className={`mode-option ${theme === opt.id ? "active" : ""}`}
              onClick={() => handleModeSelect(opt.id)}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "10px" }}>
                {opt.icon}
              </div>
              <h4 style={{ marginBottom: "6px", fontSize: "1.05rem" }}>
                {opt.name}
              </h4>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.4",
                }}
              >
                {opt.description}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={closeModal}
          className="btn-primary"
          style={{ width: "100%", marginTop: "14px" }}
        >
          <span>Apply Theme</span>
        </button>
      </div>
    </>
  );
}
