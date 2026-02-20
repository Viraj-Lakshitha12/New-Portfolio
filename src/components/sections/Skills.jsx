import { skillCategories, certifications } from '../../data/portfolioData';

function SkillCard({ category }) {
  return (
    <div className="modern-card">
      <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>{category.icon}</div>
      <h3
        style={{
          fontSize: '1.45rem',
          marginBottom: '18px',
          color: 'var(--accent)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {category.title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', position: 'relative', zIndex: 1 }}>
        {category.skills.map((skill) => (
          <span key={skill} className="tech-badge">{skill}</span>
        ))}
      </div>
    </div>
  );
}

function CertCard({ cert }) {
  return (
    <div className="modern-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ fontSize: '1.9rem', color: 'var(--accent-tertiary)', flexShrink: 0 }}>✓</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', position: 'relative', zIndex: 1 }}>
        {cert}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills">
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>
        Skills &amp; Technologies
      </h2>

      {/* Skill categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '22px',
          marginBottom: '70px',
        }}
      >
        {skillCategories.map((cat) => (
          <SkillCard key={cat.title} category={cat} />
        ))}
      </div>

      {/* Certifications */}
      <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px' }}>Certifications</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {certifications.map((cert) => (
          <CertCard key={cert} cert={cert} />
        ))}
      </div>
    </section>
  );
}