import { useTheme }      from '../../context/ThemeContext';
import { useScrollSpy, useScrolled } from '../../hooks/useScrollSpy';
import { navItems }     from '../../data/portfolioData';

const SECTION_IDS = navItems.map((n) => n.toLowerCase());

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const scrolled     = useScrolled(50);
  const activeSection = useScrollSpy(SECTION_IDS);
  const { theme, openModal } = useTheme();

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌈';

  return (
    <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        {/* Logo */}
        <div className="nav-logo">VIRAJ LAKSHITHA</div>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li
              key={item}
              className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => scrollTo(item.toLowerCase())}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            className="theme-toggle"
            onClick={openModal}
            role="button"
            aria-label="Open theme selector"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openModal()}
          >
            <span className="theme-icon">{themeIcon}</span>
          </div>

          {/* Mobile hamburger – shown via CSS on ≤768 px */}
          <button
            className="mobile-menu-btn"
            style={{ display: 'none' }}
            aria-label="Open menu"
          >
            <i className="fas fa-bars" />
          </button>
        </div>
      </div>
    </nav>
  );
}