# CV Website Redesign - Terminal Hybrid Theme

## Overview

Revamp of https://crayonluffy.github.io/ with a creative terminal/code aesthetic that balances visual impact with professional readability.

## Design Direction

**Style:** Hybrid terminal - clean modern layout with terminal elements woven in (command prompts for section headers, monospace fonts, code references)

**Color Palette:**
- Background: Deep dark (#0a0a0f)
- Primary accent: Cyan (#00d4ff)
- Text: Off-white (#e0e0e0)
- Secondary: Muted gray for less important text
- Success/Verified: Green (for certifications only)

**Typography:**
- Headings/commands: Monospace font (e.g., JetBrains Mono, Fira Code)
- Body text: Monospace with comfortable line spacing for readability

**Animations:**
- Auto-typing effects for terminal commands (no user input required)
- Blinking cursor remains after typing completes
- Smooth scroll transitions between sections

---

## Sections

### 1. Hero

**Terminal sequence on load:**
```
$ ssh ming@hongkong.cloud
Connecting...
Authentication successful.

$ neofetch
```

**ASCII art block with stats:**
```
    __  _______
   /  |/  /_  __/    MING TING
  / /|_/ / / /       ─────────────
 / /  / / / /        Role: IT Infrastructure
/_/  /_/ /_/         Location: Hong Kong
                     Certs: VMware × NetApp × Cloud
                     Status: Available for opportunities
```

**Details:**
- Full viewport height (100vh)
- Subtle node-network animation background (drifting connected dots)
- Name glitches once (RGB split, 0.2s) then settles
- Roles cycle below with typing effect:
  ```
  $ current --status
  > System Specialist_
  ```
- Subtle bouncing `↓` with "scroll to continue" in muted gray

---

### 2. About

**Command intro:**
```
$ cat about.md_
```

**Content (in terminal window frame):**
```
# About

Hong Kong-based IT professional with 7+ years
building and managing enterprise infrastructure.

Started at PolyU, now architecting systems at
the University of Hong Kong.

I make complex systems reliable.
```

**Details:**
- Thin border terminal window frame with mock controls (● ● ●)
- Key phrases highlighted in cyan
- Faint `>` prompt at start of lines
- 3-4 lines max, concise

---

### 3. Experience

**Command intro:**
```
$ history --career_
```

**Layout as command history with line numbers:**
```
  127  2024-present  University of Hong Kong
  126  2022-2024     Previous Company
  125  2020-2022     Another Role
```

**Expanded entry:**
```
  127  2024-present  University of Hong Kong
       └─ $ cat job.log
          Role: System Specialist
          → Managed VMware infrastructure across campus
          → Deployed OpenShift container platform
          → Reduced downtime by implementing automated failover
```

**Details:**
- Line numbers in muted gray
- Dates in cyan
- Company names in white, bold
- Tree branch (`└─`) for expanded content
- Arrows (`→`) instead of bullet points
- Most recent role expanded by default
- Click to expand/collapse others
- Line numbers "count up" animation on scroll

---

### 4. Skills

**Command intro:**
```
$ ls -la ./skills/_
```

**Layout as directory listing:**
```
drwxr-xr-x  Infrastructure/
    ├── VMware vSphere
    ├── NetApp Storage
    ├── Windows Server
    └── Linux Administration

drwxr-xr-x  Cloud & DevOps/
    ├── OpenShift
    ├── Docker
    ├── Kubernetes
    └── CI/CD Pipelines

drwxr-xr-x  Development/
    ├── PHP
    ├── JavaScript
    └── Python

drwxr-xr-x  Languages/
    ├── Cantonese (native)
    ├── English (fluent)
    └── Mandarin (fluent)
```

**Summary line at top:**
```
$ wc -l ./skills/*
  14 technologies    4 categories    3 languages
```

**Details:**
- Category folders in cyan
- Skills in white with tree branches
- Hover glow effect on skills
- No percentage bars

---

### 5. Certifications

**Command intro:**
```
$ gpg --verify credentials.sig_
```

**Layout as verified signatures:**
```
✓ VERIFIED  VMware VCP-DCV 2024
            Datacenter Virtualization
            Expires: 2026

✓ VERIFIED  NetApp NCDA
            Data Administrator
            Expires: 2025

✓ VERIFIED  AWS Solutions Architect
            Associate Level
            Expires: 2025
```

**Details:**
- `✓ VERIFIED` in green (exception to cyan palette)
- Cert name in white, bold
- Description/expiry in muted gray
- Responsive grid (3 across desktop, stacks mobile)
- Verification animation on scroll: `⠋ CHECKING... → ✓ VERIFIED`
- Expired certs show as `⚠ EXPIRED` in amber

---

### 6. Contact

**Command intro:**
```
$ ping ming --connect_
```

**Layout:**
```
PING ming@hongkong.cloud

--- connection options ---
✉  crayonluffy@gmail.com      [OPEN]
⌘  github.com/crayonluffy     [OPEN]
◎  LinkedIn                   [OPEN]
📍 Hong Kong SAR

--- establishing connection ---
█████████████░░░░░░░░  63%
Waiting for your message...
```

**Details:**
- Clickable contact methods with `[OPEN]` badges in cyan
- Animated loading bar (perpetually loading)
- Email → mailto:, GitHub/LinkedIn → new tab

**Education footnote (below contact):**
```
$ cat education.txt
BSc Computing, Hong Kong Polytechnic University
Higher Diploma, Hong Kong Polytechnic University
```
Muted gray, understated.

**Footer:**
```
© 2024 Ming Ting | Built with caffeine and curiosity
```

---

## Technical Considerations

**Framework options:**
- Static HTML/CSS/JS (simplest, GitHub Pages compatible)
- Astro or Next.js (if more structure needed)

**Key libraries to consider:**
- Typed.js or similar for typing animations
- Intersection Observer API for scroll-triggered animations
- CSS animations for loading bars and glitch effects

**Performance:**
- Keep animations lightweight
- Lazy load sections below fold
- Optimize for mobile first

**Accessibility:**
- Ensure sufficient color contrast
- Provide reduced-motion alternatives
- Semantic HTML structure

---

## Out of Scope

- Projects section (no public projects to showcase currently)
- Blog functionality
- Dark/light theme toggle (always dark)
