// ============================================================
//  PORTFOLIO DATA — edit this file to update content
// ============================================================

export const navItems = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];

export const socialLinks = [
  { icon: 'github',   url: 'https://github.com/Viraj-Lakshitha12',            fab: true },
  { icon: 'linkedin', url: 'https://www.linkedin.com/in/viraj-lakshitha01/',   fab: true },
  { icon: 'envelope', url: 'mailto:viraj.lakshitha.22222@gmail.com',           fab: false },
];

export const techStack = [
  { name: 'Java',    icon: '☕', color: '#b07219', orbit: 1, position: 1 },
  { name: 'Spring',  icon: '🍃', color: '#6db33f', orbit: 1, position: 2 },
  { name: 'React',   icon: '⚛️', color: '#61dafb', orbit: 1, position: 3 },
  { name: 'Node.js', icon: '🟢', color: '#339933', orbit: 2, position: 1 },
  { name: 'Docker',  icon: '🐳', color: '#2496ed', orbit: 2, position: 2 },
  { name: 'AWS',     icon: '☁️', color: '#ff9900', orbit: 2, position: 3 },
];

export const stats = [
  { value: '3+',  label: 'Years Experience'   },
  { value: '10+', label: 'Projects Completed' },
  { value: '20+', label: 'Technologies'       },
  { value: '4',   label: 'Certifications'     },
];

export const experiences = [
  {
    title: 'Associate Software Engineer',
    company: 'Intelleon',
    period: 'Aug 2024 - Present',
    description:
      'Developed full-stack features for a long-term Australian loan application system using React for frontend interfaces, Node.js and Express.js for backend APIs, and PostgreSQL for database management.',
    tags: ['React', 'Node.js', 'Express.js', 'PostgreSQL'],
  },
  {
    title: 'Software Engineer Intern',
    company: 'Intelleon',
    period: 'Mar 2024 - Aug 2024',
    description:
      'Assisted in the design and development of software applications, including a task management system for a Sri Lankan equipment maintenance company using Java, Spring Boot, and MySQL.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'REST API'],
  },
  {
    title: 'IT Assistant',
    company: 'Zigo Pvt Ltd',
    period: 'Jan 2021 - Dec 2021',
    description:
      'Provided technical support and assistance for Point of Sale (POS) systems in daily retail operations using hardware troubleshooting and software tools.',
    tags: ['POS Systems', 'Hardware Support', 'Troubleshooting'],
  },
];

export const education = [
  {
    icon: '🎓',
    title: 'BSc (Hons) in Computing',
    institution: 'Wrexham University - UK',
    period: '2025 - 2026 (In Progress)',
  },
  {
    icon: '💻',
    title: 'Graduate Diploma in Software Engineering',
    institution: 'Institute of Software Engineering (IJSE)',
    period: '2022 - 2024',
  },
];

export const projects = [
  {
    title: 'Loan Management System',
    description:
      'Enterprise-grade Spring Boot application with REST APIs, Kafka event streaming, JWT authentication, and production-ready patterns. Built for managing loan applications with microservices architecture.',
    tags: ['Spring Boot 3.2.4', 'Spring Security', 'JWT', 'Kafka', 'MySQL', 'Docker'],
    github: 'https://github.com/Viraj-Lakshitha12/Loan-Management-System',
    language: 'Java',
    color: '#b07219',
    isPrivate: false,
  },
  {
    title: 'Food Ordering System',
    description:
      'A modern and user-friendly Food Ordering App built with React, Tailwind CSS, Node.js, and TypeScript. Features real-time updates and seamless user experience.',
    tags: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express.js', 'Tailwind CSS'],
    github: 'https://github.com/Viraj-Lakshitha12/Food-Ordering-System',
    language: 'TypeScript',
    color: '#3178c6',
    isPrivate: false,
  },
  {
    title: 'E-Commerce API',
    description:
      'A complete backend system for an e-commerce platform built using microservices architecture. Includes authentication, user management, product catalog, cart, orders, payments, inventory, and notifications.',
    tags: ['Spring Boot', 'PostgreSQL', 'Microservices', 'Docker', 'REST API'],
    github: 'https://github.com/Viraj-Lakshitha12/E-Commerce-API',
    language: 'Java',
    color: '#b07219',
    isPrivate: true,
  },
  {
    title: 'Travel Planning Application',
    description:
      'Dynamic web application using microservices with Spring Boot, utilizing Hibernate for efficient data handling and MySQL for storage to streamline travel itinerary planning.',
    tags: ['Spring Boot', 'Hibernate', 'MySQL', 'JavaScript', 'REST API'],
    github: 'https://github.com/Viraj-Lakshitha12/Travel-Planning-Application',
    language: 'JavaScript',
    color: '#f1e05a',
    isPrivate: false,
  },
  {
    title: 'SC Graphic E-Commerce',
    description:
      'E-commerce website for SC Graphic featuring an admin dashboard for product management, integrated with Daraz store to sync product listings. Achieving 100+ daily visits.',
    tags: ['React', 'Spring Boot', 'MySQL', 'API Integration'],
    github: null,
    language: 'React',
    color: '#61dafb',
    isPrivate: false,
  },
  {
    title: 'Node.js with CI/CD',
    description:
      'Node.js project demonstrating continuous integration and deployment practices with modern DevOps tools.',
    tags: ['Node.js', 'CI/CD', 'DevOps', 'Jenkins', 'Docker'],
    github: 'https://github.com/Viraj-Lakshitha12/node-with-ci-cd',
    language: 'JavaScript',
    color: '#f1e05a',
    isPrivate: false,
  },
];

export const skillCategories = [
  { title: 'Programming Languages', icon: '💻', skills: ['Java', 'JavaScript', 'TypeScript', 'Python'] },
  { title: 'Frontend',              icon: '🎨', skills: ['React', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { title: 'Backend',               icon: '⚙️', skills: ['Spring Boot', 'Node.js', 'Express.js'] },
  { title: 'Databases',             icon: '🗄️', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis'] },
  { title: 'DevOps & Cloud',        icon: '☁️', skills: ['AWS (EC2, S3)', 'Docker', 'Kubernetes', 'Jenkins', 'NGINX'] },
  { title: 'Tools & Others',        icon: '🛠️', skills: ['Git/GitHub', 'Maven', 'Hibernate', 'JWT', 'REST API', 'CI/CD', 'Agile/Scrum'] },
];

export const certifications = [
  'Kubernetes For Absolute Beginners - KodeKloud',
  'Docker For Absolute Beginners - KodeKloud',
  'Linux For Absolute Beginners - KodeKloud',
  'AWS Basics - KodeKloud',
];

export const contactInfo = [
  { icon: '📧', title: 'Email',    content: 'viraj.lakshitha.22222@gmail.com', link: 'mailto:viraj.lakshitha.22222@gmail.com' },
  { icon: '📱', title: 'Phone',    content: '+94 769 291 462',                 link: 'tel:+94769291462' },
  { icon: '📍', title: 'Location', content: 'Colombo, Sri Lanka',              link: null },
];

export const footerTech = [
  { icon: 'java',   label: 'Java & Spring Boot'   },
  { icon: 'react',  label: 'React & Node.js'       },
  { icon: 'docker', label: 'Docker & Kubernetes'   },
  { icon: 'aws',    label: 'AWS Cloud'             },
];

export const modeOptions = [
  { id: 'dark',          name: 'Dark Mode',    icon: '🌙', description: 'Sleek cyberpunk aesthetics' },
  { id: 'light',         name: 'Light Mode',   icon: '☀️', description: 'Clean modern interface'     },
  { id: 'auto',          name: 'Auto Detect',  icon: '⚙️', description: 'Sync with system'           },
  { id: 'colorful-2026', name: '2026 Colorful',icon: '🌈', description: 'Vibrant gradients'          },
];