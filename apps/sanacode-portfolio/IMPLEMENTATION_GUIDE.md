# IMPLEMENTATION_GUIDE.md — Build Instructions for Claude Code / Codex

## 1. Start Here

Read files in this order:

1. `CLAUDE.md`
2. `DESIGN_SYSTEM.md`
3. `SITE_ARCHITECTURE.md`
4. `COMPONENT_LIBRARY.md`
5. `ANIMATION_SPEC.md`
6. `CONTENT_SPEC.md`

Then implement the site.

---

## 2. First Build Target

Build a polished first version with:

- single page
- responsive layout
- all sections present
- placeholder project screenshots if actual images are missing
- GSAP + Lenis setup
- subtle animations
- accessible markup

Do not spend time on WebGL.
Do not create project detail pages initially.
Do not build CMS.

---

## 3. Install Dependencies

```bash
npm install gsap lenis
```

Optional:

```bash
npm install split-type
```

---

## 4. Tailwind Setup

Use Tailwind for layout and tokens, but avoid default template look.

Extend theme with:

```ts
colors: {
  blackSoft: '#0b0b0b',
  offWhite: '#f4f4f1',
  graySoft: '#d9d9d4',
  grayMid: '#8a8a84',
  clinicalBlue: '#2779a7',
  softCoral: '#ff9398',
  chartreuse: '#c9e936',
}
```

Font families:

```ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Cormorant Garamond', 'Georgia', 'serif'],
}
```

---

## 5. Global CSS

Required base styles:

```css
html {
  scroll-behavior: auto;
}

body {
  background: #0b0b0b;
  color: #ffffff;
  font-family: Inter, system-ui, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: #d9d9d4;
  color: #0b0b0b;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

---

## 6. Data Files

Create `src/data/projects.ts`:

```ts
export const projects = [
  {
    id: 'reflow',
    number: '01',
    title: 'ReFlow',
    subtitle: 'Rehabilitation workflow, from record to billing.',
    description:
      'A workflow system for rehabilitation teams. ReFlow connects daily implementation records, patient management, billing categories, and monthly aggregation into one clearer flow.',
    images: [
      {
        src: '/images/reflow-dashboard.png',
        alt: 'ReFlow dashboard — daily overview with patient stats and schedule',
        caption: 'Daily visibility without spreadsheet fatigue.',
      },
      {
        src: '/images/reflow-schedule.png',
        alt: 'ReFlow weekly schedule grid',
        caption: 'Patient status and rehabilitation workflow in one view.',
      },
      {
        src: '/images/reflow-record-billing.png',
        alt: 'ReFlow implementation record with SOAP notes and billing copy',
        caption: 'Billing aggregation without losing clinical context.',
      },
      {
        src: '/images/reflow-mobile-schedule.png',
        alt: 'ReFlow mobile schedule view',
        caption: 'Designed around the actual rhythm of rehabilitation work.',
      },
    ],
  },
];
```

Create `src/data/tools.ts`:

```ts
export const tools = [
  {
    number: '01',
    title: 'MOV to MP4 Converter',
    description: 'A browser-based utility for converting iPhone video into easier-to-share MP4 files.',
  },
  {
    number: '02',
    title: 'QR Code Tool',
    description: 'A lightweight tool for quick sharing, testing, and small everyday workflows.',
  },
  {
    number: '03',
    title: 'Translation News Site',
    description: 'A small publishing concept for reading news through translation and language learning.',
  },
  {
    number: '04',
    title: 'Statistics Tool',
    description: 'A clearer statistical output interface for medical workers who do not want to fight with raw console results.',
  },
];
```

---

## 7. Page Composition

`src/app/page.tsx` should be simple:

```tsx
import { SiteHeader } from '@/components/SiteHeader';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { FeaturedProjectSection } from '@/components/FeaturedProjectSection';
import { ProjectTransition } from '@/components/ProjectTransition';
import { SelectedToolsSection } from '@/components/SelectedToolsSection';
import { WritingSection } from '@/components/WritingSection';
import { ContactSection } from '@/components/ContactSection';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <FeaturedProjectSection />
      <ProjectTransition />
      <SelectedToolsSection />
      <WritingSection />
      <ContactSection />
    </main>
  );
}
```

---

## 8. Placeholder Screenshots

If real screenshots are missing:

- create simple placeholder panels
- label them as ReFlow Dashboard / Patient Flow / Billing Summary
- keep them visually premium
- replace later with actual images

Do not use random stock photos.

---

## 9. Mobile Rules

On mobile:

- no pinned horizontal scroll
- no extreme rotations
- hide background words if needed
- preserve large typography but keep readable
- stack content vertically
- reduce section padding

---

## 10. Build Order

Recommended sequence:

1. Global CSS and font setup
2. Header
3. Hero section
4. About section
5. ReFlow section without animation
6. Tools section
7. Writing and Contact
8. Add GSAP reveals
9. Add Lenis
10. Add screenshot scroll motion
11. Polish responsive

---

## 11. Acceptance Criteria

The first implementation is successful if:

- ReFlow feels like the main event.
- The site does not look like a template.
- The typography is huge and confident.
- Whitespace is generous.
- Animations are subtle.
- Mobile is readable.
- Lighthouse performance is not destroyed by effects.
- The site can be deployed on Vercel.

