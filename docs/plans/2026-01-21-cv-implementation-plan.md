# CV Website Terminal Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a terminal-themed personal CV website with typing animations, scroll-triggered effects, and a cyan-on-dark aesthetic.

**Architecture:** Single-page static site using vanilla HTML/CSS/JS. No build step required - deploys directly to GitHub Pages. CSS custom properties for theming, Intersection Observer for scroll animations, custom typing effect implementation.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), Vanilla JavaScript (ES6+), GitHub Pages hosting

---

## Task 1: Project Setup & Base HTML Structure

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/main.js`

**Step 1: Create base HTML with semantic structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Ming Ting - IT Infrastructure Professional based in Hong Kong">
    <title>Ming Ting | IT Professional</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <main>
        <section id="hero" class="section section--hero"></section>
        <section id="about" class="section section--about"></section>
        <section id="experience" class="section section--experience"></section>
        <section id="skills" class="section section--skills"></section>
        <section id="certifications" class="section section--certifications"></section>
        <section id="contact" class="section section--contact"></section>
    </main>
    <footer class="footer"></footer>
    <script src="js/main.js"></script>
</body>
</html>
```

**Step 2: Create CSS file with custom properties and reset**

```css
/* css/style.css */
:root {
    --color-bg: #0a0a0f;
    --color-bg-light: #12121a;
    --color-primary: #00d4ff;
    --color-text: #e0e0e0;
    --color-text-muted: #6b7280;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --font-mono: 'JetBrains Mono', monospace;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-mono);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    overflow-x: hidden;
}

.section {
    min-height: 100vh;
    padding: 4rem 2rem;
    position: relative;
}

@media (max-width: 768px) {
    .section {
        padding: 2rem 1rem;
    }
}
```

**Step 3: Create empty JS file with structure**

```javascript
// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('CV site initialized');
});
```

**Step 4: Test in browser**

Open `index.html` in browser. Expected: Dark background, empty page, console shows "CV site initialized".

**Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: initial project setup with base structure"
```

---

## Task 2: Typing Effect Utility

**Files:**
- Modify: `js/main.js`

**Step 1: Implement typing effect class**

```javascript
// js/main.js
class TypeWriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        return new Promise((resolve) => {
            const typeChar = () => {
                if (this.index < this.text.length) {
                    this.element.textContent += this.text.charAt(this.index);
                    this.index++;
                    setTimeout(typeChar, this.speed);
                } else {
                    resolve();
                }
            };
            typeChar();
        });
    }
}

// Utility to create blinking cursor
function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    element.appendChild(cursor);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('CV site initialized');
});
```

**Step 2: Add cursor CSS animation**

Add to `css/style.css`:

```css
/* Cursor blink animation */
.cursor {
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

/* Typed text container */
.typed-text {
    display: inline;
}
```

**Step 3: Test typing effect manually in console**

Open browser console and run:
```javascript
const test = document.createElement('div');
document.body.appendChild(test);
const tw = new TypeWriter(test, '$ hello world', 50);
tw.type().then(() => addCursor(test));
```

Expected: Text types out character by character, cursor blinks at end.

**Step 4: Commit**

```bash
git add js/main.js css/style.css
git commit -m "feat: add typing effect utility class"
```

---

## Task 3: Hero Section - Boot Sequence

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

**Step 1: Add hero HTML structure**

Replace the hero section in `index.html`:

```html
<section id="hero" class="section section--hero">
    <div class="hero__terminal">
        <div class="terminal__line" id="line-ssh"></div>
        <div class="terminal__line" id="line-connecting"></div>
        <div class="terminal__line" id="line-auth"></div>
        <div class="terminal__line" id="line-neofetch"></div>
    </div>
    <div class="hero__ascii" id="ascii-art"></div>
    <div class="hero__status">
        <span class="status__prompt">$ current --status</span>
        <div class="status__role" id="role-text"></div>
    </div>
    <div class="hero__scroll">
        <span>scroll to continue</span>
        <div class="scroll__arrow">↓</div>
    </div>
    <canvas id="network-bg" class="hero__canvas"></canvas>
</section>
```

**Step 2: Add hero CSS**

Add to `css/style.css`:

```css
/* Hero Section */
.section--hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
}

.hero__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.3;
}

.hero__terminal,
.hero__ascii,
.hero__status,
.hero__scroll {
    position: relative;
    z-index: 1;
}

.hero__terminal {
    text-align: left;
    margin-bottom: 2rem;
}

.terminal__line {
    margin: 0.25rem 0;
    min-height: 1.5rem;
}

.hero__ascii {
    margin: 2rem 0;
    text-align: left;
    font-size: 0.75rem;
    line-height: 1.2;
    color: var(--color-primary);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.hero__ascii.visible {
    opacity: 1;
}

.hero__ascii pre {
    margin: 0;
}

.hero__ascii .ascii__info {
    color: var(--color-text);
}

.hero__ascii .ascii__label {
    color: var(--color-text-muted);
}

.hero__status {
    margin-top: 2rem;
    text-align: center;
}

.status__prompt {
    color: var(--color-text-muted);
    display: block;
    margin-bottom: 0.5rem;
}

.status__role {
    font-size: 1.25rem;
    color: var(--color-primary);
    min-height: 2rem;
}

.hero__scroll {
    position: absolute;
    bottom: 2rem;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.875rem;
}

.scroll__arrow {
    margin-top: 0.5rem;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

/* Glitch effect */
.glitch {
    animation: glitch 0.3s ease;
}

@keyframes glitch {
    0% { text-shadow: 2px 0 #ff0000, -2px 0 #00ff00; }
    25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ff00; }
    50% { text-shadow: 2px 2px #ff0000, -2px -2px #00ff00; }
    75% { text-shadow: -2px 2px #ff0000, 2px -2px #00ff00; }
    100% { text-shadow: none; }
}

@media (max-width: 768px) {
    .hero__ascii {
        font-size: 0.5rem;
    }

    .status__role {
        font-size: 1rem;
    }
}
```

**Step 3: Add hero boot sequence JavaScript**

Add to `js/main.js` before the DOMContentLoaded event:

```javascript
// ASCII Art
const ASCII_ART = `    __  _______
   /  |/  /_  __/    <span class="ascii__info">MING TING</span>
  / /|_/ / / /       <span class="ascii__label">─────────────</span>
 / /  / / / /        <span class="ascii__label">Role:</span> <span class="ascii__info">IT Infrastructure</span>
/_/  /_/ /_/         <span class="ascii__label">Location:</span> <span class="ascii__info">Hong Kong</span>
                     <span class="ascii__label">Certs:</span> <span class="ascii__info">VMware × NetApp × Cloud</span>
                     <span class="ascii__label">Status:</span> <span class="ascii__info" style="color: var(--color-success);">Available</span>`;

const ROLES = [
    'System Specialist',
    'Solutions Consultant',
    'Infrastructure Expert'
];

async function runHeroSequence() {
    const lines = [
        { id: 'line-ssh', text: '$ ssh ming@hongkong.cloud', delay: 500 },
        { id: 'line-connecting', text: 'Connecting...', delay: 800 },
        { id: 'line-auth', text: 'Authentication successful.', delay: 400 },
        { id: 'line-neofetch', text: '$ neofetch', delay: 600 }
    ];

    for (const line of lines) {
        const element = document.getElementById(line.id);
        const typewriter = new TypeWriter(element, line.text, 30);
        await typewriter.type();
        await sleep(line.delay);
    }

    // Show ASCII art with glitch effect
    const asciiEl = document.getElementById('ascii-art');
    asciiEl.innerHTML = `<pre>${ASCII_ART}</pre>`;
    asciiEl.classList.add('visible', 'glitch');
    setTimeout(() => asciiEl.classList.remove('glitch'), 300);

    // Start role cycling
    await sleep(500);
    cycleRoles();
}

let currentRoleIndex = 0;
async function cycleRoles() {
    const roleEl = document.getElementById('role-text');

    while (true) {
        roleEl.textContent = '';
        const role = ROLES[currentRoleIndex];
        const typewriter = new TypeWriter(roleEl, `> ${role}`, 50);
        await typewriter.type();
        addCursor(roleEl);

        await sleep(2500);

        const cursor = roleEl.querySelector('.cursor');
        if (cursor) cursor.remove();

        currentRoleIndex = (currentRoleIndex + 1) % ROLES.length;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Step 4: Initialize hero on page load**

Update the DOMContentLoaded event:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    runHeroSequence();
});
```

**Step 5: Test hero section**

Open in browser. Expected: Boot sequence types out, ASCII art appears with glitch, roles cycle with typing effect.

**Step 6: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add hero section with boot sequence and typing effects"
```

---

## Task 4: Network Background Animation

**Files:**
- Modify: `js/main.js`

**Step 1: Implement particle network canvas**

Add to `js/main.js`:

```javascript
// Network background animation
class NetworkBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.maxDistance = 150;
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    const opacity = 1 - (dist / this.maxDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}
```

**Step 2: Initialize network background**

Update DOMContentLoaded:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize network background
    const canvas = document.getElementById('network-bg');
    if (canvas) {
        const network = new NetworkBackground(canvas);
        network.animate();
    }

    runHeroSequence();
});
```

**Step 3: Test network animation**

Open in browser. Expected: Floating connected dots animate behind hero content.

**Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: add network particle background animation"
```

---

## Task 5: Scroll-Triggered Section Animations

**Files:**
- Modify: `js/main.js`
- Modify: `css/style.css`

**Step 1: Add Intersection Observer for sections**

Add to `js/main.js`:

```javascript
// Scroll-triggered animations
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.2 }
        );
    }

    observe(elements) {
        elements.forEach(el => this.observer.observe(el));
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                this.animateSection(entry.target);
            }
        });
    }

    async animateSection(section) {
        const command = section.querySelector('.section__command');
        if (command) {
            const text = command.dataset.command;
            command.textContent = '';
            const typewriter = new TypeWriter(command, text, 40);
            await typewriter.type();
            addCursor(command);
        }

        // Reveal content after command types
        const content = section.querySelector('.section__content');
        if (content) {
            await sleep(300);
            content.classList.add('visible');
        }
    }
}
```

**Step 2: Add section animation CSS**

Add to `css/style.css`:

```css
/* Section animations */
.section__command {
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
    font-size: 1rem;
}

.section__content {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.section__content.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Container styling */
.container {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}
```

**Step 3: Initialize scroll animator**

Update DOMContentLoaded:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize network background
    const canvas = document.getElementById('network-bg');
    if (canvas) {
        const network = new NetworkBackground(canvas);
        network.animate();
    }

    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();
    const sections = document.querySelectorAll('.section:not(.section--hero)');
    scrollAnimator.observe(sections);

    runHeroSequence();
});
```

**Step 4: Test scroll observer**

Add a test section with command, verify typing triggers on scroll.

**Step 5: Commit**

```bash
git add js/main.js css/style.css
git commit -m "feat: add scroll-triggered section animations"
```

---

## Task 6: About Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add About HTML**

Replace the about section in `index.html`:

```html
<section id="about" class="section section--about">
    <div class="container">
        <div class="section__command" data-command="$ cat about.md"></div>
        <div class="section__content">
            <div class="terminal-window">
                <div class="terminal-window__header">
                    <span class="terminal-window__dot terminal-window__dot--red"></span>
                    <span class="terminal-window__dot terminal-window__dot--yellow"></span>
                    <span class="terminal-window__dot terminal-window__dot--green"></span>
                </div>
                <div class="terminal-window__body">
                    <p><span class="prompt">&gt;</span> Hong Kong-based IT professional with <span class="highlight">7+ years</span> building and managing <span class="highlight">enterprise infrastructure</span>.</p>
                    <p><span class="prompt">&gt;</span> Started at PolyU, now architecting systems at the <span class="highlight">University of Hong Kong</span>.</p>
                    <p><span class="prompt">&gt;</span> I make complex systems <span class="highlight">reliable</span>.</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Add terminal window CSS**

Add to `css/style.css`:

```css
/* Terminal window component */
.terminal-window {
    background: var(--color-bg-light);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
}

.terminal-window__header {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.75rem 1rem;
    display: flex;
    gap: 0.5rem;
}

.terminal-window__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.terminal-window__dot--red { background: #ff5f56; }
.terminal-window__dot--yellow { background: #ffbd2e; }
.terminal-window__dot--green { background: #27ca40; }

.terminal-window__body {
    padding: 1.5rem;
}

.terminal-window__body p {
    margin-bottom: 1rem;
}

.terminal-window__body p:last-child {
    margin-bottom: 0;
}

.prompt {
    color: var(--color-text-muted);
    margin-right: 0.5rem;
}

.highlight {
    color: var(--color-primary);
}

/* About section specifics */
.section--about {
    display: flex;
    align-items: center;
    min-height: 60vh;
}
```

**Step 3: Test About section**

Scroll to About section. Expected: Command types, then terminal window fades in with content.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add about section with terminal window styling"
```

---

## Task 7: Experience Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

**Step 1: Add Experience HTML**

Replace the experience section in `index.html`:

```html
<section id="experience" class="section section--experience">
    <div class="container">
        <div class="section__command" data-command="$ history --career"></div>
        <div class="section__content">
            <div class="history">
                <div class="history__item" data-expanded="true">
                    <div class="history__header">
                        <span class="history__number">127</span>
                        <span class="history__date">2024-present</span>
                        <span class="history__company">University of Hong Kong</span>
                    </div>
                    <div class="history__details">
                        <div class="history__expand">
                            <span class="history__branch">└─</span>
                            <span class="history__cat">$ cat job.log</span>
                        </div>
                        <div class="history__content">
                            <div class="history__role">Role: System Specialist</div>
                            <ul class="history__tasks">
                                <li><span class="arrow">→</span> Managed VMware infrastructure across campus</li>
                                <li><span class="arrow">→</span> Deployed OpenShift container platform</li>
                                <li><span class="arrow">→</span> Implemented automated failover systems</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="history__item">
                    <div class="history__header">
                        <span class="history__number">126</span>
                        <span class="history__date">2022-2024</span>
                        <span class="history__company">Tech Consulting Firm</span>
                    </div>
                    <div class="history__details">
                        <div class="history__expand">
                            <span class="history__branch">└─</span>
                            <span class="history__cat">$ cat job.log</span>
                        </div>
                        <div class="history__content">
                            <div class="history__role">Role: Solutions Consultant</div>
                            <ul class="history__tasks">
                                <li><span class="arrow">→</span> Designed infrastructure solutions for enterprise clients</li>
                                <li><span class="arrow">→</span> Led cloud migration projects</li>
                                <li><span class="arrow">→</span> Provided technical consultation</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="history__item">
                    <div class="history__header">
                        <span class="history__number">125</span>
                        <span class="history__date">2020-2022</span>
                        <span class="history__company">Development Company</span>
                    </div>
                    <div class="history__details">
                        <div class="history__expand">
                            <span class="history__branch">└─</span>
                            <span class="history__cat">$ cat job.log</span>
                        </div>
                        <div class="history__content">
                            <div class="history__role">Role: Infrastructure Engineer</div>
                            <ul class="history__tasks">
                                <li><span class="arrow">→</span> Managed on-premise server infrastructure</li>
                                <li><span class="arrow">→</span> Implemented backup and disaster recovery</li>
                                <li><span class="arrow">→</span> Automated deployment pipelines</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="history__item">
                    <div class="history__header">
                        <span class="history__number">124</span>
                        <span class="history__date">2017-2020</span>
                        <span class="history__company">Startup</span>
                    </div>
                    <div class="history__details">
                        <div class="history__expand">
                            <span class="history__branch">└─</span>
                            <span class="history__cat">$ cat job.log</span>
                        </div>
                        <div class="history__content">
                            <div class="history__role">Role: Junior System Administrator</div>
                            <ul class="history__tasks">
                                <li><span class="arrow">→</span> Maintained Linux servers</li>
                                <li><span class="arrow">→</span> Managed network infrastructure</li>
                                <li><span class="arrow">→</span> Provided technical support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Add Experience CSS**

Add to `css/style.css`:

```css
/* Experience section */
.history__item {
    margin-bottom: 0.5rem;
    cursor: pointer;
}

.history__header {
    display: flex;
    gap: 1.5rem;
    padding: 0.75rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.history__header:hover {
    background: rgba(0, 212, 255, 0.05);
}

.history__number {
    color: var(--color-text-muted);
    min-width: 3ch;
}

.history__date {
    color: var(--color-primary);
    min-width: 12ch;
}

.history__company {
    color: var(--color-text);
    font-weight: 500;
}

.history__details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding-left: 4.5ch;
}

.history__item[data-expanded="true"] .history__details {
    max-height: 300px;
}

.history__expand {
    padding: 0.5rem 0;
    color: var(--color-text-muted);
}

.history__branch {
    margin-right: 0.5rem;
}

.history__cat {
    color: var(--color-text-muted);
}

.history__content {
    padding: 0.5rem 0 1rem 2rem;
}

.history__role {
    color: var(--color-text);
    margin-bottom: 0.75rem;
}

.history__tasks {
    list-style: none;
}

.history__tasks li {
    margin-bottom: 0.5rem;
    color: var(--color-text-muted);
}

.arrow {
    color: var(--color-primary);
    margin-right: 0.5rem;
}

@media (max-width: 768px) {
    .history__header {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .history__date {
        min-width: auto;
    }
}
```

**Step 3: Add expand/collapse JavaScript**

Add to `js/main.js`:

```javascript
// Experience section expand/collapse
function initExperienceSection() {
    const items = document.querySelectorAll('.history__item');

    items.forEach(item => {
        const header = item.querySelector('.history__header');
        header.addEventListener('click', () => {
            const isExpanded = item.dataset.expanded === 'true';

            // Collapse all
            items.forEach(i => i.dataset.expanded = 'false');

            // Expand clicked if it was collapsed
            if (!isExpanded) {
                item.dataset.expanded = 'true';
            }
        });
    });
}
```

**Step 4: Initialize in DOMContentLoaded**

Add to DOMContentLoaded:

```javascript
initExperienceSection();
```

**Step 5: Test experience section**

Scroll to Experience, click items to expand/collapse. Expected: Smooth animations, only one expanded at a time.

**Step 6: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add experience section with expandable history items"
```

---

## Task 8: Skills Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add Skills HTML**

Replace the skills section in `index.html`:

```html
<section id="skills" class="section section--skills">
    <div class="container">
        <div class="section__command" data-command="$ ls -la ./skills/"></div>
        <div class="section__content">
            <div class="skills__summary">
                <span class="skills__wc">$ wc -l ./skills/*</span>
                <span class="skills__count"><span class="highlight">14</span> technologies</span>
                <span class="skills__count"><span class="highlight">4</span> categories</span>
                <span class="skills__count"><span class="highlight">3</span> languages</span>
            </div>
            <div class="skills__tree">
                <div class="skill-group">
                    <div class="skill-group__header">
                        <span class="skill-group__perm">drwxr-xr-x</span>
                        <span class="skill-group__name">Infrastructure/</span>
                    </div>
                    <ul class="skill-group__items">
                        <li><span class="tree-branch">├──</span> VMware vSphere</li>
                        <li><span class="tree-branch">├──</span> NetApp Storage</li>
                        <li><span class="tree-branch">├──</span> Windows Server</li>
                        <li><span class="tree-branch">└──</span> Linux Administration</li>
                    </ul>
                </div>
                <div class="skill-group">
                    <div class="skill-group__header">
                        <span class="skill-group__perm">drwxr-xr-x</span>
                        <span class="skill-group__name">Cloud & DevOps/</span>
                    </div>
                    <ul class="skill-group__items">
                        <li><span class="tree-branch">├──</span> OpenShift</li>
                        <li><span class="tree-branch">├──</span> Docker</li>
                        <li><span class="tree-branch">├──</span> Kubernetes</li>
                        <li><span class="tree-branch">└──</span> CI/CD Pipelines</li>
                    </ul>
                </div>
                <div class="skill-group">
                    <div class="skill-group__header">
                        <span class="skill-group__perm">drwxr-xr-x</span>
                        <span class="skill-group__name">Development/</span>
                    </div>
                    <ul class="skill-group__items">
                        <li><span class="tree-branch">├──</span> PHP</li>
                        <li><span class="tree-branch">├──</span> JavaScript</li>
                        <li><span class="tree-branch">└──</span> Python</li>
                    </ul>
                </div>
                <div class="skill-group">
                    <div class="skill-group__header">
                        <span class="skill-group__perm">drwxr-xr-x</span>
                        <span class="skill-group__name">Languages/</span>
                    </div>
                    <ul class="skill-group__items">
                        <li><span class="tree-branch">├──</span> Cantonese <span class="skill-note">(native)</span></li>
                        <li><span class="tree-branch">├──</span> English <span class="skill-note">(fluent)</span></li>
                        <li><span class="tree-branch">└──</span> Mandarin <span class="skill-note">(fluent)</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Add Skills CSS**

Add to `css/style.css`:

```css
/* Skills section */
.skills__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.skills__wc {
    color: var(--color-text-muted);
    width: 100%;
    margin-bottom: 0.5rem;
}

.skills__count {
    color: var(--color-text-muted);
}

.skills__tree {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.skill-group {
    margin-bottom: 1rem;
}

.skill-group__header {
    margin-bottom: 0.75rem;
}

.skill-group__perm {
    color: var(--color-text-muted);
    margin-right: 1rem;
    font-size: 0.875rem;
}

.skill-group__name {
    color: var(--color-primary);
    font-weight: 500;
}

.skill-group__items {
    list-style: none;
    padding-left: 1rem;
}

.skill-group__items li {
    padding: 0.25rem 0;
    transition: color 0.2s ease;
}

.skill-group__items li:hover {
    color: var(--color-primary);
}

.tree-branch {
    color: var(--color-text-muted);
    margin-right: 0.5rem;
}

.skill-note {
    color: var(--color-text-muted);
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .skill-group__perm {
        display: none;
    }
}
```

**Step 3: Test skills section**

Scroll to Skills. Expected: Directory tree layout with hover effects.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add skills section with directory tree layout"
```

---

## Task 9: Certifications Section

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

**Step 1: Add Certifications HTML**

Replace the certifications section in `index.html`:

```html
<section id="certifications" class="section section--certifications">
    <div class="container">
        <div class="section__command" data-command="$ gpg --verify credentials.sig"></div>
        <div class="section__content">
            <div class="certs-grid">
                <div class="cert-card" data-status="valid">
                    <div class="cert-card__status">
                        <span class="cert-card__check">⠋</span>
                        <span class="cert-card__label">CHECKING...</span>
                    </div>
                    <div class="cert-card__name">VMware VCP-DCV 2024</div>
                    <div class="cert-card__desc">Datacenter Virtualization</div>
                    <div class="cert-card__expires">Expires: 2026</div>
                </div>
                <div class="cert-card" data-status="valid">
                    <div class="cert-card__status">
                        <span class="cert-card__check">⠋</span>
                        <span class="cert-card__label">CHECKING...</span>
                    </div>
                    <div class="cert-card__name">NetApp NCDA</div>
                    <div class="cert-card__desc">Data Administrator</div>
                    <div class="cert-card__expires">Expires: 2025</div>
                </div>
                <div class="cert-card" data-status="valid">
                    <div class="cert-card__status">
                        <span class="cert-card__check">⠋</span>
                        <span class="cert-card__label">CHECKING...</span>
                    </div>
                    <div class="cert-card__name">AWS Solutions Architect</div>
                    <div class="cert-card__desc">Associate Level</div>
                    <div class="cert-card__expires">Expires: 2025</div>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Step 2: Add Certifications CSS**

Add to `css/style.css`:

```css
/* Certifications section */
.certs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.cert-card {
    background: var(--color-bg-light);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    transition: border-color 0.3s ease;
}

.cert-card:hover {
    border-color: var(--color-primary);
}

.cert-card__status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.cert-card__check {
    font-size: 1.25rem;
}

.cert-card__label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
}

.cert-card[data-verified="true"] .cert-card__check {
    color: var(--color-success);
}

.cert-card[data-verified="true"] .cert-card__label {
    color: var(--color-success);
}

.cert-card__name {
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.cert-card__desc {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.cert-card__expires {
    color: var(--color-text-muted);
    font-size: 0.75rem;
}

/* Loading spinner animation */
@keyframes spin {
    0% { content: '⠋'; }
    10% { content: '⠙'; }
    20% { content: '⠹'; }
    30% { content: '⠸'; }
    40% { content: '⠼'; }
    50% { content: '⠴'; }
    60% { content: '⠦'; }
    70% { content: '⠧'; }
    80% { content: '⠇'; }
    90% { content: '⠏'; }
}

.cert-card:not([data-verified="true"]) .cert-card__check {
    animation: spin 0.8s linear infinite;
}
```

**Step 3: Add verification animation JavaScript**

Add to `js/main.js`:

```javascript
// Certification verification animation
function verifyCertifications() {
    const cards = document.querySelectorAll('.cert-card');

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.dataset.verified = 'true';
            const check = card.querySelector('.cert-card__check');
            const label = card.querySelector('.cert-card__label');
            check.textContent = '✓';
            label.textContent = 'VERIFIED';
        }, 300 + (index * 400));
    });
}
```

**Step 4: Integrate with scroll animator**

Modify the `animateSection` method in `ScrollAnimator` class:

```javascript
async animateSection(section) {
    const command = section.querySelector('.section__command');
    if (command) {
        const text = command.dataset.command;
        command.textContent = '';
        const typewriter = new TypeWriter(command, text, 40);
        await typewriter.type();
        addCursor(command);
    }

    // Reveal content after command types
    const content = section.querySelector('.section__content');
    if (content) {
        await sleep(300);
        content.classList.add('visible');
    }

    // Trigger certification verification if this is cert section
    if (section.classList.contains('section--certifications')) {
        await sleep(500);
        verifyCertifications();
    }
}
```

**Step 5: Test certifications section**

Scroll to Certifications. Expected: Cards show checking animation, then verify one by one.

**Step 6: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add certifications section with verification animation"
```

---

## Task 10: Contact Section & Footer

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Step 1: Add Contact HTML**

Replace the contact section and footer in `index.html`:

```html
<section id="contact" class="section section--contact">
    <div class="container">
        <div class="section__command" data-command="$ ping ming --connect"></div>
        <div class="section__content">
            <div class="contact-terminal">
                <div class="contact__header">PING ming@hongkong.cloud</div>
                <div class="contact__divider">--- connection options ---</div>
                <div class="contact__links">
                    <a href="mailto:crayonluffy@gmail.com" class="contact__link">
                        <span class="contact__icon">✉</span>
                        <span class="contact__text">crayonluffy@gmail.com</span>
                        <span class="contact__badge">[OPEN]</span>
                    </a>
                    <a href="https://github.com/crayonluffy" target="_blank" rel="noopener" class="contact__link">
                        <span class="contact__icon">⌘</span>
                        <span class="contact__text">github.com/crayonluffy</span>
                        <span class="contact__badge">[OPEN]</span>
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener" class="contact__link">
                        <span class="contact__icon">◎</span>
                        <span class="contact__text">LinkedIn</span>
                        <span class="contact__badge">[OPEN]</span>
                    </a>
                    <div class="contact__link contact__link--static">
                        <span class="contact__icon">📍</span>
                        <span class="contact__text">Hong Kong SAR</span>
                    </div>
                </div>
                <div class="contact__divider">--- establishing connection ---</div>
                <div class="contact__loader">
                    <div class="loader__bar"></div>
                    <span class="loader__text">Waiting for your message...</span>
                </div>
            </div>

            <div class="education">
                <div class="education__command">$ cat education.txt</div>
                <div class="education__content">
                    <p>BSc Computing, Hong Kong Polytechnic University</p>
                    <p>Higher Diploma, Hong Kong Polytechnic University</p>
                </div>
            </div>
        </div>
    </div>
</section>

<footer class="footer">
    <div class="container">
        <p>© 2024 Ming Ting | Built with caffeine and curiosity</p>
    </div>
</footer>
```

**Step 2: Add Contact & Footer CSS**

Add to `css/style.css`:

```css
/* Contact section */
.section--contact {
    min-height: 80vh;
}

.contact-terminal {
    background: var(--color-bg-light);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 3rem;
}

.contact__header {
    color: var(--color-text);
    font-weight: 500;
    margin-bottom: 1.5rem;
}

.contact__divider {
    color: var(--color-text-muted);
    margin: 1.5rem 0;
}

.contact__links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.contact__link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    text-decoration: none;
    color: var(--color-text);
    transition: background-color 0.2s ease;
}

.contact__link:hover {
    background: rgba(0, 212, 255, 0.1);
}

.contact__link--static {
    cursor: default;
}

.contact__link--static:hover {
    background: transparent;
}

.contact__icon {
    font-size: 1.25rem;
    width: 2rem;
    text-align: center;
}

.contact__text {
    flex: 1;
}

.contact__badge {
    color: var(--color-primary);
    font-size: 0.875rem;
}

.contact__loader {
    margin-top: 1rem;
}

.loader__bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.loader__bar::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 63%;
    background: var(--color-primary);
    animation: load 2s ease-in-out infinite;
}

@keyframes load {
    0%, 100% { width: 50%; }
    50% { width: 75%; }
}

.loader__text {
    color: var(--color-text-muted);
    font-size: 0.875rem;
}

/* Education */
.education {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 2rem;
}

.education__command {
    color: var(--color-text-muted);
    margin-bottom: 1rem;
}

.education__content {
    color: var(--color-text-muted);
    font-size: 0.875rem;
}

.education__content p {
    margin-bottom: 0.25rem;
}

/* Footer */
.footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    text-align: center;
}

.footer p {
    color: var(--color-text-muted);
    font-size: 0.875rem;
}
```

**Step 3: Test contact section**

Scroll to Contact. Expected: Terminal-styled contact info, animated loader bar, muted education section.

**Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add contact section with loader and education footnote"
```

---

## Task 11: Mobile Responsiveness & Polish

**Files:**
- Modify: `css/style.css`

**Step 1: Add comprehensive mobile styles**

Add to `css/style.css`:

```css
/* Mobile responsiveness */
@media (max-width: 768px) {
    html {
        font-size: 14px;
    }

    .section {
        padding: 3rem 1rem;
        min-height: auto;
    }

    .section--hero {
        min-height: 100vh;
        padding: 2rem 1rem;
    }

    .hero__ascii {
        font-size: 0.45rem;
        overflow-x: auto;
    }

    .terminal-window__body {
        padding: 1rem;
    }

    .history__header {
        flex-direction: column;
        gap: 0.25rem;
    }

    .history__number {
        display: none;
    }

    .history__content {
        padding-left: 1rem;
    }

    .skills__tree {
        grid-template-columns: 1fr;
    }

    .certs-grid {
        grid-template-columns: 1fr;
    }

    .contact-terminal {
        padding: 1.5rem 1rem;
    }

    .contact__link {
        flex-wrap: wrap;
    }

    .contact__badge {
        width: 100%;
        text-align: left;
        padding-left: 3rem;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    html {
        scroll-behavior: auto;
    }
}

/* Focus states for accessibility */
a:focus,
button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Selection styling */
::selection {
    background: var(--color-primary);
    color: var(--color-bg);
}
```

**Step 2: Test on mobile viewport**

Use browser dev tools to test at 375px width. Expected: All sections readable, no horizontal scroll, touch-friendly tap targets.

**Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add mobile responsiveness and accessibility improvements"
```

---

## Task 12: Final Integration & Testing

**Files:**
- Review all files

**Step 1: Verify all sections work together**

Open `index.html` in browser and test:
- [ ] Hero boot sequence completes
- [ ] Network background animates
- [ ] Role text cycles
- [ ] Scroll triggers section commands
- [ ] About section terminal window displays
- [ ] Experience items expand/collapse
- [ ] Skills tree displays correctly
- [ ] Certifications verify sequentially
- [ ] Contact links are clickable
- [ ] Footer displays

**Step 2: Test on mobile viewport**

- [ ] No horizontal scroll
- [ ] Touch interactions work
- [ ] Text is readable
- [ ] Animations don't cause jank

**Step 3: Update content with real data**

Replace placeholder content in `index.html` with actual:
- Real job descriptions from current CV
- Actual certification details
- Correct LinkedIn URL

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete CV website with terminal theme"
```

---

## Task 13: GitHub Pages Deployment

**Files:**
- No file changes, deployment steps

**Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/crayonluffy/crayonluffy.github.io.git
git branch -M main
git push -u origin main
```

**Step 2: Verify deployment**

Visit https://crayonluffy.github.io/ - site should be live within minutes.

**Step 3: Test live site**

- [ ] All animations work
- [ ] Links open correctly
- [ ] Mobile works

---

## Notes

- All content in Task 7 (Experience) uses placeholder data - update with real job info from original site
- LinkedIn URL in Contact needs to be updated with actual profile
- Certifications may need updating based on current/actual certs
- Consider adding favicon and meta tags for social sharing later
