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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

document.addEventListener('DOMContentLoaded', () => {
    runHeroSequence();
});
