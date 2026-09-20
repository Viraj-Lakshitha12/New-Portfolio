# Portfolio Website — Viraj Lakshitha Adhikari

## 📌 Overview
A modern, feature-rich portfolio website for Viraj Lakshitha Adhikari — Full Stack Software Engineer. Built with React and Vite, featuring smooth animations, 3D graphics, chatbot integration, dark/light themes, and a clean glassmorphism design with advanced UI interactions.

## 🚀 Features
- **Responsive Design** — Optimized for all devices including iPhone SE and small screens
- **Smooth Animations** — Framer Motion powered animations and interactive hover effects
- **Interactive Navigation** — Fixed navbar with smooth scroll to sections
- **Theme System** — Dark, Light, Auto, and Colorful modes with persistent preference
- **Project Showcase** — Project cards with technology tags and spotlight effects
- **Services Section** — Specialized services display with interactive cards
- **Contact Form** — Client-side contact form with visual feedback
- **3D Background** — Three.js powered mesh background and 3D scenes
- **Glassmorphism UI** — Modern glass-effect cards with subtle borders
- **Custom Cursor** — Interactive custom cursor for enhanced UX
- **Scroll Progress** — Visual scroll progress indicator
- **Chatbot** — Integrated chatbot for visitor interaction
- **Terminal Section** - Interactive terminal-style display
- **GitHub Stats** — GitHub statistics integration
- **Sound Effects** — UI audio feedback for interactions
- **Preloader** — Loading animation with technical aesthetic

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite 8
- **Animations**: Framer Motion 11
- **3D Graphics**: Three.js 0.171
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Theme**: Custom theme system with multiple modes
- **Build Tool**: Vite
- **TypeScript**: TypeScript for type checking
- **Audio**: Web Audio API for sound effects

## 📁 Project Structure

```
portfolio/
├── index.html                        # Vite entry HTML
├── vite.config.js                    # Vite config with React plugin & path alias
├── jsconfig.json                     # TypeScript configuration
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
    │   ├── utils.js                 # Utility functions
    │   └── audio.js                 # Audio effects management
    ├── hooks/
    │   ├── use-mobile.jsx           # Mobile breakpoint hook
    │   └── use-size.jsx             # Element size hook
    ├── context/
    │   └── ThemeContext.jsx        # Theme context provider
    ├── pages/
    │   └── Home.jsx                 # Main page with all sections
    └── components/
        ├── Hero.jsx                 # Hero section with profile and animations
        ├── About.jsx                # About section
        ├── Services.jsx              # Services showcase with spotlight cards
        ├── TechStack.jsx            # Technology skills display
        ├── GithubStats.jsx           # GitHub statistics integration
        ├── Experience.jsx           # Work experience timeline
        ├── Projects.jsx             # Project showcase with technology tags
        ├── Education.jsx            # Education history
        ├── Terminal.jsx              # Interactive terminal section
        ├── Contact.jsx              # Contact form and info
        ├── Footer.jsx               # Footer with social links
        ├── Navbar.jsx               # Navigation bar
        ├── Preloader.jsx            # Loading animation
        ├── MeshBackground.jsx       # Three.js mesh background
        ├── Scene3D.jsx              # 3D scene component
        ├── WireframeOrb.jsx         # 3D orb component
        ├── GoogleIcon.jsx           # Google icon component
        ├── ScrollToTop.jsx          # Scroll to top button
        ├── ThemeCustomizer.jsx      # Theme customization panel
        ├── Chatbot.jsx              # Chatbot integration
        └── ui/
            ├── image.jsx            # Simple image component
            ├── Magnetic.jsx          # Magnetic button effect
            ├── CustomCursor.jsx      # Custom cursor component
            └── ScrollProgress.jsx    # Scroll progress indicator
```

## 🎨 Design Elements
- **Color Scheme**: Dark theme with neon accents (CSS variables for easy customization)
- **Typography**: Inter Tight & JetBrains Mono
- **Glassmorphism**: Backdrop-blur cards with subtle borders
- **Themes**: Dark (default), Light, Auto, and Colorful modes
- **Animations**: Mesh gradient background, floating elements, gradient text, hover effects, spotlight effects
- **Responsive**: Optimized for all screen sizes including small devices (iPhone SE)

## 📱 Sections
1. **Hero** — Name, title, profile image, CTA buttons with magnetic effects
2. **About** — Personal introduction and background
3. **Services** — Specialized services showcase with interactive spotlight cards
4. **TechStack** — Technology skills display with categorized skills
5. **GithubStats** — GitHub statistics and activity
6. **Experience** — Work experience timeline with git-inspired design
7. **Projects** — Project showcase with technology tags and hover effects
8. **Education** — Education history cards
9. **Terminal** — Interactive terminal-style section
10. **Contact** — Contact form and location info
11. **Footer** — Social links and copyright

**Interactive Features:**
- **Chatbot** — Question answering about skills, experience, and projects
- **Theme Customizer** — Multiple theme modes and customization
- **Custom Cursor** — Enhanced cursor interaction
- **Scroll Progress** — Visual navigation indicator

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

# Run type checking
npm run typecheck

# Run linter
npm run lint

```

## ✏️ Updating Content

Edit content in the component files or `src/data/portfolioData.js`:

| File/Component | What it controls |
|---|---|
| `Hero.jsx` | Profile image, name, title, intro text |
| `About.jsx` | About section content |
| `Services.jsx` | Services and specialized offerings |
| `Experience.jsx` | Work history cards |
| `Education.jsx` | Education cards |
| `Projects.jsx` | Project cards with images and tags |
| `Contact.jsx` | Contact form and location info |
| `Footer.jsx` | Social links |
| `portfolioData.js` | Additional data exports (skills, certifications, etc.) |

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach with breakpoints for small, medium, and large screens
- Special optimizations for iPhone SE and similar small devices
- Prevented overlapping elements on small screens
- Responsive typography and spacing

### Theme System
- Four theme modes: Dark, Light, Auto, and Colorful
- Persistent theme preference using localStorage
- Theme customization panel for easy switching
- CSS custom properties for easy theme customization

### Interactive Elements
- Custom cursor with smooth following animation
- Magnetic button effects for enhanced interaction
- Scroll progress indicator
- Sound effects using Web Audio API
- Spotlight effects on service cards
- 3D elements and animations
- Chatbot with question-answering capabilities

### Performance
- Optimized animations using Framer Motion
- Lazy loading of components
- Efficient state management
- TypeScript for type safety
- Optimized build configuration

## 📄 License
© 2026 Viraj Lakshitha Adhikari. All rights reserved.
