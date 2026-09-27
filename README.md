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
- **Contact Form (EmailJS)** — Client-side contact form with real-time email delivery
- **3D Background** — Three.js powered mesh background and 3D scenes
- **Glassmorphism UI** — Modern glass-effect cards with subtle borders
- **Custom Cursor** — Interactive custom cursor for enhanced UX
- **Scroll Progress** — Visual scroll progress indicator
- **Chatbot** — Integrated chatbot for visitor interaction
- **Command Palette** — Quick navigation via `Ctrl+K` or `Cmd+K` shortcut
- **Terminal Section** — Interactive terminal-style display
- **GitHub Stats** — Live GitHub statistics integration
- **Sound Effects** — UI audio feedback for interactions
- **Preloader** — Loading animation with technical aesthetic
- **Web Analytics** — Integrated Vercel Analytics for tracking page views
- **SEO & Social Sharing** — Full Open Graph and Twitter meta tags with custom premium preview images (for WhatsApp, LinkedIn, etc.)

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite 6
- **Animations**: Framer Motion 11
- **3D Graphics**: Three.js 0.171
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Theme**: Custom theme system with multiple modes
- **Forms & Emails**: EmailJS
- **Analytics**: Vercel Web Analytics
- **TypeScript**: TypeScript for type checking
- **Audio**: Web Audio API for sound effects

## 📁 Project Structure

```
portfolio/
├── index.html                        # Vite entry HTML with SEO meta tags
├── vite.config.js                    # Vite config with React plugin & path alias
├── jsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── README.md                         # This file
├── public/
│   ├── favicon.png                   # Modern monogram favicon
│   ├── og-image.jpg                  # Open Graph preview image
│   └── ...                           # Other static assets
└── src/
    ├── main.jsx                      # App entry point
    ├── App.jsx                       # Root component with Router & Analytics
    ├── index.css                     # Global styles & CSS variables
    ├── data/
    │   └── portfolioData.js          # Static content configuration
    ├── lib/
    │   ├── theme-context.jsx         # Theme state management
    │   ├── utils.js                  # Utility functions
    │   └── audio.js                  # Audio effects management
    ├── hooks/
    │   ├── use-mobile.jsx            # Mobile breakpoint hook
    │   └── use-size.jsx              # Element size hook
    ├── context/
    │   └── ThemeContext.jsx          # Theme context provider
    ├── pages/
    │   └── Home.jsx                  # Main page with all sections
    └── components/
        ├── Hero.jsx                  # Hero section with profile and animations
        ├── About.jsx                 # About section
        ├── Services.jsx              # Services showcase with spotlight cards
        ├── TechStack.jsx             # Technology skills display
        ├── GithubStats.jsx           # Clean GitHub statistics integration
        ├── Experience.jsx            # Work experience timeline
        ├── Projects.jsx              # Project showcase with technology tags
        ├── Education.jsx             # Education history
        ├── Terminal.jsx              # Interactive terminal section
        ├── Contact.jsx               # Contact form with EmailJS functionality
        ├── Footer.jsx                # Footer with social links
        ├── Navbar.jsx                # Navigation bar
        ├── Preloader.jsx             # Loading animation
        ├── MeshBackground.jsx        # Three.js mesh background
        ├── Scene3D.jsx               # 3D scene component
        ├── WireframeOrb.jsx          # 3D orb component
        ├── CommandPalette.jsx        # Ctrl+K global search modal
        ├── ThemeCustomizer.jsx       # Theme customization panel
        ├── Chatbot.jsx               # Chatbot integration
        └── ui/
            ├── image.jsx             # Optimized image component
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
5. **GithubStats** — Clean GitHub statistics and activity tracking
6. **Experience** — Work experience timeline with git-inspired design
7. **Projects** — Project showcase with technology tags and hover effects
8. **Education** — Education history cards
9. **Terminal** — Interactive terminal-style section
10. **Contact** — Contact form using EmailJS and location info
11. **Footer** — Social links and copyright

**Interactive Features:**
- **Chatbot** — Question answering about skills, experience, and projects
- **Command Palette** — Global `Ctrl+K` search bar
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
```

## 🔐 Environment Variables

For the Contact form and Analytics to work, create a `.env` file in the root directory:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
*(Ensure these exact variables are also configured in your Vercel Project Settings for production).*

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
| `Contact.jsx` | Contact form configuration |
| `Footer.jsx` | Social links |
| `portfolioData.js` | Additional data exports (skills, certifications, etc.) |

## 📄 License
© 2026 Viraj Lakshitha Adhikari. All rights reserved.
