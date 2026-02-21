import { Suspense, lazy, useState, useCallback, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollProgress from "./components/ui/ScrollProgress";
import ScrollToTop from "./components/ui/ScrollToTop";
import ThreeAnimation from "./components/ui/ThreeAnimation";

const Hero = lazy(() => import("./components/sections/Hero"));
const About = lazy(() => import("./components/sections/About"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Skills = lazy(() => import("./components/sections/Skills"));
const Contact = lazy(() => import("./components/sections/Contact"));

// Minimal loading placeholder
function SectionLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setShowPortfolio(true);
  }, []);

  // ── Safety net: if Three.js fails or hangs on production, show portfolio
  // after 6 seconds so the page never stays white forever
  useEffect(() => {
    const fallback = setTimeout(() => {
      setShowPortfolio(true);
    }, 6000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <ThemeProvider>
      {/* ── Intro animation (removed from DOM once done) ── */}
      {!showPortfolio && (
        <ThreeAnimation onComplete={handleAnimationComplete} />
      )}

      {/* ── Main portfolio ── */}
      <div
        style={{
          opacity: showPortfolio ? 1 : 0,
          transition: "opacity 0.9s ease-in",
          pointerEvents: showPortfolio ? "auto" : "none",
        }}
      >
        <ScrollProgress />
        <Navbar />

        <main>
          <Suspense fallback={<SectionLoader />}>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
          </Suspense>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
