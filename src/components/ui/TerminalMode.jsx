import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeRoom } from '@/lib/escape-room-context';
import { uiAudio } from '@/lib/audio';

const PROMPT = 'visitor@viraj.dev:~$ ';

const INITIAL_FS = {
  '/': ['about/', 'projects/', 'skills/', 'experience/', 'contact.sh', 'resume.pdf'],
  '/about': ['bio.txt', 'philosophy.txt'],
  '/projects': ['arima-pos.md', 'food-ordering.md', 'sc-graphic-store.md', 'ecommerce-api.md'],
  '/skills': ['frontend.txt', 'backend.txt', 'devops.txt'],
  '/experience': ['roles.txt'],
};

const INITIAL_FILES = {
  '/contact.sh': `#!/bin/bash
# Contact Viraj Lakshitha Adhikari
echo "📧 viraj.lakshitha.22222@gmail.com"
echo "📱 +94 769 291 462"
echo "🔗 linkedin.com/in/viraj-lakshitha01"
echo "💻 github.com/Viraj-Lakshitha12"
echo ""
echo "Status: Open to Full-time & Selected Consulting Projects"`,

  '/about/bio.txt': `Name:        Viraj Lakshitha Adhikari
Role:        Full Stack Software Engineer
Location:    Sri Lanka 🇱🇰
Company:     INTELLEON (2024 - Present)
Available:   Open to opportunities

Specialises in high-performance web systems with React, 
TypeScript, Java Spring Boot, Node.js, and modern DevOps.
Architects clean, scalable, production-grade applications.`,

  '/about/philosophy.txt': `"I architect and build scalable, high-performance
web applications with a focus on seamless user
experiences and robust backend systems."

Great software should feel effortless, fast, and durable.
Every millisecond of latency eliminated is respect paid to the user.`,

  '/skills/frontend.txt': `React / Next.js     ████████████ 95%
TypeScript          ████████████ 92%
Tailwind CSS        ████████████ 95%
Framer Motion       ████████████ 90%
Three.js / WebGL    ███████░░░░░ 72%
Redux / Zustand     ██████████░░ 88%`,

  '/skills/backend.txt': `Java Spring Boot    ████████████ 92%
Node.js / Express   ████████████ 90%
PostgreSQL / SQL    ███████████░ 88%
MongoDB             ██████████░░ 85%
Redis Caching       █████████░░░ 82%
Docker / Microserv. ██████████░░ 86%`,

  '/skills/devops.txt': `Docker / Compose    ██████████░░ 86%
Git / GitHub CI/CD  ████████████ 94%
AWS (EC2, S3)       ███████░░░░░ 72%
Vercel & Netlify    ████████████ 95%
Linux Shell Script  ██████████░░ 85%`,

  '/experience/roles.txt': `[2024 - Present]  Software Engineer @ INTELLEON
                  Java Spring Boot, React, Microservices, Cloud

[2023 - 2024]     Associate Software Engineer @ INTELLEON
                  Full stack web applications, REST APIs

[2023]            Intern Software Engineer @ INTELLEON
                  Component architecture, automated testing`,

  '/projects/arima-pos.md': `# Arimax Cloud POS System
Stack: React · TypeScript · Spring Boot · PostgreSQL
• Full rewrite replacing legacy system with zero data loss
• Real-time multi-branch inventory sync with 99.9% uptime
• 40% reduction in checkout latency (< 180ms avg response)`,

  '/projects/food-ordering.md': `# Real-Time Food Ordering Platform
Stack: React · Node.js · Express.js · MongoDB · Redis
• Multi-role live dispatch for restaurant, courier, customer
• Socket.io event-driven tracking with < 50ms broadcast delay`,

  '/projects/sc-graphic-store.md': `# SC Graphic Asset Store
Stack: React · Node.js · Cloudinary · Stripe
• Digital media e-commerce platform with automated DRM & checkout`,

  '/projects/ecommerce-api.md': `# High-Concurrency E-Commerce API
Stack: Spring Boot · Redis Cache · PostgreSQL · Docker
• Rate-limited REST API handling 1,500+ requests/sec with JWT auth`,
};

const COLOR_PALETTE = {
  blue: { dark: '#64D2FF', glow: 'rgba(100, 210, 255, 0.4)', name: 'Blue' },
  emerald: { dark: '#34d399', glow: 'rgba(52, 211, 153, 0.4)', name: 'Emerald' },
  violet: { dark: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)', name: 'Violet' },
  rose: { dark: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)', name: 'Rose' },
  amber: { dark: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', name: 'Amber' },
};

const ALL_COMMANDS = [
  'help', 'ls', 'cd', 'cat', 'pwd', 'tree', 'touch', 'mkdir', 'rm',
  'neofetch', 'sysinfo', 'matrix', 'ping', 'curl', 'theme', 'top', 'htop',
  'weather', 'git', 'cv', 'download', 'snake', 'game', 'play', 'history',
  'hint', 'whoami', 'date', 'uptime', 'clear', 'exit'
];

const HELP_TEXT = `╔══════════════════════════════════════════════════════════════════╗
║               VIRAJ.DEV ADVANCED WORKSTATION v3.0                ║
╚══════════════════════════════════════════════════════════════════╝

📁 File System & Navigation:
  ls [-l]          List directory contents
  cd <dir>         Change directory (e.g. cd projects, cd ..)
  cat <file>       Display file contents (e.g. cat /about/bio.txt)
  pwd              Print working directory
  tree             Render complete visual directory tree
  touch <file>     Create a new empty file
  mkdir <dir>      Create a new directory
  rm <file>        Delete a file

🎮 Games & Interactive:
  snake / game     Play Retro Cyberpunk Terminal Snake Game!
  matrix           Cinematic digital green rain animation

⚡ Pro Developer Tools:
  neofetch         System architecture & live telemetry
  ping <host>      Network latency ping test (e.g. ping google.com)
  curl <endpoint>  Fetch simulated API response
  theme <color>    Switch portfolio color (blue, emerald, violet, rose, amber)
  top / htop       Real-time virtual process monitor
  weather          Live ASCII weather for Colombo, Sri Lanka
  git [status|log] Inspect portfolio repository state & commits
  download cv      1-click download Viraj's official CV

🔧 System & Session:
  history          Display command history
  hint             Inspect escape room secrets hint
  clear            Clear terminal buffer
  exit             Exit and close the terminal workstation

💡 Pro tips:
  • Press [TAB] for instant command & file autocompletion!
  • Type "exit" to close the terminal session anytime.`;

// ── Retro Cyberpunk Terminal Snake Game (High-Performance 60FPS Canvas Engine) ──
const GRID_COLS = 32;
const GRID_ROWS = 20;

function TerminalSnakeGame({ onExit }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // High score initialization from localStorage
  const getStoredHighScore = () => {
    try {
      return parseInt(localStorage.getItem('vl_snake_highscore') || '0', 10);
    } catch {
      return 0;
    }
  };

  // State refs for 60 FPS game simulation (No React reconciliation stutter during gameplay)
  const stateRef = useRef({
    snake: [
      { x: 14, y: 10 },
      { x: 13, y: 10 },
      { x: 12, y: 10 },
      { x: 11, y: 10 },
    ],
    dir: { x: 1, y: 0 },
    inputQueue: [],
    food: { x: 24, y: 10 },
    score: 0,
    highScore: getStoredHighScore(),
    speedLevel: 1,
    hasStarted: false,
    isGameOver: false,
    isPaused: false,
    particles: [],
    accumulator: 0,
    lastFrameTime: 0,
  });

  // React state for HUD labels (updated strictly on events/score changes, NOT on animation ticks)
  const [hasStarted, setHasStarted] = useState(false);
  const [hudScore, setHudScore] = useState(0);
  const [hudHighScore, setHudHighScore] = useState(getStoredHighScore);
  const [hudSpeed, setHudSpeed] = useState(1);
  const [hudLength, setHudLength] = useState(4);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Helper to spawn food on an empty coordinate
  const spawnFood = (currentSnake) => {
    let newFood;
    let collision;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_COLS),
        y: Math.floor(Math.random() * GRID_ROWS),
      };
      collision = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      attempts++;
    } while (collision && attempts < 300);
    return newFood;
  };

  // Helper to reset the game state
  const resetGame = useCallback(() => {
    const freshSnake = [
      { x: 14, y: 10 },
      { x: 13, y: 10 },
      { x: 12, y: 10 },
      { x: 11, y: 10 },
    ];
    const freshFood = spawnFood(freshSnake);
    const curHighScore = stateRef.current.highScore;

    stateRef.current.snake = freshSnake;
    stateRef.current.dir = { x: 1, y: 0 };
    stateRef.current.inputQueue = [];
    stateRef.current.food = freshFood;
    stateRef.current.score = 0;
    stateRef.current.speedLevel = 1;
    stateRef.current.hasStarted = false;
    stateRef.current.isGameOver = false;
    stateRef.current.isPaused = false;
    stateRef.current.particles = [];
    stateRef.current.accumulator = 0;
    stateRef.current.lastFrameTime = performance.now();

    setHudScore(0);
    setHudSpeed(1);
    setHudLength(4);
    setHasStarted(false);
    setIsGameOver(false);
    setIsPaused(false);
    setHudHighScore(curHighScore);
    uiAudio.playClick();
  }, []);

  const queueDirection = useCallback((newDir) => {
    const state = stateRef.current;
    if (state.isGameOver) return;

    // Start simulation on first player input
    if (!state.hasStarted) {
      state.hasStarted = true;
      setHasStarted(true);
      state.accumulator = 0;
      state.lastFrameTime = performance.now();
    }

    if (state.isPaused) return;

    const queue = state.inputQueue;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : state.dir;

    if (newDir.x === -lastDir.x && newDir.y === -lastDir.y) return;
    if (newDir.x === lastDir.x && newDir.y === lastDir.y) return;

    if (queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  const togglePause = useCallback(() => {
    if (stateRef.current.isGameOver || !stateRef.current.hasStarted) return;
    stateRef.current.isPaused = !stateRef.current.isPaused;
    setIsPaused(stateRef.current.isPaused);
    uiAudio.playClick();
  }, []);

  const launchGame = useCallback(() => {
    if (stateRef.current.isGameOver) {
      resetGame();
      return;
    }
    if (!stateRef.current.hasStarted) {
      stateRef.current.hasStarted = true;
      setHasStarted(true);
      stateRef.current.accumulator = 0;
      stateRef.current.lastFrameTime = performance.now();
      uiAudio.playClick();
    } else {
      togglePause();
    }
  }, [resetGame, togglePause]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Exit keys: ESC or Q
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        onExit(stateRef.current.score);
        return;
      }

      // Space: Launch, Pause/Resume, or restart on game over
      if (e.key === ' ') {
        e.preventDefault();
        launchGame();
        return;
      }

      // R key: Instant restart
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetGame();
        return;
      }

      // Enter key: Launch or Restart on game over
      if (e.key === 'Enter') {
        e.preventDefault();
        if (stateRef.current.isGameOver) {
          resetGame();
        } else if (!stateRef.current.hasStarted) {
          launchGame();
        }
        return;
      }

      // Direction keys (WASD & Arrows)
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        queueDirection({ x: 0, y: -1 });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        queueDirection({ x: 0, y: 1 });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        queueDirection({ x: -1, y: 0 });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        queueDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queueDirection, togglePause, launchGame, resetGame, onExit]);

  // Canvas Animation & 60FPS Simulation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // Responsive Canvas Resize with devicePixelRatio capping for max performance
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(320, Math.floor(rect.width * dpr));
      canvas.height = Math.max(200, Math.floor(rect.height * dpr));
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    const state = stateRef.current;
    state.lastFrameTime = performance.now();

    const renderLoop = (now) => {
      const dt = Math.min(now - state.lastFrameTime, 100);
      state.lastFrameTime = now;

      if (state.hasStarted && !state.isGameOver && !state.isPaused) {
        const tickDelay = Math.max(62, 120 - (state.speedLevel - 1) * 7);
        state.accumulator += dt;

        while (state.accumulator >= tickDelay) {
          state.accumulator -= tickDelay;

          // Consume next queued direction
          if (state.inputQueue.length > 0) {
            state.dir = state.inputQueue.shift();
          }

          const head = state.snake[0];
          const newHead = {
            x: head.x + state.dir.x,
            y: head.y + state.dir.y,
          };

          // Wall collision detection
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_COLS ||
            newHead.y < 0 ||
            newHead.y >= GRID_ROWS
          ) {
            state.isGameOver = true;
            setIsGameOver(true);
            const cellW = canvas.width / GRID_COLS;
            const cellH = canvas.height / GRID_ROWS;
            for (let i = 0; i < 28; i++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5;
              state.particles.push({
                x: (head.x + 0.5) * cellW,
                y: (head.y + 0.5) * cellH,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: ['#ef4444', '#f59e0b', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)],
                size: 2 + Math.random() * 4,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.03,
              });
            }
            break;
          }

          // Self collision detection
          if (state.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
            state.isGameOver = true;
            setIsGameOver(true);
            const cellW = canvas.width / GRID_COLS;
            const cellH = canvas.height / GRID_ROWS;
            for (let i = 0; i < 28; i++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 5;
              state.particles.push({
                x: (head.x + 0.5) * cellW,
                y: (head.y + 0.5) * cellH,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: ['#ef4444', '#f59e0b', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)],
                size: 2 + Math.random() * 4,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.03,
              });
            }
            break;
          }

          const newSnake = [newHead, ...state.snake];

          // Check if food was eaten
          if (newHead.x === state.food.x && newHead.y === state.food.y) {
            uiAudio.playClick();
            state.score += 10;
            const newSpeed = 1 + Math.floor(state.score / 50);
            state.speedLevel = newSpeed;

            if (state.score > state.highScore) {
              state.highScore = state.score;
              try {
                localStorage.setItem('vl_snake_highscore', String(state.score));
              } catch { }
              setHudHighScore(state.score);
            }

            // Burst neon celebration particles
            const cellW = canvas.width / GRID_COLS;
            const cellH = canvas.height / GRID_ROWS;
            for (let i = 0; i < 20; i++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 1.5 + Math.random() * 4.5;
              state.particles.push({
                x: (state.food.x + 0.5) * cellW,
                y: (state.food.y + 0.5) * cellH,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                color: ['#34d399', '#22d3ee', '#fbbf24', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 5)],
                size: 2 + Math.random() * 3.5,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.025,
              });
            }

            state.food = spawnFood(newSnake);
            setHudScore(state.score);
            setHudSpeed(newSpeed);
            setHudLength(newSnake.length);
          } else {
            newSnake.pop();
          }

          state.snake = newSnake;
        }
      }

      // Update particle physics
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
        }
      }

      // ── CANVAS DRAWING ──
      const width = canvas.width;
      const height = canvas.height;
      const cellW = width / GRID_COLS;
      const cellH = height / GRID_ROWS;

      // 1. Cyberpunk Dark Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, Math.max(width, height) * 0.65
      );
      bgGrad.addColorStop(0, '#0a121e');
      bgGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Neon Grid Matrix
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= GRID_COLS; c++) {
        const x = c * cellW;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= GRID_ROWS; r++) {
        const y = r * cellH;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Cyber Grid Cross Marks
      ctx.fillStyle = 'rgba(52, 211, 153, 0.12)';
      for (let c = 4; c < GRID_COLS; c += 4) {
        for (let r = 4; r < GRID_ROWS; r += 4) {
          ctx.fillRect(c * cellW - 1, r * cellH - 3, 2, 6);
          ctx.fillRect(c * cellW - 3, r * cellH - 1, 6, 2);
        }
      }

      // 3. Draw Food (Glowing Cyber Energy Core)
      const foodX = (state.food.x + 0.5) * cellW;
      const foodY = (state.food.y + 0.5) * cellH;
      const pulse = Math.sin(now * 0.007) * 2;
      const coreR = Math.max(3, Math.min(cellW, cellH) * 0.35 + pulse);

      ctx.save();
      // Outer Glow Halo
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.beginPath();
      ctx.arc(foodX, foodY, coreR + 4, 0, Math.PI * 2);
      ctx.fill();

      // Energy Core Orb
      const foodGrad = ctx.createRadialGradient(
        foodX - 2, foodY - 2, 1,
        foodX, foodY, coreR
      );
      foodGrad.addColorStop(0, '#ffffff');
      foodGrad.addColorStop(0.3, '#fb7185');
      foodGrad.addColorStop(1, '#e11d48');
      ctx.fillStyle = foodGrad;
      ctx.beginPath();
      ctx.arc(foodX, foodY, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Energy Moters
      const orbitAng = now * 0.003;
      const orbDist = coreR + 6;
      ctx.fillStyle = '#fecdd3';
      ctx.beginPath();
      ctx.arc(foodX + Math.cos(orbitAng) * orbDist, foodY + Math.sin(orbitAng) * orbDist, 1.8, 0, Math.PI * 2);
      ctx.arc(foodX - Math.cos(orbitAng) * orbDist, foodY - Math.sin(orbitAng) * orbDist, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Draw Snake
      const snake = state.snake;
      const segLen = snake.length;

      // Draw segments from tail to head
      for (let i = segLen - 1; i >= 0; i--) {
        const seg = snake[i];
        const isHead = i === 0;
        const px = seg.x * cellW;
        const py = seg.y * cellH;
        const pad = Math.max(1, cellW * 0.08);
        const sw = cellW - pad * 2;
        const sh = cellH - pad * 2;
        const radius = Math.min(sw, sh) * (isHead ? 0.38 : 0.28);

        ctx.save();
        if (isHead) {
          // Snake Head Glow
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 16;
          const headGrad = ctx.createLinearGradient(px, py, px + sw, py + sh);
          headGrad.addColorStop(0, '#6ee7b7');
          headGrad.addColorStop(1, '#10b981');
          ctx.fillStyle = headGrad;
        } else {
          // Body Segments Fade towards tail
          const alpha = Math.max(0.4, 1 - (i / segLen) * 0.55);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        }

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px + pad, py + pad, sw, sh, radius);
        } else {
          ctx.rect(px + pad, py + pad, sw, sh);
        }
        ctx.fill();

        // Cyber Head Optics (Sensor Eyes)
        if (isHead) {
          ctx.shadowBlur = 0;
          const eyeSize = Math.max(2, Math.min(sw, sh) * 0.16);
          let eye1 = { x: 0, y: 0 };
          let eye2 = { x: 0, y: 0 };

          if (state.dir.y === -1) { // UP
            eye1 = { x: px + sw * 0.28, y: py + sh * 0.28 };
            eye2 = { x: px + sw * 0.72, y: py + sh * 0.28 };
          } else if (state.dir.y === 1) { // DOWN
            eye1 = { x: px + sw * 0.28, y: py + sh * 0.72 };
            eye2 = { x: px + sw * 0.72, y: py + sh * 0.72 };
          } else if (state.dir.x === -1) { // LEFT
            eye1 = { x: px + sw * 0.28, y: py + sh * 0.28 };
            eye2 = { x: px + sw * 0.28, y: py + sh * 0.72 };
          } else { // RIGHT
            eye1 = { x: px + sw * 0.72, y: py + sh * 0.28 };
            eye2 = { x: px + sw * 0.72, y: py + sh * 0.72 };
          }

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, eyeSize * 0.55, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, eyeSize * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 5. Draw Particles
      if (state.particles.length > 0) {
        ctx.save();
        for (const p of state.particles) {
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-2.5 sm:p-4 select-none w-full max-w-5xl mx-auto overflow-hidden">
      {/* Modern Cyber Arcade HUD */}
      <div className="w-full flex items-center justify-between px-3 sm:px-4 py-2 rounded-xl border border-emerald-500/30 bg-zinc-950/85 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.12)]">
        {/* Branding & Status */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🐍</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400 text-xs sm:text-sm tracking-wider font-mono">
                CYBER_SNAKE
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                v2.0
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono hidden sm:block">
              60 FPS · GPU ACCELERATED CANVAS
            </div>
          </div>
        </div>

        {/* Live Telemetry */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
            <span className="text-zinc-500 text-[10px]">SCORE</span>
            <span className="text-emerald-400 font-bold text-sm sm:text-base">{hudScore}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
            <span className="text-zinc-500 text-[10px]">RECORD</span>
            <span className="text-amber-400 font-bold text-sm sm:text-base">{hudHighScore}</span>
          </div>
          <div className="hidden md:flex flex-col md:flex-row md:items-center md:gap-1">
            <span className="text-zinc-500 text-[10px]">SPEED</span>
            <span className="text-cyan-400 font-bold text-xs sm:text-sm">{hudSpeed}x</span>
          </div>
          <div className="hidden md:flex flex-col md:flex-row md:items-center md:gap-1">
            <span className="text-zinc-500 text-[10px]">LENGTH</span>
            <span className="text-zinc-300 font-bold text-xs sm:text-sm">{hudLength}</span>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-800">
            <button
              onClick={togglePause}
              className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 transition-colors"
              title="Pause or Resume (Space)"
            >
              {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
            </button>
            <button
              onClick={resetGame}
              className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 transition-colors"
              title="Restart Game (R)"
            >
              ↺
            </button>
            <button
              onClick={() => onExit(hudScore)}
              className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/50 hover:bg-red-900/60 text-[11px] text-red-300 transition-colors font-semibold"
              title="Exit Game to Terminal Shell (ESC / Q)"
            >
              ✕ EXIT
            </button>
          </div>
        </div>
      </div>

      {/* Spacious Widescreen Arcade Game Cabinet */}
      <div className="relative w-full flex-1 max-h-[64vh] min-h-[280px] flex items-center justify-center my-2 sm:my-3">
        <div
          ref={containerRef}
          className="relative w-full h-full max-w-4xl aspect-[16/10] border-2 border-emerald-500/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.18)] bg-[#05080c]"
        >
          {/* Main 60FPS Canvas */}
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* CRT Scanline & Subtle Vignette Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-70" />

          {/* High-Tech Corner Accent Brackets */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/60 pointer-events-none z-10" />
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400/60 pointer-events-none z-10" />
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400/60 pointer-events-none z-10" />
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/60 pointer-events-none z-10" />

          {/* Waiting to Start Ready Overlay */}
          {!hasStarted && !isGameOver && (
            <div
              onClick={launchGame}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4 cursor-pointer select-none"
            >
              <div className="px-6 py-3.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-pulse max-w-md">
                <div className="text-emerald-400 font-mono font-bold text-sm sm:text-base flex items-center justify-center gap-2">
                  <span>🐍</span> PRESS ARROWS OR WASD TO START
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1.5">
                  Steer to collect glowing power cores · Avoid walls &amp; self-collision
                </div>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md">
                  CLICK OR PRESS SPACE TO PLAY
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 text-center animate-fadeIn">
              <span className="text-4xl mb-2">💥</span>
              <h3 className="text-xl sm:text-2xl font-bold text-red-400 tracking-wider font-mono">
                SYSTEM COLLISION
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-mono">
                Final Score:{' '}
                <span className="text-emerald-400 font-bold text-base sm:text-lg">{hudScore}</span>
              </p>
              {hudScore >= hudHighScore && hudScore > 0 && (
                <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse">
                  🏆 NEW HIGH RECORD UNLOCKED!
                </div>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={resetGame}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105"
                >
                  PLAY AGAIN (ENTER)
                </button>
                <button
                  onClick={() => onExit(hudScore)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900/90 text-zinc-300 text-xs sm:text-sm hover:text-white hover:border-zinc-600 transition-colors"
                >
                  EXIT TO TERMINAL (ESC)
                </button>
              </div>
            </div>
          )}

          {/* Paused Screen */}
          {isPaused && !isGameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-4">
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-widest font-mono animate-pulse">
                [ PAUSED ]
              </span>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
                Press <span className="text-white font-bold">SPACE</span> to resume
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={togglePause}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  RESUME
                </button>
                <button
                  onClick={() => onExit(hudScore)}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs hover:text-white transition-colors"
                >
                  EXIT TO TERMINAL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Touch Directional Controls (D-Pad) */}
      <div className="mt-1 flex flex-col items-center gap-1.5 sm:hidden">
        <button
          onClick={() => queueDirection({ x: 0, y: -1 })}
          className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-emerald-400 active:bg-emerald-950 active:border-emerald-500/50"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => queueDirection({ x: -1, y: 0 })}
            className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-emerald-400 active:bg-emerald-950 active:border-emerald-500/50"
          >
            ◄
          </button>
          <button
            onClick={() => queueDirection({ x: 0, y: 1 })}
            className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-emerald-400 active:bg-emerald-950 active:border-emerald-500/50"
          >
            ▼
          </button>
          <button
            onClick={() => queueDirection({ x: 1, y: 0 })}
            className="w-12 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-emerald-400 active:bg-emerald-950 active:border-emerald-500/50"
          >
            ►
          </button>
        </div>
      </div>

      {/* Desktop Keyboard Controls Legend */}
      <p className="text-[11px] font-mono text-zinc-500 text-center hidden sm:block">
        Controls: <span className="text-zinc-300">↑ / ↓ / ← / →</span> or{' '}
        <span className="text-zinc-300">W / A / S / D</span> ·{' '}
        <span className="text-zinc-300">Space</span>: Pause ·{' '}
        <span className="text-zinc-300">R</span>: Restart ·{' '}
        <span className="text-zinc-300">ESC / Q</span>: Exit Game
      </p>
    </div>
  );
}

export default function TerminalMode() {
  const [open, setOpen] = useState(false);
  const [fs, setFs] = useState(INITIAL_FS);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [cwd, setCwd] = useState('/');
  const [lines, setLines] = useState([
    { type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║   Viraj Lakshitha · Interactive Workstation v3.0.26       ║' },
    { type: 'system', text: '║   Type "help" for commands · Type "exit" to close         ║' },
    { type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
    { type: 'output', text: '' },
    { type: 'output', text: '⚡ Tip: Try "snake" to play the retro game, or "neofetch" for telemetry.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);
  const [snakeActive, setSnakeActive] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const escapeRoom = useEscapeRoom();
  const startTimeRef = useRef(Date.now());

  // Prevent background scrolling and pause Lenis when terminal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].stop();
      }
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && window['__lenis']) {
        window['__lenis'].start();
      }
    };
  }, [open]);

  // Toggle shortcuts: Alt+T, Ctrl+Shift+T, Ctrl+`, or custom event
  useEffect(() => {
    const handleToggleEvent = () => setOpen((o) => !o);
    const handleOpenEvent = () => setOpen(true);
    const handleCloseEvent = () => setOpen(false);

    window.addEventListener('toggle-terminal-mode', handleToggleEvent);
    window.addEventListener('open-terminal-mode', handleOpenEvent);
    window.addEventListener('close-terminal-mode', handleCloseEvent);

    const onKey = (e) => {
      if (
        (e.altKey && (e.key === 't' || e.key === 'T')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 't' || e.key === 'T')) ||
        (e.ctrlKey && (e.key === '`' || e.key === '~'))
      ) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && open) {
        if (matrixActive) {
          setMatrixActive(false);
          return;
        }
        if (snakeActive) {
          setSnakeActive(false);
          return;
        }
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('toggle-terminal-mode', handleToggleEvent);
      window.removeEventListener('open-terminal-mode', handleOpenEvent);
      window.removeEventListener('close-terminal-mode', handleCloseEvent);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, matrixActive, snakeActive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    if (!matrixActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const timer = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);

    // Auto-dismiss after 8 seconds
    const timeout = setTimeout(() => {
      setMatrixActive(false);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [matrixActive]);

  const resolvePath = useCallback(
    (path) => {
      if (path.startsWith('/')) return path;
      return (cwd === '/' ? '' : cwd) + '/' + path;
    },
    [cwd]
  );

  const print = useCallback((text, type = 'output') => {
    const arr = typeof text === 'string' ? text.split('\n') : text;
    setLines((prev) => [...prev, ...arr.map((t) => ({ type, text: t }))]);
  }, []);

  const handleSnakeExit = useCallback(
    (finalScore) => {
      setSnakeActive(false);
      print(`🐍 Snake session finished. Final score: ${finalScore}`, 'success');
      print('Type "snake" to play again, or "exit" to close terminal.');
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [print]
  );

  const runCommand = useCallback(
    (cmd) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      uiAudio.playClick();
      setHistory((h) => [trimmed, ...h].slice(0, 50));
      setHistIdx(-1);

      // Echo user input
      setLines((prev) => [...prev, { type: 'input', text: `${PROMPT}${trimmed}` }]);

      const [command, ...args] = trimmed.split(' ');
      const arg = args.join(' ').trim();
      const baseCmd = command.toLowerCase();

      switch (baseCmd) {
        case 'help':
          print(HELP_TEXT);
          break;

        case 'snake':
        case 'game':
        case 'play': {
          setSnakeActive(true);
          print('Launching Retro Terminal Snake Game...', 'system');
          break;
        }

        case 'ls': {
          const target = arg ? resolvePath(arg) : cwd;
          const normalized = target === '/' ? '/' : target.replace(/\/$/, '');
          const contents = fs[normalized] || fs[normalized + '/'];
          if (contents) {
            print(contents.map((f) => (f.endsWith('/') ? `📁 ${f}` : `📄 ${f}`)).join('    '));
          } else {
            print(`ls: ${arg}: No such directory`, 'error');
          }
          break;
        }

        case 'cd': {
          if (!arg || arg === '~') {
            setCwd('/');
            break;
          }
          if (arg === '..') {
            const parts = cwd.split('/').filter(Boolean);
            parts.pop();
            setCwd('/' + parts.join('/'));
            break;
          }
          const target = resolvePath(arg).replace(/\/+/g, '/').replace(/\/$/, '');
          const targetNormalized = target === '' ? '/' : target;
          if (fs[targetNormalized]) {
            setCwd(targetNormalized);
          } else {
            print(`cd: ${arg}: No such directory`, 'error');
          }
          break;
        }

        case 'cat': {
          if (!arg) {
            print('Usage: cat <filename>');
            break;
          }
          const path = resolvePath(arg);
          const content = files[path];
          if (content) {
            print(content);
            if (path === '/contact.sh' && escapeRoom) {
              escapeRoom.unlock('clue_3');
              print('\n🗝️ Clue 3/5 deciphered! Excellent investigative work.', 'success');
            }
          } else {
            print(`cat: ${arg}: No such file`, 'error');
          }
          break;
        }

        case 'pwd':
          print(cwd);
          break;

        case 'tree': {
          let treeOutput = '.\n';
          Object.keys(fs).forEach((dir) => {
            treeOutput += `├── ${dir === '/' ? 'root/' : dir}\n`;
            (fs[dir] || []).forEach((item) => {
              treeOutput += `│   └── ${item}\n`;
            });
          });
          print(treeOutput);
          break;
        }

        case 'touch': {
          if (!arg) {
            print('Usage: touch <filename>');
            break;
          }
          const path = resolvePath(arg);
          const filename = arg.split('/').pop();
          setFiles((prev) => ({
            ...prev,
            [path]: `# ${filename}\nCreated by visitor at ${new Date().toLocaleTimeString()}`,
          }));
          setFs((prev) => {
            const curList = prev[cwd] || [];
            return curList.includes(filename) ? prev : { ...prev, [cwd]: [...curList, filename] };
          });
          print(`Created file ${filename}`);
          break;
        }

        case 'mkdir': {
          if (!arg) {
            print('Usage: mkdir <dirname>');
            break;
          }
          const dirName = arg.replace(/\/$/, '') + '/';
          const fullDir = (cwd === '/' ? '' : cwd) + '/' + arg.replace(/\/$/, '');
          setFs((prev) => ({
            ...prev,
            [cwd]: [...(prev[cwd] || []), dirName],
            [fullDir]: [],
          }));
          print(`Created directory ${dirName}`);
          break;
        }

        case 'rm': {
          if (!arg) {
            print('Usage: rm <filename>');
            break;
          }
          const path = resolvePath(arg);
          const filename = arg.split('/').pop();
          setFiles((prev) => {
            const next = { ...prev };
            delete next[path];
            return next;
          });
          setFs((prev) => ({
            ...prev,
            [cwd]: (prev[cwd] || []).filter((f) => f !== filename && f !== filename + '/'),
          }));
          print(`Removed ${filename}`);
          break;
        }

        case 'neofetch':
        case 'sysinfo': {
          const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const mins = Math.floor(elapsedSec / 60);
          const secs = elapsedSec % 60;
          const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
          const res =
            typeof window !== 'undefined'
              ? `${window.innerWidth}x${window.innerHeight}`
              : '1920x1080';
          const browser =
            typeof navigator !== 'undefined' && navigator.userAgent.includes('Chrome')
              ? 'Google Chrome'
              : 'Modern Browser';

          const banner = `
          _      __     ___.          visitor@viraj.dev
         / \\    / /__  /   /          -----------------
        /   \\  / /   \\/   /           OS: Viraj-OS v3.0 (Web Architecture)
       /  /\\ \\/ / /\\     /            Host: Intel-Core Architecture · Sri Lanka 🇱🇰
      /__/  \\__/_/  \\___/             Uptime: ${mins}m ${secs}s
                                      Browser: ${browser}
                                      Cores: ${cores} vCPU Threads
                                      Resolution: ${res}
                                      Memory: ~8.0 GB Virtual V8 Heap
                                      Frontend: React 18 · Framer Motion · Three.js
                                      Backend: Java Spring Boot · PostgreSQL · Redis
                                      Status: Open for Full-Time / Consulting Roles ✅
        `;
          print(banner, 'system');
          break;
        }

        case 'matrix':
          setMatrixActive(true);
          print('Entering the Matrix... (Press ESC or wait 8s to return)', 'system');
          break;

        case 'ping': {
          const host = arg || 'google.com';
          print(`PING ${host} (142.250.190.46): 56 data bytes`);
          setTimeout(() => print(`64 bytes from ${host}: icmp_seq=0 ttl=118 time=14.2 ms`), 300);
          setTimeout(() => print(`64 bytes from ${host}: icmp_seq=1 ttl=118 time=13.8 ms`), 600);
          setTimeout(() => print(`64 bytes from ${host}: icmp_seq=2 ttl=118 time=15.1 ms`), 900);
          setTimeout(() => {
            print(`--- ${host} ping statistics ---`);
            print(`3 packets transmitted, 3 packets received, 0.0% packet loss`);
            print(`round-trip min/avg/max = 13.8/14.36/15.1 ms`, 'success');
          }, 1200);
          break;
        }

        case 'curl': {
          const endpoint = arg || 'api.viraj.dev/status';
          print(`Fetching HTTP/2 200 OK from ${endpoint}...`);
          const mockResponse = JSON.stringify(
            {
              status: 'online',
              engineer: 'Viraj Lakshitha Adhikari',
              role: 'Full Stack Software Engineer',
              company: 'INTELLEON',
              location: 'Sri Lanka',
              available_for_hire: true,
              response_latency_ms: 18,
              timestamp: new Date().toISOString(),
            },
            null,
            2
          );
          setTimeout(() => print(mockResponse, 'system'), 400);
          break;
        }

        case 'theme': {
          const selected = arg.toLowerCase();
          if (COLOR_PALETTE[selected]) {
            const c = COLOR_PALETTE[selected];
            document.documentElement.style.setProperty('--accent-dark', c.dark);
            document.documentElement.style.setProperty('--glow-dark', c.glow);
            document.documentElement.style.setProperty('--accent', c.dark);
            document.documentElement.style.setProperty('--glow', c.glow);
            try {
              localStorage.setItem('portfolio-color', c.name);
            } catch {
              // ignore
            }
            uiAudio.playSuccess();
            print(`✓ Palette updated to [${c.name.toUpperCase()}]. Interface updated.`, 'success');
          } else {
            print(`Available themes: ${Object.keys(COLOR_PALETTE).join(', ')}`);
            print('Usage: theme <color> (e.g. theme emerald, theme violet)');
          }
          break;
        }

        case 'top':
        case 'htop': {
          const topTable = `
  PID  USER     PR  NI    VIRT    RES  %CPU  %MEM     TIME+ COMMAND
  101  visitor  20   0  520.4M  48.2M   2.4   6.8   0:04.12 react-fiber-dom
  204  root     20   0  380.1M  32.0M   0.8   4.5   0:01.89 vite-hmr-server
  319  viraj    20   0  812.9M  94.1M   3.8  13.2   0:12.44 neural-engine
  404  daemon   20   0  120.0M   8.4M   0.1   1.2   0:00.32 coffee-daemon
  999  security 20   0  240.5M  18.6M   0.2   2.6   0:00.88 escape-monitor
        `;
          print(topTable, 'system');
          break;
        }

        case 'weather': {
          const weatherCard = `
  📍 Colombo, Sri Lanka (GMT+5:30)
  ┌──────────────────────────────┐
  │       \\   /      Clear Sky   │
  │        .-.       29°C / 84°F │
  │     ― (   ) ―    Humidity 72%│
  │        \`-'       Wind: 14km/h│
  │       /   \\      UV Index: 6 │
  └──────────────────────────────┘
  Condition: Optimal coding weather.
        `;
          print(weatherCard, 'system');
          break;
        }

        case 'git': {
          if (arg === 'log') {
            print(`commit a89e1b2 (HEAD -> main, origin/main)
Author: Viraj Lakshitha <viraj.lakshitha.22222@gmail.com>
Date:   ${new Date().toDateString()}

    feat: integrate retro snake game, terminal workstation v3, and secrets system

commit 7f33d41
Author: Viraj Lakshitha <viraj.lakshitha.22222@gmail.com>

    refactor: optimize 60fps physics, custom cursor and theme customization`);
          } else {
            print(
              `On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean ✨`,
              'success'
            );
          }
          break;
        }

        case 'cv':
        case 'download': {
          const a = document.createElement('a');
          a.href = '/Viraj_Lakshitha_CV.pdf';
          a.download = 'Viraj_Lakshitha_CV.pdf';
          a.click();
          uiAudio.playSuccess();
          print('Initiating secure download of Viraj_Lakshitha_CV.pdf...');
          print('[████████████████████████████████] 100% (2.4 MB)', 'system');
          print('✓ CV dispatched to your browser download manager!', 'success');
          break;
        }

        case 'sudo': {
          if (arg.includes('rm -rf') || arg.includes('rm')) {
            print('⚠️ ROOT SECURITY BREACH DETECTED!', 'error');
            print('Access denied: "Nice try, Neo. The matrix is bulletproof." 😉');
          } else {
            print('sudo: permission denied. Viraj holds root authority here.');
          }
          break;
        }

        case 'whoami':
          print('visitor · curious investigator · welcomed guest');
          break;

        case 'date':
          print(
            `📅 ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })} (Sri Lanka Time)`
          );
          break;

        case 'uptime': {
          const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
          print(`Terminal session uptime: ${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`);
          break;
        }

        case 'history':
          print(history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') || 'No commands recorded yet.');
          break;

        case 'clear':
          setLines([]);
          break;

        case 'hint':
          if (escapeRoom) {
            const notFound = Object.keys(escapeRoom.CLUE_HINTS).find(
              (k) => !escapeRoom.found[k]
            );
            if (notFound) {
              print(`💡 Secret Clue Hint: ${escapeRoom.CLUE_HINTS[notFound]}`, 'system');
            } else {
              print(
                '🏆 Incredible! All 5 secrets unlocked! Check your Victory Screen.',
                'success'
              );
            }
          }
          break;

        // Primary exit command
        case 'exit':
          print('Closing workstation terminal session... Have a great day! 👋', 'system');
          setTimeout(() => setOpen(false), 200);
          break;

        case 'quit':
          print('Closing workstation terminal session... (Tip: use "exit" anytime) 👋', 'system');
          setTimeout(() => setOpen(false), 200);
          break;

        default:
          print(
            `command not found: "${command}". Type "help" to view all available commands.`,
            'error'
          );
      }

      print('');
    },
    [cwd, fs, files, history, resolvePath, escapeRoom]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const onKeyDown = (e) => {
    uiAudio.playTyping();

    // Tab Autocompletion
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.trimStart();
      const parts = current.split(' ');

      if (parts.length === 1) {
        const prefix = parts[0].toLowerCase();
        const match = ALL_COMMANDS.find((c) => c.startsWith(prefix) && c !== prefix);
        if (match) {
          setInput(match + ' ');
          uiAudio.playClick();
        }
      } else if (parts.length >= 2) {
        const prefix = parts[parts.length - 1];
        const contents = fs[cwd] || [];
        const match = contents.find((f) => f.startsWith(prefix) && f !== prefix);
        if (match) {
          parts[parts.length - 1] = match;
          setInput(parts.join(' ') + (match.endsWith('/') ? '' : ' '));
          uiAudio.playClick();
        }
      }
      return;
    }

    // Command History Navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  const lineColor = (type) => {
    if (type === 'input') return 'text-[var(--accent)] font-semibold';
    if (type === 'system') return 'text-emerald-400 font-mono';
    if (type === 'success') return 'text-yellow-400 font-bold';
    if (type === 'error') return 'text-rose-400 font-mono';
    return 'text-zinc-300';
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-mode"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[99997] bg-[#0a0a0a] flex flex-col font-mono text-xs sm:text-sm select-none overscroll-contain"
            onClick={() => !snakeActive && inputRef.current?.focus()}
          >
            {/* Matrix Rain Canvas Overlay */}
            {matrixActive && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-20 pointer-events-auto cursor-pointer"
                onClick={() => setMatrixActive(false)}
              />
            )}

            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 select-none z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer flex items-center justify-center text-[9px] text-red-950 font-bold"
                  title="Exit Terminal (Type 'exit' or ESC)"
                >
                  ✕
                </button>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 opacity-80" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 opacity-80" />
                <span className="text-zinc-400 text-xs ml-2 hidden sm:inline">
                  visitor@viraj.dev · workstation v3.0
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="hidden md:inline px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  dir: {cwd}
                </span>
                <span className="text-zinc-400">Type &quot;exit&quot; or press ESC to close</span>
              </div>
            </div>

            {/* Snake Game Mode Active View */}
            {snakeActive ? (
              <TerminalSnakeGame onExit={handleSnakeExit} />
            ) : (
              <>
                {/* Terminal Output Buffer */}
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 custom-scrollbar overscroll-contain z-10"
                >
                  {lines.map((line, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed whitespace-pre-wrap select-text ${lineColor(line.type)}`}
                    >
                      {line.text}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Interactive Command Input Line */}
                <form
                  onSubmit={onSubmit}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 z-10"
                >
                  <span className="text-emerald-400 shrink-0 font-bold select-none">{PROMPT}</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent text-zinc-100 outline-none caret-[var(--accent)] placeholder-zinc-700 text-xs sm:text-sm font-mono"
                    placeholder="type command (try 'snake', 'help', or 'exit')..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
                    TAB: auto · exit: close
                  </span>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
