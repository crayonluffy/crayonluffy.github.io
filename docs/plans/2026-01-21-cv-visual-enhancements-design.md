# CV Website Visual Enhancements Design

## Overview

Enhance the terminal-themed CV website with parallax depth effects, text animations, and comprehensive UX improvements to make information easier to find.

## Enhancement Summary

| Feature | Purpose |
|---------|---------|
| Sticky Navigation | Quick section jumping |
| Keyboard Shortcuts | Power-user navigation (1-6 keys) |
| Stats Banner | 5-second recruiter hook |
| Parallax Depth | Visual interest, layered feel |
| Text Effects | Neon flicker, holographic shimmer, matrix rain |
| Visual Hierarchy | Clearer sections, highlighted key info |

---

## 1. Quick Navigation System

### Sticky Nav Bar

Appears after scrolling past hero section:

```
┌─────────────────────────────────────────────────────────┐
│  MT   │  About  Experience  Skills  Certs  Contact      │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: Fixed top, `height: 50px`
- Background: `rgba(10, 10, 15, 0.85)` with `backdrop-filter: blur(10px)`
- Visibility: Hidden when hero is in view, fades in when hero scrolls out
- Active section highlighted in cyan (tracked via Intersection Observer)
- Smooth scroll on click (`scroll-behavior: smooth`)

**Mobile behavior:**
- Stays visible but more compact
- Smaller font, tighter spacing
- Consider: horizontal scroll or abbreviated labels

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| H | Jump to Hero |
| 1 | Jump to About |
| 2 | Jump to Experience |
| 3 | Jump to Skills |
| 4 | Jump to Certifications |
| 5 | Jump to Contact |

**Implementation:**
- `keydown` event listener on document
- Only trigger when not focused on input/textarea
- Visual flash on target section title confirms navigation
- Hint in footer: `Press 1-5 to navigate`

---

## 2. At-a-Glance Stats Banner

**Position:** Between Hero and About sections

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  $ summary --brief                                          │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   7+     │  │    4     │  │   5      │  │   20+    │    │
│  │  YEARS   │  │  ROLES   │  │  CERTS   │  │  TECH    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                             │
│  VMware • OpenShift • Azure • Kubernetes • AI Hosting       │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: ~150px (compact, not a full section)
- Background: `#0d0d14` (slightly lighter than hero)
- Border: Subtle terminal-style border `1px solid rgba(0, 212, 255, 0.15)`
- Stats grid: 4 columns on desktop, 2x2 on mobile

**Count-up Animation:**
- Numbers start at 0, count up to final value
- Duration: 0.8s with ease-out
- Triggers when section enters viewport (Intersection Observer)
- Only animates once (tracked with data attribute)

**Tech Tags:**
- Horizontal row of key technologies
- Separated by `•` character
- Muted cyan color (`rgba(0, 212, 255, 0.7)`)
- Horizontally scrollable on mobile if needed

---

## 3. Parallax Depth Effects

### Layer System

| Layer | Speed | Elements |
|-------|-------|----------|
| Background | 0.3x | Network particles |
| Middle | 0.6x | Section backgrounds, separators |
| Foreground | 1.0x | Main content (normal scroll) |
| Floating | 1.2x | Decorative code symbols |

### Hero Parallax

- ASCII art and name: `transform: translateY(scrollY * 0.3)`
- Network particles: drift upward as user scrolls down
- Creates "leaving the terminal" depth effect

### Section Separators

Faint horizontal lines of binary/code between sections:
```
───────── 01001101 ─────────
```
- Opacity: 5-10%
- Move at 0.6x scroll speed (appear to be behind content)

### Floating Decorative Elements

Small code symbols scattered at viewport edges:
- Characters: `< >`, `{ }`, `/`, `[ ]`, `;`
- Position: Fixed to viewport, near edges
- Opacity: 10-15%
- Movement: 1.2x scroll speed (float past content)
- Sparse placement: 4-6 elements total, not cluttered

### Certification Card 3D

- On hover: slight 3D tilt via CSS `perspective` and `rotateX/Y`
- Tilt follows mouse position within card
- Subtle effect: max 5-8 degree rotation

### Performance Safeguards

```css
@media (prefers-reduced-motion: reduce) {
    /* Disable all parallax */
}

@media (max-width: 768px) {
    /* Disable parallax on mobile */
}
```

- Use `transform` only (GPU accelerated)
- Use `will-change: transform` sparingly
- Throttle scroll handlers with `requestAnimationFrame`

---

## 4. Text Effects

### Neon Flicker (Terminal Commands)

Applied to: `$ cat about.md`, `$ history --career`, etc.

**Animation pattern:**
```css
@keyframes neonFlicker {
    0%, 92%, 94%, 100% { opacity: 1; text-shadow: 0 0 10px currentColor; }
    93% { opacity: 0.8; text-shadow: 0 0 5px currentColor; }
}
```

**Behavior:**
- Not constant - triggers randomly every 3-8 seconds
- Use JavaScript to add/remove animation class periodically
- Subtle, peripheral notice, not distracting

### Holographic Shimmer (Name in Hero)

Applied to: "MING TING" heading

**Effect:** Gradient sweep across text
```css
background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    #ffffff 50%,
    var(--color-primary) 100%
);
background-size: 200% 100%;
-webkit-background-clip: text;
animation: shimmer 0.8s ease;
```

**Triggers:**
- On hover
- Auto-play every 10 seconds
- Single sweep, not looping

### Matrix Rain (Hero Background)

**Specifications:**
- Canvas element behind hero content
- Characters: `0`, `1`, occasional kanji (`ア`, `イ`, `ウ`, etc.)
- Opacity: 5-8% (very subtle, atmospheric)
- Fall speed: Slow, gentle drift
- Column spacing: Sparse (every 30-50px)
- Color: Cyan, matching theme

**Performance:**
- Only runs while hero is in viewport
- Pauses when scrolled past (Intersection Observer)
- Respects `prefers-reduced-motion`

---

## 5. Visual Hierarchy Improvements

### Section Command Styling

```css
.section__command {
    font-size: 1.5rem;  /* increased from 1.25rem */
    margin-bottom: 2rem;
    position: relative;
}

.section__command::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), transparent);
}
```

### Key Info Highlighting

**Stat pills:**
```css
.highlight-pill {
    background: rgba(0, 212, 255, 0.15);
    padding: 0.1em 0.4em;
    border-radius: 4px;
}
```

Apply to: years of experience, key numbers, important terms

**Current role badge:**
```html
<span class="badge badge--current">← CURRENT</span>
```
- Green color (`#22c55e`)
- Small, uppercase, positioned after company name

### Alternating Section Backgrounds

```css
.section:nth-child(odd) {
    background-color: #0a0a0f;
}

.section:nth-child(even) {
    background-color: #0d0d14;
}
```

### Experience Section Enhancements

- Company names: `font-size: 1.1em`, `font-weight: 600`
- Line-height in tasks: `1.8` (easier scanning)
- Left border on expanded details:
```css
.history__content {
    border-left: 2px solid rgba(0, 212, 255, 0.3);
    padding-left: 1rem;
}
```

### Increased Section Spacing

```css
.section {
    padding: 6rem 2rem;  /* increased from 4rem */
}
```

---

## Implementation Priority

1. **Stats Banner** - Immediate value for recruiters
2. **Sticky Navigation** - Core UX improvement
3. **Visual Hierarchy** - Quick CSS wins
4. **Text Effects** - Polish layer
5. **Parallax Effects** - Final flourish

---

## Technical Notes

- All animations use CSS transforms for GPU acceleration
- JavaScript scroll handlers throttled via `requestAnimationFrame`
- Intersection Observer for viewport-triggered animations
- Mobile: disable parallax, simplify effects
- Accessibility: respect `prefers-reduced-motion`
