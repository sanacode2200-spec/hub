# DESIGN_SYSTEM.md — Visual Rules

## 1. Identity

This design system exists to create a portfolio that feels:

```txt
quiet / premium / editorial / clinical / modern / human
```

It must not feel:

```txt
busy / trendy / SaaS template / hospital admin / generic developer
```

---

## 2. Visual Keywords

Use these words to guide decisions:

- Editorial
- Minimal
- Full-screen
- Spacious
- Asymmetric
- Product-like
- Calm
- Precise
- Human-centered

Never use these as direction:

- Cute
- Flashy
- Neon
- Corporate
- Dashboard-heavy
- Template-like
- Startup-ish

---

## 3. Grid System

Desktop base:

```css
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  padding-inline: 8vw;
}
```

Use grid, but allow elements to break it visually.

Example editorial composition:

```txt
[01]        [Huge Title Huge Title]
            [Huge Title Huge Title]

      [Large screenshot offset to the right]

                              [small description]
```

Do not make everything symmetrical.

---

## 4. Spacing Tokens

```css
:root {
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 64px;
  --space-xl: 96px;
  --space-2xl: 128px;
  --space-3xl: 160px;
  --space-4xl: 220px;
}
```

Rules:

- Major section spacing uses `--space-3xl` or larger.
- Component spacing uses `--space-lg` or `--space-xl`.
- Small UI spacing may use `--space-sm`.
- Avoid cramped `24px` section padding on desktop.

---

## 5. Typography

### Font Stack

```css
:root {
  --font-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: "Cormorant Garamond", Georgia, serif;
}
```

### Scale

```css
:root {
  --font-size-hero: clamp(72px, 12vw, 184px);
  --font-size-display: clamp(56px, 9vw, 144px);
  --font-size-section: clamp(40px, 6vw, 88px);
  --font-size-lead: clamp(20px, 2vw, 32px);
  --font-size-body-lg: clamp(18px, 1.4vw, 22px);
  --font-size-body: 16px;
  --font-size-small: 12px;
}
```

### Usage

Hero:

```css
font-size: var(--font-size-hero);
line-height: 0.86;
letter-spacing: -0.06em;
font-weight: 400;
```

Project title:

```css
font-size: var(--font-size-display);
line-height: 0.9;
letter-spacing: -0.05em;
font-weight: 400;
```

Small labels:

```css
font-size: 12px;
letter-spacing: 0.14em;
text-transform: uppercase;
```

Body:

```css
font-size: var(--font-size-body-lg);
line-height: 1.65;
font-weight: 400;
```

---

## 6. Color Tokens

```css
:root {
  --color-black: #0b0b0b;
  --color-white: #ffffff;
  --color-off-white: #f4f4f1;
  --color-gray-light: #d9d9d4;
  --color-gray-mid: #8a8a84;
  --color-gray-dark: #1a1a1a;

  --color-clinical-blue: #2779a7;
  --color-soft-coral: #ff9398;
  --color-chartreuse: #c9e936;
}
```

### Color Rules

Use black and white as the main system.

Preferred combinations:

```txt
black bg / white text
white bg / black text
off-white bg / black text
```

Accent use:

- small number labels
- hover underline
- one circular text accent
- one section marker

Never use accent colors for entire backgrounds unless intentionally creating one standout section.

---

## 7. Background Words

Large background words are decorative, not navigation.

Examples:

```txt
SANACODE
REFLOW
WORK
CLINICAL
```

CSS:

```css
.big-bg-word {
  position: absolute;
  left: -0.05em;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(120px, 22vw, 360px);
  line-height: 0.8;
  letter-spacing: -0.08em;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}
```

Rules:

- opacity must be low.
- text must not compete with main content.
- use as composition filler.

---

## 8. Circular Text

Circular text adds premium editorial detail.

Use SVG textPath or CSS rotated letters.

Suggested text:

```txt
SANACODE — CLINICAL WORKFLOW — SOFTWARE —
```

Placement:

- top-right
- lower-left
- near transition sections

Rules:

- size: 96px to 160px
- opacity: 0.5 to 1
- rotate slowly on scroll or idle
- do not overuse; max 2 times on page

---

## 9. Buttons and Links

Avoid big CTA buttons.

Use text links:

```txt
View project →
GitHub →
Contact →
```

CSS:

```css
.text-link {
  display: inline-flex;
  gap: 0.5em;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

Hover:

- slight x translation
- underline reveal
- no glow

---

## 10. Cards

Avoid ordinary cards.

If grouping content, use editorial blocks:

```css
.editorial-block {
  border-top: 1px solid currentColor;
  padding-top: 32px;
}
```

Do not use:

- rounded SaaS cards everywhere
- shadows everywhere
- grid of 12 cards
- feature tiles

---

## 11. Responsive Behavior

Mobile should preserve identity but reduce complexity.

Mobile rules:

- stack content vertically
- reduce rotations
- hide large decorative background words if they harm readability
- circular text optional hidden
- no horizontal scroll traps
- animation simplified

Mobile typography:

```css
hero: clamp(56px, 18vw, 96px)
project: clamp(44px, 14vw, 80px)
body: 16px to 18px
```

---

## 12. Accessibility

- Always preserve text contrast.
- Respect `prefers-reduced-motion`.
- Do not rely on animation to reveal essential content.
- Links must be keyboard focusable.
- Decorative text should be `aria-hidden="true"`.
- Images need meaningful alt text when they represent projects.

