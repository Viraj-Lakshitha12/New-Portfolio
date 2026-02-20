import { socialLinks, footerTech } from '../../data/portfolioData';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const quickLinks = [
  { id: 'home',     icon: 'home',            label: 'Home'     },
  { id: 'about',    icon: 'user',            label: 'About'    },
  { id: 'projects', icon: 'project-diagram', label: 'Projects' },
  { id: 'contact',  icon: 'envelope',        label: 'Contact'  },
];

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-section">
          <h3>Viraj Lakshitha</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
            Full Stack Software Engineer passionate about building innovative web solutions with modern technologies.
          </p>
          <div className="footer-social">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={s.icon}
              >
                <i className={`${s.fab ? 'fab' : 'fas'} fa-${s.icon}`} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="footer-link"
                onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
              >
                <i className={`fas fa-${link.icon}`} style={{ width: '16px' }} />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="footer-section">
          <h3>Technologies</h3>
          <div className="footer-links">
            {footerTech.map((t, i) => (
              <span key={i} className="footer-link">
                <i className={`fab fa-${t.icon}`} style={{ width: '16px' }} />
                {t.label}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Viraj Lakshitha Adhikari. All rights reserved.</p>
        <p style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
          Designed with passion for modern web excellence
        </p>
      </div>
    </footer>
  );
}