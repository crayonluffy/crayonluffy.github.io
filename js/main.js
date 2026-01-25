// js/main.js
class TypeWriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.skipped = false;
    }

    type() {
        return new Promise((resolve) => {
            const typeChar = () => {
                if (this.skipped) {
                    this.element.textContent = this.text;
                    resolve();
                    return;
                }
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

    skip() {
        this.skipped = true;
    }
}

// Utility to create blinking cursor
function addCursor(element) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    element.appendChild(cursor);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ASCII Art - Name is now separate and prominent
const ASCII_LOGO = `    __  _______
   /  |/  /_  __/
  / /|_/ / / /
 / /  / / / /
/_/  /_/ /_/`;

const ROLES = [
    'Systems Specialist',
    'Solutions Consultant',
    'DevOps Enthusiast'
];

let heroSkipped = false;
let activeTypewriters = [];

function skipHeroAnimation() {
    if (heroSkipped) return;
    heroSkipped = true;

    // Skip all active typewriters
    activeTypewriters.forEach(tw => tw.skip());

    // Immediately show all content
    const lines = [
        { id: 'line-ssh', text: '$ ssh ming@hongkong.cloud' },
        { id: 'line-connecting', text: 'Connecting...' },
        { id: 'line-auth', text: 'Authentication successful.' },
        { id: 'line-neofetch', text: '$ neofetch' }
    ];

    lines.forEach(line => {
        const el = document.getElementById(line.id);
        if (el) el.textContent = line.text;
    });

    // Show ASCII and info
    const asciiEl = document.getElementById('ascii-art');
    const logoEl = document.getElementById('ascii-logo');
    const infoEl = document.getElementById('ascii-info');

    if (logoEl) logoEl.textContent = ASCII_LOGO;
    if (asciiEl) asciiEl.classList.add('visible');

    // Remove skip hint
    const skipHint = document.querySelector('.hero__skip');
    if (skipHint) skipHint.style.display = 'none';
}

async function runHeroSequence() {
    // Add click-to-skip listener
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('click', skipHeroAnimation, { once: true });

    const lines = [
        { id: 'line-ssh', text: '$ ssh ming@hongkong.cloud', delay: 100 },
        { id: 'line-connecting', text: 'Connecting...', delay: 150 },
        { id: 'line-auth', text: 'Authentication successful.', delay: 100 },
        { id: 'line-neofetch', text: '$ neofetch', delay: 150 }
    ];

    for (const line of lines) {
        if (heroSkipped) break;
        const element = document.getElementById(line.id);
        const typewriter = new TypeWriter(element, line.text, 10); // Fast: 10ms
        activeTypewriters.push(typewriter);
        await typewriter.type();
        if (!heroSkipped) await sleep(line.delay);
    }

    if (!heroSkipped) {
        // Show ASCII art with glitch effect
        const asciiEl = document.getElementById('ascii-art');
        const logoEl = document.getElementById('ascii-logo');
        logoEl.textContent = ASCII_LOGO;
        asciiEl.classList.add('visible', 'glitch');
        setTimeout(() => asciiEl.classList.remove('glitch'), 300);
    }

    // Remove skip hint after animation completes
    const skipHint = document.querySelector('.hero__skip');
    if (skipHint) skipHint.style.display = 'none';

    // Start role cycling
    await sleep(300);
    cycleRoles();
}

let currentRoleIndex = 0;
async function cycleRoles() {
    const roleEl = document.getElementById('role-text');

    while (true) {
        roleEl.textContent = '';
        const role = ROLES[currentRoleIndex];
        const typewriter = new TypeWriter(roleEl, `> ${role}`, 20);
        await typewriter.type();
        addCursor(roleEl);

        await sleep(2500);

        const cursor = roleEl.querySelector('.cursor');
        if (cursor) cursor.remove();

        currentRoleIndex = (currentRoleIndex + 1) % ROLES.length;
    }
}

// Scroll-triggered animations
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.5, rootMargin: '-50px 0px' }
        );
        this.queue = [];
        this.isAnimating = false;
    }

    observe(elements) {
        elements.forEach(el => this.observer.observe(el));
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                this.queue.push(entry.target);
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.isAnimating || this.queue.length === 0) return;
        this.isAnimating = true;

        while (this.queue.length > 0) {
            const section = this.queue.shift();
            await this.animateSection(section);
            await sleep(200);
        }

        this.isAnimating = false;
    }

    async animateSection(section) {
        const command = section.querySelector('.section__command');
        if (command) {
            const text = command.dataset.command;
            command.textContent = '';
            const typewriter = new TypeWriter(command, text, 12);
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
}

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

// Experience section expand/collapse
function initExperienceSection() {
    const items = document.querySelectorAll('.history__item');

    items.forEach(item => {
        const header = item.querySelector('.history__header');
        header.addEventListener('click', () => {
            // Toggle individual item
            const isExpanded = item.dataset.expanded === 'true';
            item.dataset.expanded = isExpanded ? 'false' : 'true';
        });
    });
}

// Count-up animation for stats
function animateCountUp(element, target, duration = 800) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// Stats banner observer
function initStatsBanner() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const numbers = entry.target.querySelectorAll('.stat-item__number');
                numbers.forEach((num, index) => {
                    const target = parseInt(num.dataset.target, 10);
                    setTimeout(() => animateCountUp(num, target), index * 100);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Sticky navigation
function initStickyNav() {
    const nav = document.getElementById('sticky-nav');
    const hero = document.getElementById('hero');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sticky-nav__link');

    // Show/hide nav based on hero visibility
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                nav.classList.remove('sticky-nav--visible');
            } else {
                nav.classList.add('sticky-nav--visible');
            }
        });
    }, { threshold: 0.1 });

    heroObserver.observe(hero);

    // Track active section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('sticky-nav__link--active');
                    if (link.dataset.section === id) {
                        link.classList.add('sticky-nav__link--active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-50px 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Keyboard navigation
function initKeyboardNav() {
    const sectionMap = {
        'h': 'hero',
        '1': 'about',
        '2': 'experience',
        '3': 'skills',
        '4': 'certifications',
        '5': 'contact'
    };

    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toLowerCase();
        if (sectionMap[key]) {
            const target = document.getElementById(sectionMap[key]);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Flash effect on section
                const command = target.querySelector('.section__command');
                if (command) {
                    command.classList.add('nav-flash');
                    setTimeout(() => command.classList.remove('nav-flash'), 500);
                }
            }
        }
    });
}

// Parallax effects
function initParallax() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Disable on mobile
    if (window.innerWidth <= 768) return;

    const symbols = document.querySelectorAll('.parallax-symbol');
    const heroContent = document.querySelector('.hero__content');
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        // Floating symbols parallax
        symbols.forEach(symbol => {
            const speed = parseFloat(symbol.dataset.speed) || 1;
            const yOffset = scrollY * (speed - 1) * 0.5;
            symbol.style.transform = `translateY(${yOffset}px)`;
        });

        // Hero content parallax (slower scroll creates depth)
        if (heroContent && scrollY < window.innerHeight) {
            const heroOffset = scrollY * 0.3;
            heroContent.style.transform = `translateY(${heroOffset}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// Certification card tilt effect
function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth <= 768) return;

    const cards = document.querySelectorAll('.cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Holographic shimmer on name
function initHolographicShimmer() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const name = document.querySelector('.ascii__name');
    if (!name) return;

    // Trigger on hover
    name.addEventListener('mouseenter', () => {
        if (!name.classList.contains('shimmer')) {
            name.classList.add('shimmer');
            setTimeout(() => name.classList.remove('shimmer'), 800);
        }
    });

    // Auto-trigger every 10 seconds
    function autoShimmer() {
        if (!name.classList.contains('shimmer')) {
            name.classList.add('shimmer');
            setTimeout(() => name.classList.remove('shimmer'), 800);
        }
        setTimeout(autoShimmer, 10000);
    }

    // Start after hero animation completes
    setTimeout(autoShimmer, 8000);
}

// Neon flicker effect on terminal commands
function initNeonFlicker() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const commands = document.querySelectorAll('.section__command');

    function triggerFlicker() {
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        if (randomCommand && !randomCommand.classList.contains('neon-flicker')) {
            randomCommand.classList.add('neon-flicker');
            setTimeout(() => randomCommand.classList.remove('neon-flicker'), 150);
        }

        // Schedule next flicker (random 3-8 seconds)
        const nextFlicker = 3000 + Math.random() * 5000;
        setTimeout(triggerFlicker, nextFlicker);
    }

    // Start after initial animations complete
    setTimeout(triggerFlicker, 5000);
}

// Matrix rain effect
function initMatrixRain() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let isVisible = true;

    const chars = '01アイウエオカキクケコサシスセソ';
    const fontSize = 14;
    let columns;
    let drops;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / (fontSize * 3)); // Sparse columns
        drops = Array(columns).fill(1);
    }

    function draw() {
        if (!isVisible) return;

        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00d4ff';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize * 3; // Sparse spacing
            const y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        animationId = requestAnimationFrame(draw);
    }

    // Only run when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible = true;
                if (!animationId) draw();
            } else {
                isVisible = false;
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    const hero = document.getElementById('hero');
    if (hero) {
        heroObserver.observe(hero);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();
    const sections = document.querySelectorAll('.section:not(.section--hero)');
    scrollAnimator.observe(sections);

    // Initialize experience section
    initExperienceSection();

    // Initialize stats banner
    initStatsBanner();

    // Initialize navigation
    initStickyNav();
    initKeyboardNav();

    // Initialize parallax effects
    initParallax();
    initCardTilt();

    // Initialize neon flicker
    initNeonFlicker();

    // Initialize holographic shimmer
    initHolographicShimmer();

    // Initialize matrix rain
    initMatrixRain();

    runHeroSequence();
});
