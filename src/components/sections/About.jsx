import { stats } from '../../data/portfolioData';

export default function About() {
  return (
    <section id="about" style={{ background: 'var(--bg-secondary)' }}>
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>
        About Me
      </h2>

      <div style={{ display: 'grid', gap: '28px', marginBottom: '42px', maxWidth: '900px' }}>
        <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
          I'm a Full Stack Software Engineer with hands-on experience in building scalable microservices,
          RESTful APIs, and database-driven applications. Currently working at{' '}
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Intelleon</span>, I specialise in
          developing robust backend systems with Java and Spring Boot, while crafting intuitive frontend
          experiences with React.
        </p>
        <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
          My expertise includes DevOps practices, CI/CD pipelines, and agile methodologies. I'm passionate
          about solving complex problems, optimising system performance, and delivering business value
          through innovative software solutions.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '22px',
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="modern-card" style={{ textAlign: 'center', padding: '30px 24px' }}>
            <div
              className="gradient-text"
              style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '8px', position: 'relative', zIndex: 1 }}
            >
              {stat.value}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: '500', position: 'relative', zIndex: 1 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}