import { useMemo } from 'react';
import { techStack, socialLinks } from '../../data/portfolioData';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* Particles are memoised so they don't re-randomise on every render */
function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top:   `${Math.random() * 100}%`,
        left:  `${Math.random() * 100}%`,
        tx:    `${Math.random() * 100 - 50}px`,
        ty:    `${Math.random() * 100 - 50}px`,
        delay: `${Math.random() * 4}s`,
      })),
    [],
  );

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            top: p.top, left: p.left,
            '--tx': p.tx, '--ty': p.ty,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
}

function TechOrbit({ orbit }) {
  const orbitClass = `tech-orbit tech-orbit-${orbit}`;
  const items      = techStack.filter((t) => t.orbit === orbit);

  return (
    <div className={orbitClass}>
      {items.map((tech) => (
        <div
          key={tech.name}
          className={`tech-icon-orbit tech-icon-orbit-${tech.position}`}
          style={{ borderColor: tech.color }}
          title={tech.name}
        >
          <span className="icon">{tech.icon}</span>
          <span className="name" style={{ color: tech.color }}>{tech.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home">
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '50px',
          alignItems: 'center',
        }}
      >
        {/* ── Left: text ── */}
        <div className="fade-in">
          <div style={{ marginBottom: '14px', color: 'var(--text-secondary)', fontSize: '1.08rem', fontWeight: '500' }}>
            👋 Hey, I'm
          </div>

          <h1
            className="gradient-text"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '18px' }}
          >
            Viraj Lakshitha<br />Adhikari
          </h1>

          <div
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)', color: 'var(--accent-tertiary)', marginBottom: '22px', fontWeight: '700', lineHeight: '1.3' }}
          >
            Full Stack Software Engineer
          </div>

          <p
            style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '30px', maxWidth: '580px' }}
          >
            Building scalable web applications with 3+ years of expertise in Java, Spring Boot, React,
            Node.js, and cloud technologies. Passionate about crafting innovative solutions that drive
            business value.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              <span>View My Work</span>
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>
              <span>Let's Talk</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '30px' }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={s.icon}
              >
                <i className={`${s.fab ? 'fab' : 'fas'} fa-${s.icon}`} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: tech orbit ── */}
        <div className="tech-showcase-container fade-in">
          <div className="tech-orbit-system">
            <div className="tech-center-logo">VL</div>
            <TechOrbit orbit={1} />
            <TechOrbit orbit={2} />
            <Particles />
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true" />
    </section>
  );
}