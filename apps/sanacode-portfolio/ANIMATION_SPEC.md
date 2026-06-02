# ANIMATION_SPEC.md — GSAP / Scroll / Motion Rules

## 1. Motion Philosophy

Motion should feel:

```txt
slow / editorial / physical / calm / premium
```

Motion must not feel:

```txt
flashy / game-like / noisy / gimmicky / cyberpunk
```

Animations exist to:

- reveal hierarchy
- create rhythm
- guide the eye
- make screenshots feel physical

Animations do not exist to show technical skill.

---

## 2. Required Libraries

Use:

```txt
gsap
gsap/ScrollTrigger
lenis
```

Optional:

```txt
split-type
```

---

## 3. Lenis Setup

Create `src/lib/lenis.ts`.

Expected behavior:

- smooth wheel and touch scroll
- integrate with GSAP ticker if needed
- disabled or simplified for reduced motion

Pseudo implementation:

```ts
import Lenis from 'lenis';

export function createLenis() {
  return new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });
}
```

---

## 4. GSAP Setup

Use `gsap.context()` inside React components.
Always cleanup.

Pattern:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // animations
  }, rootRef);

  return () => ctx.revert();
}, []);
```

Register ScrollTrigger once:

```ts
gsap.registerPlugin(ScrollTrigger);
```

---

## 5. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

In JS:

```ts
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

If true:

- no scrub animations
- no smooth scroll
- no rotation movement
- simple opacity only or static rendering

---

## 6. Hero Animation

### Sequence

1. Background is visible immediately.
2. Main title line 1 reveals.
3. Main title line 2 reveals.
4. Role text fades in.
5. Scroll indicator fades in.

### Values

```js
gsap.from('.hero-line', {
  yPercent: 110,
  opacity: 0,
  duration: 1.2,
  stagger: 0.12,
  ease: 'power3.out',
});

gsap.from('.hero-meta', {
  y: 24,
  opacity: 0,
  duration: 0.9,
  delay: 0.5,
  ease: 'power2.out',
});
```

### Avoid

- bouncing
- typewriter effect
- glitch effect

---

## 7. General Text Reveal

For section labels, titles, and descriptions:

```js
gsap.from('[data-reveal="text"]', {
  y: 48,
  opacity: 0,
  duration: 1.0,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 78%',
  },
});
```

Use stagger only when it improves readability.

---

## 8. Editorial Image Scroll Motion

For major screenshots:

```js
gsap.fromTo(image, {
  y: 120,
  rotate: -4,
  scale: 0.96,
}, {
  y: -80,
  rotate: 2,
  scale: 1.02,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.1,
  },
});
```

Allowed ranges:

```txt
y: -120 to 120
x: -240 to 240
rotate: -6 to 6
scale: 0.92 to 1.08
```

Do not exceed these unless deliberately creating a transition.

---

## 9. Horizontal Editorial Movement

For MOMOTARO-like scroll feeling:

```js
gsap.to('.horizontal-track', {
  xPercent: -20,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: '+=120%',
    scrub: 1,
    pin: true,
  },
});
```

Use sparingly.

Do not create confusing horizontal scroll on mobile.

Mobile behavior:

- disable pin
- stack content vertically

---

## 10. Project Transition Motion

For transition sections:

```js
gsap.fromTo('.transition-title', {
  opacity: 0,
  scale: 0.96,
  y: 40,
}, {
  opacity: 1,
  scale: 1,
  y: 0,
  scrollTrigger: {
    trigger: section,
    start: 'top 70%',
    end: 'center center',
    scrub: 0.8,
  },
});
```

Circular text:

```js
gsap.to('.circular-text', {
  rotate: 120,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

---

## 11. List Hover Motion

For Selected Tools list:

```css
.tool-row-title {
  transition: transform 0.45s cubic-bezier(.2,.8,.2,1);
}

.tool-row:hover .tool-row-title {
  transform: translateX(12px);
}
```

Preview image:

```css
.preview-image {
  opacity: 0;
  transform: translateY(16px) rotate(-2deg);
  transition: opacity .45s ease, transform .45s ease;
}

.tool-row:hover .preview-image {
  opacity: 1;
  transform: translateY(0) rotate(-2deg);
}
```

---

## 12. Page Load

Optional simple loader:

- black background
- small text counter or `SANACODE`
- no complex loading animation
- max 1.2 seconds

Do not block page unnecessarily.

Suggested:

```txt
SANACODE
```

Fade out.

---

## 13. Cursor

Default cursor is acceptable.

Optional custom cursor:

- small ring
- follows pointer smoothly
- grows slightly over links

Do not create large distracting cursor effects.

Disable custom cursor on touch devices.

---

## 14. Performance Rules

- Animate transform and opacity only.
- Avoid animating width, height, top, left.
- Use `will-change` sparingly.
- Do not add too many ScrollTriggers.
- Compress images.
- Use Next/Image.
- Do not add WebGL unless explicitly requested.

---

## 15. Animation Acceptance Checklist

Before finishing:

- Does every animation have a purpose?
- Can the page be understood with animations disabled?
- Are motions slow and premium?
- Are screenshots the main animated objects?
- Did we avoid particles, glitch, and neon?
- Is mobile simple and readable?

