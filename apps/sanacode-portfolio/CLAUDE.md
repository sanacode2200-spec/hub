# CLAUDE.md — Sanacode Portfolio Build Constitution

このファイルは Claude Code / Codex / Cursor に最初に読ませる最上位指示書です。
このポートフォリオは「参考サイトを完全コピーする」目的ではなく、MOMOTARO系のエディトリアル表現、Laugh Mind系のタイポグラフィの強さ、M-TRUST系の没入感の“良いところだけ”を Sanacode の文脈に再構成するためのものです。

---

## 0. Absolute Goal

Build a premium editorial portfolio website for **Sanacode**.

Sanacode is:

- Physical Therapist
- Software Builder
- AI Native Creator
- Clinical workflow thinker

The site should feel like:

- Editorial product showcase
- Quiet premium portfolio
- Museum / architecture magazine / Apple product story
- Human-centered clinical software presentation

The site must NOT feel like:

- Generic developer portfolio
- SaaS landing page
- Startup marketing LP
- Hospital system UI
- Bootstrap / Tailwind template
- Agency template
- Resume page

---

## 1. Design Direction

Primary direction:

```txt
MOMOTARO 70%
Laugh Mind 20%
M-TRUST 10%
```

Meaning:

- MOMOTARO: minimal, editorial, gallery, large whitespace, typography-led.
- Laugh Mind: strong typography, controlled contrast, lively but not childish.
- M-TRUST: immersive full-screen feeling only. Do NOT copy heavy WebGL or particle effects.

Do not overuse WebGL. Do not add particles. Do not add neon. Do not add meaningless 3D.

---

## 2. Core Concept

Main concept:

```txt
Clinical Workflow, Redesigned.
```

Sub concept:

```txt
A physical therapist building software for clearer rehabilitation workflows.
```

Tone:

- short
- calm
- confident
- minimal
- not salesy
- not self-important

Avoid:

- “I am passionate about...”
- long biography
- skill badge grids
- too many CTAs
- inflated startup language

---

## 3. Required Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Lenis smooth scrolling
- next/image

Optional:

- Framer Motion only for small UI micro-interactions
- SplitType for text animation

Do not use:

- Bootstrap
- Material UI
- Chakra UI
- DaisyUI
- Prebuilt component templates
- Heavy WebGL unless specifically requested later

---

## 4. File Structure

Recommended structure:

```txt
/src
  /app
    layout.tsx
    page.tsx
    globals.css
  /components
    SiteHeader.tsx
    HeroSection.tsx
    AboutSection.tsx
    ProjectShowcase.tsx
    ProjectTransition.tsx
    SelectedTools.tsx
    WritingSection.tsx
    ContactSection.tsx
    CircularText.tsx
    EditorialImage.tsx
    SectionNumber.tsx
    BigBackgroundWord.tsx
  /lib
    lenis.ts
    gsap.ts
  /data
    projects.ts
    writing.ts
/public
  /images
    reflow-dashboard.png
    reflow-patients.png
    reflow-billing.png
    tool-converter.png
    tool-qr.png
```

---

## 5. Page Architecture

The page should be one long editorial scroll.

Required sections:

1. Hero
2. About / Positioning
3. Featured Project: ReFlow
4. Transition: Scroll Down to Next Project
5. Selected Tools
6. Writing / Thinking
7. Contact

No separate resume page.
No skill list page.
No pricing section.
No testimonial section.

---

## 6. Layout Rules

Global rules:

- One major idea per viewport.
- Major sections should be at least `min-height: 100vh`.
- Use huge whitespace.
- Do not center everything.
- Allow intentional imbalance.
- Use asymmetry.
- Images and typography should feel like magazine spreads.

Desktop spacing:

```css
section {
  min-height: 100vh;
  padding-block: 160px;
  padding-inline: 8vw;
}
```

Tablet:

```css
section {
  padding-block: 120px;
  padding-inline: 6vw;
}
```

Mobile:

```css
section {
  min-height: auto;
  padding-block: 88px;
  padding-inline: 24px;
}
```

Never use cramped spacing.
Never use `max-width: 1200px` everywhere.
Use wide layouts.

---

## 7. Typography Rules

Primary sans:

- Inter
- fallback: system-ui

Editorial serif:

- Cormorant Garamond
- fallback: Georgia

Optional display sans:

- Space Grotesk
- DM Sans

Typography scale:

```css
--text-hero: clamp(72px, 12vw, 184px);
--text-project: clamp(56px, 9vw, 144px);
--text-section: clamp(40px, 6vw, 88px);
--text-body-lg: clamp(18px, 1.6vw, 24px);
--text-body: 16px;
--text-small: 12px;
```

Hero title:

- huge
- tight line-height
- light or regular weight
- should occupy a large portion of screen

```css
.hero-title {
  font-size: clamp(72px, 12vw, 184px);
  line-height: 0.86;
  letter-spacing: -0.06em;
  font-weight: 400;
}
```

Project title:

```css
.project-title {
  font-size: clamp(56px, 9vw, 144px);
  line-height: 0.9;
  letter-spacing: -0.05em;
}
```

Body copy:

```css
.body-copy {
  max-width: 520px;
  font-size: clamp(18px, 1.4vw, 22px);
  line-height: 1.65;
}
```

Avoid:

- bold everywhere
- small headings
- dense paragraph blocks
- skill badges

---

## 8. Color System

Base palette:

```css
--white: #ffffff;
--black: #0b0b0b;
--gray-100: #f4f4f1;
--gray-300: #d9d9d4;
--gray-500: #8a8a84;
--gray-800: #1a1a1a;
```

Accent palette, use sparingly:

```css
--clinical-blue: #2779a7;
--soft-coral: #ff9398;
--chartreuse: #c9e936;
```

Rules:

- Primary site should be black/white/gray.
- Accent colors are allowed only for small markers, hover states, or one visual section.
- Do not use gradients as decoration.
- Do not use neon backgrounds.
- Do not make it look like a cyberpunk site.

Section rhythm:

```txt
Hero: black background / white text
About: white background / black text
ReFlow: black background / white text
Transition: white background / black text
Tools: white or off-white background
Writing: black background
Contact: white background
```

---

## 9. Image System

Images are the main proof of work.

Rules:

- Use large screenshots.
- Images should occupy 60–80vw on desktop.
- Screenshots should be slightly offset, layered, or rotated.
- Never use small thumbnail grids as the main presentation.
- Avoid generic device mockups unless they are minimal.

Editorial image CSS:

```css
.editorial-image {
  width: min(78vw, 1200px);
  border-radius: 24px;
  transform: rotate(-2deg);
  box-shadow: 0 40px 120px rgba(0,0,0,0.22);
}
```

Alternate image placements:

- center huge image
- right-offset huge image
- rotated image entering from lower right
- two overlapping screenshots with one smaller detail card

Do not over-align every screenshot.

---

## 10. Motion Rules

Use motion to guide attention, not entertain.

Required motion:

- Lenis smooth scroll
- GSAP ScrollTrigger reveal animations
- subtle horizontal movement on selected sections
- subtle rotation and scale on images
- opacity + y reveal for text

Allowed transform values:

```txt
translateX: -240px to 240px
translateY: -120px to 120px
rotate: -6deg to 6deg
scale: 0.92 to 1.08
opacity: 0 to 1
```

Do not use:

- particles
- glitch
- aggressive parallax
- bouncing
- confetti
- random 3D cards
- excessive cursor effects

Animation timing:

```js
ease: "power2.out"
duration: 1.0 to 1.4
scrub: true for scroll-linked large image movement
scrub: 0.8 to 1.2 for smooth editorial movement
```

---

## 11. Navigation

Header must be minimal.

Desktop:

- fixed top
- small logo text: Sanacode
- right side nav: Work / About / Contact
- no large nav bar

Mobile:

- simple fixed header
- menu button optional

Header style:

```css
.header {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 28px 8vw;
  mix-blend-mode: difference;
  color: white;
  z-index: 50;
}
```

Do not create a typical SaaS navbar.

---

## 12. Section Details

### Hero

Content:

```txt
SANACODE
Clinical Workflow,
Redesigned.

Physical Therapist / Software Builder / AI Native Creator
```

Must include:

- huge typography
- minimal subcopy
- black background
- no CTA button
- optional small scroll indicator
- optional large background word

### About

Purpose:

Explain identity in a short editorial way.

Sample copy:

```txt
I work in rehabilitation and build software around the invisible friction of clinical workflow.
```

Do not write a long biography.

### ReFlow

This is the most important section.

Treat ReFlow like a premium product.

Show:

- dashboard
- patient list
- implementation record
- billing aggregation
- monthly report

Copy direction:

```txt
ReFlow
Rehabilitation workflow, from record to billing.
```

Do not over-explain.

### Transition Section

Purpose:

Create rhythm and premium feeling.

Example:

```txt
Scroll Down
to Next Project
```

Use large empty space.

### Selected Tools

Show 2–4 tools.

Possible items:

- MOV to MP4 Converter
- QR Code Tool
- Translation News Site
- Statistics Tool

No card grid. Use editorial list.

### Writing

Show thinking / posts / essays.

Tone:

- clinical workflow
- AI usage
- software thinking
- rehabilitation

### Contact

Simple.

```txt
Let’s build calmer software.
```

Include:

- GitHub
- Threads
- Email if available

---

## 13. Components To Build

Required components:

- SiteHeader
- HeroSection
- AboutSection
- FeaturedProjectSection
- ProjectTransition
- SelectedToolsSection
- WritingSection
- ContactSection
- CircularText
- BigBackgroundWord
- EditorialImage
- SectionNumber
- SplitTextReveal

Each component must be simple and composable.

Do not create unnecessary abstraction.

---

## 14. Implementation Quality

Code must be:

- readable
- TypeScript strict compatible
- componentized
- responsive
- accessible
- animation cleanup included

GSAP setup must use `gsap.context()` and cleanup on unmount.

Respect `prefers-reduced-motion`.

If reduced motion is enabled:

- disable Lenis smooth behavior
- disable scrub animations
- keep simple opacity reveal or no animation

---

## 15. Final Design Test

Before finalizing, check:

1. Does it feel like a SaaS template?
   - If yes, remove cards, buttons, gradients, and feature grids.

2. Does it feel like hospital software?
   - If yes, remove blue-heavy clinical UI tropes and make it more editorial.

3. Does it feel like an ordinary developer portfolio?
   - If yes, remove skill badges and resume-style sections.

4. Does it feel like a product/editorial showcase?
   - If yes, continue.

5. Would a viewer remember ReFlow after 10 seconds?
   - If no, make ReFlow bigger and reduce other content.

