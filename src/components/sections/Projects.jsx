import { useState } from 'react';
import { projects } from '../../data/portfolioData';

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="modern-card" style={{ cursor: 'default' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.45rem', flex: 1, position: 'relative', zIndex: 1 }}>
          {project.title}
        </h3>
        {project.isPrivate && (
          <span
            style={{
              background: 'rgba(255,0,255,0.12)',
              color: 'var(--accent-secondary)',
              padding: '5px 11px',
              borderRadius: '50px',
              fontSize: '0.72rem',
              fontWeight: '600',
              border: '1px solid rgba(255,0,255,0.25)',
              flexShrink: 0,
              marginLeft: '10px',
            }}
          >
            PRIVATE
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          color: 'var(--text-secondary)',
          lineHeight: '1.65',
          marginBottom: '18px',
          minHeight: '75px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
        {project.tags.map((tag) => (
          <span key={tag} className="tech-badge">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Language dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: project.color }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{project.language}</span>
        </div>

        {/* GitHub link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              color: hovered ? '#000' : 'var(--accent)',
              background: hovered ? 'var(--accent)' : 'transparent',
              textDecoration: 'none',
              padding: '7px 14px',
              border: '1px solid var(--accent)',
              borderRadius: '50px',
              fontSize: '0.86rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <i className="fab fa-github" /> View Code
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" style={{ background: 'var(--bg-secondary)' }}>
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '18px' }}>
        Featured Projects
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.12rem', marginBottom: '42px', maxWidth: '700px' }}>
        Explore my latest work on GitHub — from enterprise applications to experimental projects.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '22px',
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}