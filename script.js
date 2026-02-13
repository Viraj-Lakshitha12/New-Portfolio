const { useState, useEffect, useRef } = React;

const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [showModeModal, setShowModeModal] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, openModeModal: () => setShowModeModal(true), closeModeModal: () => setShowModeModal(false) }}>
      {children}
      {showModeModal && <ModeSelectionModal />}
    </ThemeContext.Provider>
  );
};

// MODE SELECTION MODAL
const ModeSelectionModal = () => {
  const { theme, toggleTheme, closeModeModal } = React.useContext(ThemeContext);
  const modeOptions = [
    { id: 'dark', name: 'Dark Mode', icon: '🌙', description: 'Sleek cyberpunk aesthetics' },
    { id: 'light', name: 'Light Mode', icon: '☀️', description: 'Clean modern interface' },
    { id: 'auto', name: 'Auto Detect', icon: '⚙️', description: 'Sync with system' },
    { id: 'colorful-2026', name: '2026 Colorful', icon: '🌈', description: 'Vibrant gradients' }
  ];

  const handleModeSelect = (modeId) => {
    if (modeId === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      toggleTheme(prefersDark ? 'dark' : 'light');
    } else toggleTheme(modeId);
    setTimeout(closeModeModal, 300);
  };

  return (
    <>
      <div className="mode-modal-overlay" onClick={closeModeModal}></div>
      <div className="mode-modal">
        <h2 style={{ marginBottom: '10px', fontSize: '1.75rem' }}>Choose Your Theme</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '22px', fontSize: '0.93rem' }}>Select your preferred viewing mode</p>
        <div className="mode-options">
          {modeOptions.map((option) => (
            <div key={option.id} className={`mode-option ${theme === option.id ? 'active' : ''}`} onClick={() => handleModeSelect(option.id)}>
              <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>{option.icon}</div>
              <h4 style={{ marginBottom: '6px', fontSize: '1.05rem' }}>{option.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{option.description}</p>
            </div>
          ))}
        </div>
        <button onClick={closeModeModal} className="btn-primary" style={{ width: '100%', marginTop: '14px' }}>
          <span>Apply Theme</span>
        </button>
      </div>
    </>
  );
};

// MODERN NAVBAR
const ModernNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, openModeModal } = React.useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];

  return (
    <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-logo">VIRAJ LAKSHITHA</div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item} className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}>{item}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="theme-toggle" onClick={openModeModal}>
            <span className="theme-icon">{theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌈'}</span>
          </div>
          <button className="mobile-menu-btn" style={{ display: 'none' }}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

// HERO SECTION
const Hero = () => {
  const techStack = [
    { name: "Java", icon: "☕", color: "#b07219", orbit: 1, position: 1 },
    { name: "Spring", icon: "🍃", color: "#6db33f", orbit: 1, position: 2 },
    { name: "React", icon: "⚛️", color: "#61dafb", orbit: 1, position: 3 },
    { name: "Node.js", icon: "🟢", color: "#339933", orbit: 2, position: 1 },
    { name: "Docker", icon: "🐳", color: "#2496ed", orbit: 2, position: 2 },
    { name: "AWS", icon: "☁️", color: "#ff9900", orbit: 2, position: 3 },
  ];

  return (
    <section id="home">
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', alignItems: 'center' }}>
        <div className="fade-in">
          <div style={{ marginBottom: '14px', color: 'var(--text-secondary)', fontSize: '1.08rem', fontWeight: '500' }}>👋 Hey, I'm</div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '18px' }}>Viraj Lakshitha<br />Adhikari</h1>
          <div style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)', color: 'var(--accent-tertiary)', marginBottom: '22px', fontWeight: '700', lineHeight: '1.3' }}>Full Stack Software Engineer</div>
          <p style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '30px', maxWidth: '580px' }}>Building scalable web applications with 3+ years of expertise in Java, Spring Boot, React, Node.js, and cloud technologies. Passionate about crafting innovative solutions that drive business value.</p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <button className="btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}><span>View My Work</span></button>
            <button className="btn-secondary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}><span>Let's Talk</span></button>
          </div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '30px' }}>
            {[{ icon: 'github', url: 'https://github.com/Viraj-Lakshitha12' }, { icon: 'linkedin', url: 'https://www.linkedin.com/in/viraj-lakshitha01/' }, { icon: 'envelope', url: 'mailto:viraj.lakshitha.22222@gmail.com' }].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon"><i className={`fab fa-${social.icon}`}></i></a>
            ))}
          </div>
        </div>

        {/* TECH STACK VISUALIZATION */}
        <div className="tech-showcase-container fade-in">
          <div className="tech-orbit-system">
            <div className="tech-center-logo">VL</div>

            <div className="tech-orbit tech-orbit-1">
              {techStack.filter(t => t.orbit === 1).map((tech, i) => (
                <div key={i} className={`tech-icon-orbit tech-icon-orbit-${tech.position}`} style={{ borderColor: tech.color }}>
                  <span className="icon">{tech.icon}</span>
                  <span className="name" style={{ color: tech.color }}>{tech.name}</span>
                </div>
              ))}
            </div>

            <div className="tech-orbit tech-orbit-2">
              {techStack.filter(t => t.orbit === 2).map((tech, i) => (
                <div key={i} className={`tech-icon-orbit tech-icon-orbit-${tech.position}`} style={{ borderColor: tech.color }}>
                  <span className="icon">{tech.icon}</span>
                  <span className="name" style={{ color: tech.color }}>{tech.name}</span>
                </div>
              ))}
            </div>

            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                '--tx': `${Math.random() * 100 - 50}px`,
                '--ty': `${Math.random() * 100 - 50}px`,
                animationDelay: `${Math.random() * 4}s`
              }}></div>
            ))}
          </div>
        </div>
      </div>
      <div className="scroll-indicator"></div>
    </section>
  );
};

// ABOUT SECTION
const About = () => (
  <section id="about" style={{ background: 'var(--bg-secondary)' }}>
    <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>About Me</h2>
    <div style={{ display: 'grid', gap: '28px', marginBottom: '42px', maxWidth: '900px' }}>
      <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>I'm a Full Stack Software Engineer with hands-on experience in building scalable microservices, RESTful APIs, and database-driven applications. Currently working at <span style={{ color: 'var(--accent)', fontWeight: '600' }}>Intelleon</span>, I specialize in developing robust backend systems with Java and Spring Boot, while crafting intuitive frontend experiences with React.</p>
      <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>My expertise includes DevOps practices, CI/CD pipelines, and agile methodologies. I'm passionate about solving complex problems, optimizing system performance, and delivering business value through innovative software solutions.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '22px' }}>
      {[{ value: '3+', label: 'Years Experience' }, { value: '10+', label: 'Projects Completed' }, { value: '20+', label: 'Technologies' }, { value: '4', label: 'Certifications' }].map((stat, i) => (
        <div key={i} className="modern-card" style={{ textAlign: 'center', padding: '30px 24px' }}>
          <div className="gradient-text" style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{stat.value}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: '500', position: 'relative', zIndex: 1 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

// EXPERIENCE SECTION
const Experience = () => {
  const experiences = [
    { title: 'Associate Software Engineer', company: 'Intelleon', period: 'Aug 2024 - Present', description: 'Developed full-stack features for a long-term Australian loan application system using React for frontend interfaces, Node.js and Express.js for backend APIs, and PostgreSQL for database management.', tags: ['React', 'Node.js', 'Express.js', 'PostgreSQL'] },
    { title: 'Software Engineer Intern', company: 'Intelleon', period: 'Mar 2024 - Aug 2024', description: 'Assisted in the design and development of software applications, including a task management system for a Sri Lankan equipment maintenance company using Java, Spring Boot, and MySQL.', tags: ['Java', 'Spring Boot', 'MySQL', 'REST API'] },
    { title: 'IT Assistant', company: 'Zigo Pvt Ltd', period: 'Jan 2021 - Dec 2021', description: 'Provided technical support and assistance for Point of Sale (POS) systems in daily retail operations using hardware troubleshooting and software tools.', tags: ['POS Systems', 'Hardware Support', 'Troubleshooting'] }
  ];

  return (
    <section id="experience">
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>Professional Experience</h2>
      <div style={{ display: 'grid', gap: '22px', marginBottom: '70px' }}>
        {experiences.map((exp, i) => (
          <div key={i} className="modern-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.55rem', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{exp.title}</h3>
                <div style={{ color: 'var(--accent)', fontSize: '1.15rem', fontWeight: '600', position: 'relative', zIndex: 1 }}>{exp.company}</div>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: '500', background: 'rgba(255, 255, 255, 0.04)', padding: '7px 14px', borderRadius: '50px', position: 'relative', zIndex: 1 }}>{exp.period}</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '18px', position: 'relative', zIndex: 1 }}>{exp.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', position: 'relative', zIndex: 1 }}>
              {exp.tags.map((tag, j) => (<span key={j} className="tech-badge">{tag}</span>))}
            </div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px' }}>Education</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {[{ icon: '🎓', title: 'BSc (Hons) in Computing', institution: 'Wrexham University - UK', period: '2025 - 2026 (In Progress)' }, { icon: '💻', title: 'Graduate Diploma in Software Engineering', institution: 'Institute of Software Engineering (IJSE)', period: '2022 - 2024' }].map((edu, i) => (
          <div key={i} className="modern-card">
            <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>{edu.icon}</div>
            <h4 style={{ fontSize: '1.35rem', marginBottom: '10px', position: 'relative', zIndex: 1 }}>{edu.title}</h4>
            <div style={{ color: 'var(--accent)', marginBottom: '7px', fontWeight: '600', position: 'relative', zIndex: 1 }}>{edu.institution}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', position: 'relative', zIndex: 1 }}>{edu.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// PROJECTS SECTION
const Projects = () => {
  const projects = [
    { title: 'Loan Management System', description: 'Enterprise-grade Spring Boot application with REST APIs, Kafka event streaming, JWT authentication, and production-ready patterns. Built for managing loan applications with microservices architecture.', tags: ['Spring Boot 3.2.4', 'Spring Security', 'JWT', 'Kafka', 'MySQL', 'Docker'], github: 'https://github.com/Viraj-Lakshitha12/Loan-Management-System', language: 'Java', color: '#b07219', isPrivate: false },
    { title: 'Food Ordering System', description: 'A modern and user-friendly Food Ordering App built with React, Tailwind CSS, Node.js, and TypeScript. Features real-time updates and seamless user experience.', tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js', 'Tailwind CSS'], github: 'https://github.com/Viraj-Lakshitha12/Food-Ordering-System', language: 'TypeScript', color: '#3178c6', isPrivate: false },
    { title: 'E-Commerce API', description: 'A complete backend system for an e-commerce platform built using microservices architecture. Includes authentication, user management, product catalog, cart, orders, payments, inventory, and notifications.', tags: ['Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'REST API'], github: 'https://github.com/Viraj-Lakshitha12/E-Commerce-API', language: 'Java', color: '#b07219', isPrivate: true },
    { title: 'Travel Planning Application', description: 'Dynamic web application using microservices with Spring Boot, utilizing Hibernate for efficient data handling and MySQL for storage to streamline travel itinerary planning.', tags: ['Spring Boot', 'Hibernate', 'MySQL', 'JavaScript', 'REST API'], github: 'https://github.com/Viraj-Lakshitha12/Travel-Planning-Application', language: 'JavaScript', color: '#f1e05a', isPrivate: false },
    { title: 'SC Graphic E-Commerce', description: 'E-commerce website for SC Graphic featuring an admin dashboard for product management, integrated with Daraz store to sync product listings. Achieving 100+ daily visits.', tags: ['React', 'Spring Boot', 'MySQL', 'API Integration'], language: 'React', color: '#61dafb', isPrivate: false },
    { title: 'Node.js with CI/CD', description: 'Node.js project demonstrating continuous integration and deployment practices with modern DevOps tools.', tags: ['Node.js', 'CI/CD', 'DevOps', 'Jenkins', 'Docker'], github: 'https://github.com/Viraj-Lakshitha12/node-with-ci-cd', language: 'JavaScript', color: '#f1e05a', isPrivate: false }
  ];

  return (
    <section id="projects" style={{ background: 'var(--bg-secondary)' }}>
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '18px' }}>Featured Projects</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.12rem', marginBottom: '42px', maxWidth: '700px' }}>Explore my latest work on GitHub - from enterprise applications to experimental projects</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
        {projects.map((project, i) => (
          <div key={i} className="modern-card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.45rem', flex: 1, position: 'relative', zIndex: 1 }}>{project.title}</h3>
              {project.isPrivate && (<span style={{ background: 'rgba(255, 0, 255, 0.12)', color: 'var(--accent-secondary)', padding: '5px 11px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '600', border: '1px solid rgba(255, 0, 255, 0.25)' }}>PRIVATE</span>)}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '18px', minHeight: '75px', position: 'relative', zIndex: 1 }}>{project.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
              {project.tags.map((tag, j) => (<span key={j} className="tech-badge">{tag}</span>))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: project.color }}></div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{project.language}</span>
              </div>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--accent)', textDecoration: 'none', padding: '7px 14px', border: '1px solid var(--accent)', borderRadius: '50px', fontSize: '0.86rem', fontWeight: '500', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}><i className="fab fa-github"></i> View Code</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// SKILLS SECTION
const Skills = () => {
  const skillCategories = [
    { title: 'Programming Languages', icon: '💻', skills: ['Java', 'JavaScript', 'TypeScript', 'Python'] },
    { title: 'Frontend', icon: '🎨', skills: ['React', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { title: 'Backend', icon: '⚙️', skills: ['Spring Boot', 'Node.js', 'Express.js'] },
    { title: 'Databases', icon: '🗄️', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis'] },
    { title: 'DevOps & Cloud', icon: '☁️', skills: ['AWS (EC2, S3)', 'Docker', 'Kubernetes', 'Jenkins', 'NGINX'] },
    { title: 'Tools & Others', icon: '🛠️', skills: ['Git/GitHub', 'Maven', 'Hibernate', 'JWT', 'REST API', 'CI/CD', 'Agile/Scrum'] }
  ];
  const certifications = ['Kubernetes For Absolute Beginners - KodeKloud', 'Docker For Absolute Beginners - KodeKloud', 'Linux For Absolute Beginners - KodeKloud', 'AWS Basics - KodeKloud'];

  return (
    <section id="skills">
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '42px' }}>Skills & Technologies</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', marginBottom: '70px' }}>
        {skillCategories.map((category, i) => (
          <div key={i} className="modern-card">
            <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>{category.icon}</div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '18px', color: 'var(--accent)', position: 'relative', zIndex: 1 }}>{category.title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', position: 'relative', zIndex: 1 }}>
              {category.skills.map((skill, j) => (<span key={j} className="tech-badge">{skill}</span>))}
            </div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px' }}>Certifications</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {certifications.map((cert, i) => (
          <div key={i} className="modern-card" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '1.9rem', color: 'var(--accent-tertiary)' }}>✓</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', position: 'relative', zIndex: 1 }}>{cert}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// CONTACT SECTION
const Contact = () => {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    if (mapRef.current && !mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current).setView([6.9271, 79.8612], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
      const customIcon = L.divIcon({ className: 'custom-marker', html: '<div style="background: var(--accent); width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 25px var(--accent);"></div>', iconSize: [30, 30], iconAnchor: [15, 15] });
      L.marker([6.9271, 79.8612], { icon: customIcon }).addTo(map).bindPopup('<b>Colombo, Sri Lanka</b><br>Available for opportunities');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const form = e.target;
    const formEndpoint = 'https://formsubmit.co/viraj.lakshitha.22222@gmail.com';

    fetch(formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.ok) {
          setFormStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setFormStatus(''), 3000);
        } else {
          setFormStatus('error');
        }
      })
      .catch(() => setFormStatus('error'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" style={{ background: 'var(--bg-secondary)' }}>
      <h2 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', marginBottom: '18px', textAlign: 'center' }}>Let's Work Together</h2>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.75', textAlign: 'center', maxWidth: '700px', margin: '0 auto 50px' }}>I'm currently available for freelance work and full-time opportunities. Feel free to reach out!</p>

      <div className="contact-form-container">
        <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px', textAlign: 'center' }}>Send Me a Message</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-input" placeholder="Enter your name here (e.g. Viraj Lakshitha Adhikari)" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" placeholder="Enter your email here (e.g. contact@example.com)" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input type="text" name="subject" className="form-input" placeholder="Enter your subject here (e.g. Just saying Hi!)" value={formData.subject} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea name="message" className="form-textarea" placeholder="Enter your message here (e.g. Hello Viraj! I'd like to say Hi!)" value={formData.message} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={formStatus === 'sending'}>
            <span>{formStatus === 'sending' ? 'Sending...' : formStatus === 'success' ? 'Message Sent! ✓' : 'Submit Message'}</span>
          </button>
          {formStatus === 'error' && <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '12px' }}>Error sending message. Please try again.</p>}
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', marginBottom: '70px' }}>
        {[{ icon: '📧', title: 'Email', content: 'viraj.lakshitha.22222@gmail.com', link: 'mailto:viraj.lakshitha.22222@gmail.com' }, { icon: '📱', title: 'Phone', content: '+94 769 291 462', link: 'tel:+94769291462' }, { icon: '📍', title: 'Location', content: 'Colombo, Sri Lanka' }].map((item, i) => (
          <div key={i} className="modern-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.2rem', marginBottom: '14px' }}>{item.icon}</div>
            <h4 style={{ marginBottom: '10px', fontSize: '1.25rem', position: 'relative', zIndex: 1 }}>{item.title}</h4>
            {item.link ? (<a href={item.link} style={{ color: 'var(--accent)', textDecoration: 'none', wordBreak: 'break-word', fontSize: '1.02rem', position: 'relative', zIndex: 1 }}>{item.content}</a>) : (<p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', position: 'relative', zIndex: 1 }}>{item.content}</p>)}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '70px' }}>
        <h3 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '28px' }}>Find Me Here</h3>
        <div ref={mapRef} className="map-container"></div>
      </div>
    </section>
  );
};

// FOOTER
const Footer = () => (
  <footer className="modern-footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>Viraj Lakshitha</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>Full Stack Software Engineer passionate about building innovative web solutions with modern technologies.</p>
        <div className="footer-social">
          <a href="https://github.com/Viraj-Lakshitha12" target="_blank" rel="noopener noreferrer" className="footer-social-link"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/viraj-lakshitha01/" target="_blank" rel="noopener noreferrer" className="footer-social-link"><i className="fab fa-linkedin"></i></a>
          <a href="mailto:viraj.lakshitha.22222@gmail.com" className="footer-social-link"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
      <div className="footer-section">
        <h3>Quick Links</h3>
        <div className="footer-links">
          <a href="#home" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}><i className="fas fa-home" style={{ width: '16px' }}></i> Home</a>
          <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}><i className="fas fa-user" style={{ width: '16px' }}></i> About</a>
          <a href="#projects" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}><i className="fas fa-project-diagram" style={{ width: '16px' }}></i> Projects</a>
          <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}><i className="fas fa-envelope" style={{ width: '16px' }}></i> Contact</a>
        </div>
      </div>
      <div className="footer-section">
        <h3>Technologies</h3>
        <div className="footer-links">
          <span className="footer-link"><i className="fab fa-java" style={{ width: '16px' }}></i> Java & Spring Boot</span>
          <span className="footer-link"><i className="fab fa-react" style={{ width: '16px' }}></i> React & Node.js</span>
          <span className="footer-link"><i className="fab fa-docker" style={{ width: '16px' }}></i> Docker & Kubernetes</span>
          <span className="footer-link"><i className="fab fa-aws" style={{ width: '16px' }}></i> AWS Cloud</span>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Viraj Lakshitha Adhikari. All rights reserved.</p>
      <p style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.7 }}>Designed with passion for modern web excellence</p>
    </div>
  </footer>
);

// MAIN APP COMPONENT
const App = () => (
  <ThemeProvider>
    <ModernNavbar />
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Skills />
    <Contact />
    <Footer />
  </ThemeProvider>
);

// RENDER APPLICATION
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);