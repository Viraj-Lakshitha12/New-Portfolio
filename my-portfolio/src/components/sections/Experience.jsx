import { experiences, education } from '../../data/portfolioData';

function ExperienceCard({ exp }) {
  return (
    <div className="modern-card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.55rem', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
            {exp.title}
          </h3>
          <div style={{ color: 'var(--accent)', fontSize: '1.15rem', fontWeight: '600', position: 'relative', zIndex: 1 }}>
            {exp.company}
          </div>
        </div>
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.04)',
            padding: '7px 14px',
            borderRadius: '50px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {exp.period}
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
        {exp.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', position: 'relative', zIndex: 1 }}>
        {exp.tags.map((tag) => (
          <span key={tag} className="tech-badge">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function EducationCard({ edu }) {
  return (
    <div className="modern-card">
      <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>{edu.icon}</div>
      <h4 style={{ fontSize: '1.35rem', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
        {edu.title}
      </h4>
      <div style={{ color: 'var(--accent)', marginBottom: '7px', fontWeight: '600', position: 'relative', zIndex: 1 }}>
        {edu.institution}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', position: 'relative', zIndex: 1 }}>
        {edu.period}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience">
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>
        Professional Experience
      </h2>

      {/* Experience cards */}
      <div style={{ display: 'grid', gap: '22px', marginBottom: '70px' }}>
        {experiences.map((exp) => (
          <ExperienceCard key={exp.title + exp.company} exp={exp} />
        ))}
      </div>

      {/* Education */}
      <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px' }}>Education</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '22px',
        }}
      >
        {education.map((edu) => (
          <EducationCard key={edu.title} edu={edu} />
        ))}
      </div>
    </section>
  );
}