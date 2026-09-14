# Portfolio Website — Viraj Lakshitha Adhikari

## 📌 Overview
A modern portfolio website for Viraj Lakshitha Adhikari — Full Stack Software Engineer. Built with React and Vite, featuring smooth animations, dark/light themes, and a clean glassmorphism design.

## 🚀 Features
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations** — Framer Motion powered animations and interactive hover effects
- **Interactive Navigation** — Fixed navbar with smooth scroll to sections
- **Theme System** — Dark and Light modes with persistent preference
- **Project Showcase** — Project cards with technology tags
- **Contact Form** — Client-side contact form with visual feedback
- **3D Background** — Three.js powered mesh background
- **Glassmorphism UI** — Modern glass-effect cards with subtle borders

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite 8
- **Animations**: Framer Motion 11
- **3D Graphics**: Three.js 0.171
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Theme**: next-themes
- **Build Tool**: Vite

## 📁 Project Structure

```
portfolio/
├── index.html                        # Vite entry HTML
├── vite.config.js                    # Vite config with React plugin & path alias
├── package.json                      # Dependencies
├── README.md                         # This file
└── src/
    ├── main.jsx                      # App entry point
    ├── App.jsx                       # Root component with Router
    ├── index.css                     # Global styles & CSS variables
    ├── data/
    │   └── portfolioData.js          # All static content (edit here to update site)
    ├── lib/
    │   ├── theme-context.jsx        # Theme state management
    │   └── utils.js                 # Utility functions
    ├── hooks/
    │   ├── use-mobile.jsx           # Mobile breakpoint hook
    │   └── use-size.jsx             # Element size hook
    ├── pages/
    │   └── Home.jsx                 # Main page with all sections
    └── components/
        ├── Hero.jsx                 # Hero section with profile and animations
        ├── TechStack.jsx            # Technology stack display
        ├── Experience.jsx           # Work experience timeline
        ├── Projects.jsx             # Project showcase cards
        ├── Education.jsx            # Education history
        ├── Contact.jsx              # Contact form and info
        ├── Footer.jsx               # Footer with social links
        ├── Navbar.jsx               # Navigation bar
        ├── Preloader.jsx            # Loading animation
        ├── MeshBackground.jsx       # Three.js background
        ├── WireframeOrb.jsx         # 3D orb component
        ├── GoogleIcon.jsx           # Google icon component
        ├── ScrollToTop.jsx          # Scroll to top button
        └── ui/
            └── image.jsx            # Simple image component
```

## 🎨 Design Elements
- **Color Scheme**: Dark theme with neon accents (CSS variables for easy customization)
- **Typography**: Inter Tight & JetBrains Mono
- **Glassmorphism**: Backdrop-blur cards with subtle borders
- **Themes**: Dark (default) and Light modes
- **Animations**: Mesh gradient background, floating elements, gradient text, hover effects

## 📱 Sections
1. **Hero** — Name, title, profile image, CTA buttons
2. **TechStack** — Technology skills display
3. **Experience** — Work experience timeline
4. **Projects** — Project showcase with technology tags
5. **Education** — Education history cards
6. **Contact** — Contact form and location info
7. **Footer** — Social links and copyright

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

Edit content in the component files or `src/data/portfolioData.js`:

| File/Component | What it controls |
|---|---|
| `Hero.jsx` | Profile image, name, title, intro text |
| `Experience.jsx` | Work history cards |
| `Education.jsx` | Education cards |
| `Projects.jsx` | Project cards with images and tags |
| `Contact.jsx` | Contact form and location info |
| `Footer.jsx` | Social links |
| `portfolioData.js` | Additional data exports |

## 📄 License
© 2026 Viraj Lakshitha Adhikari. All rights reserved.
