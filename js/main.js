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

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();
    const sections = document.querySelectorAll('.section:not(.section--hero)');
    scrollAnimator.observe(sections);

    // Initialize experience section
    initExperienceSection();

    runHeroSequence();
});
