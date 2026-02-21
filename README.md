# Portfolio Website — Viraj Lakshitha Adhikari

## 📌 Overview
A modern, responsive portfolio website built with **React + Vite** that showcases my skills, projects, and experience as a Full Stack Software Engineer. Migrated from a single-file CDN approach to a fully component-based Vite project for optimal performance and maintainability.

## 🚀 Features
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **3D Intro Animation** — Three.js powered intro with nebula, torus, and vortex particles
- **Smooth Animations** — CSS animations, fade-ins, and interactive hover effects
- **Interactive Navigation** — Fixed navbar with scroll-spy active section highlighting
- **Theme System** — Dark, Light, Auto, and Colorful 2026 modes with persistent preference
- **Project Showcase** — GitHub-integrated project cards with language indicators
- **Interactive Map** — Leaflet.js location display (Colombo, Sri Lanka)
- **Contact Form** — FormSubmit-powered email form with status feedback
- **Scroll Progress Bar** — Top-of-page reading progress indicator
- **Code Splitting** — React lazy loading for all sections (fast initial load)

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite 5
- **3D Graphics**: Three.js 0.169 (dynamic import — never blocks render)
- **Map**: Leaflet.js 1.9.4 (npm package)
- **Styling**: CSS3 with custom properties (CSS variables for theming)
- **Icons**: Font Awesome 6.4 (CDN)
- **Fonts**: Google Fonts — Inter & Space Grotesk
- **Form**: FormSubmit (no backend needed)
- **Build Tool**: Vite with manual chunk splitting

## 📁 Project Structure

```
portfolio/
├── index.html                        # Vite entry HTML (fonts, Font Awesome CDN)
├── vite.config.js                    # Vite config with React plugin & chunk splitting
├── package.json                      # Dependencies (react, three, leaflet)
├── README.md                         # This file
└── src/
    ├── main.jsx                      # App entry point
    ├── App.jsx                       # Root component with lazy-loaded sections
    ├── index.css                     # Global styles & CSS variables (all themes)
    ├── data/
    │   └── portfolioData.js          # All static content (edit here to update site)
    ├── context/
    │   └── ThemeContext.jsx          # Theme state & mode-selection modal
    ├── hooks/
    │   └── useScrollSpy.js           # useScrolled, useScrollProgress, useScrollSpy
    └── components/
        ├── layout/
        │   ├── Navbar.jsx            # Fixed pill navbar with scroll-spy
        │   └── Footer.jsx            # Footer with quick links & social icons
        ├── sections/
        │   ├── Hero.jsx              # Intro + orbiting tech stack animation
        │   ├── About.jsx             # Bio + stats grid
        │   ├── Experience.jsx        # Work history + education cards
        │   ├── Projects.jsx          # GitHub project cards
        │   ├── Skills.jsx            # Skill categories + certifications
        │   └── Contact.jsx           # Form + contact cards + Leaflet map
        └── ui/
            ├── ThreeAnimation.jsx    # Full-screen Three.js intro (lazy loaded)
            ├── ScrollProgress.jsx    # Top progress bar
            └── ScrollToTop.jsx       # Floating scroll-to-top button
```

## 🎨 Design Elements
- **Color Scheme**: Dark theme with neon accents (`#00f5ff`, `#ff00ff`, `#00ff88`)
- **Typography**: Inter (body) & Space Grotesk (headings)
- **Glassmorphism**: Backdrop-blur cards with subtle borders
- **Themes**: 4 modes — Dark (default), Light, Auto (system), Colorful 2026
- **Animations**: Mesh gradient background, orbit system, particle floats, gradient text

## 📱 Sections
1. **Hero** — Name, title, CTA buttons, social links, orbiting tech stack visualization
2. **About** — Personal overview with 4 key statistics
3. **Experience** — 3 professional roles + 2 education entries
4. **Projects** — 6 projects with tags, language indicators, and GitHub links
5. **Skills** — 6 skill categories + 4 KodeKloud certifications
6. **Contact** — Contact form, info cards (email/phone/location), Leaflet map
7. **Footer** — Quick links, tech stack list, social icons

## 🏁 Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## ✏️ Updating Content

All site content lives in **one file**: `src/data/portfolioData.js`

| Export | What it controls |
|---|---|
| `experiences` | Work history cards |
| `education` | Education cards |
| `projects` | Project cards + GitHub links |
| `skillCategories` | Skill badge groups |
| `certifications` | Certification list |
| `contactInfo` | Email, phone, location cards |
| `techStack` | Orbiting icons in Hero |
| `socialLinks` | GitHub / LinkedIn / Email links |

## 📄 License
© 2026 Viraj Lakshitha Adhikari. All rights reserved.
