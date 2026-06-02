# COMPONENT_LIBRARY.md — Components and Behavior

## 1. SiteHeader

### Purpose

Minimal fixed navigation.

### Props

```ts
type SiteHeaderProps = {
  currentSection?: string;
};
```

### Layout

```txt
Sanacode                         Work / About / Contact
```

### CSS

```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  padding: 28px 8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  mix-blend-mode: difference;
  color: white;
}
```

### Rules

- no large logo image
- no boxed navbar
- no sticky SaaS nav

---

## 2. SectionNumber

### Purpose

Small editorial index marker.

### Example

```txt
01 / 07
```

### CSS

```css
.section-number {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
}
```

---

## 3. BigBackgroundWord

### Purpose

Decorative large text used to fill space.

### Props

```ts
type BigBackgroundWordProps = {
  children: string;
  position?: "left" | "right" | "center";
};
```

### CSS

```css
.big-background-word {
  position: absolute;
  font-size: clamp(120px, 22vw, 360px);
  line-height: 0.8;
  letter-spacing: -0.08em;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}
```

### Accessibility

Add `aria-hidden="true"`.

---

## 4. CircularText

### Purpose

Premium editorial detail.

### Props

```ts
type CircularTextProps = {
  text: string;
  size?: number;
  rotate?: boolean;
};
```

### Implementation

Use SVG:

```tsx
<svg viewBox="0 0 200 200">
  <defs>
    <path id="circlePath" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
  </defs>
  <text>
    <textPath href="#circlePath">SANACODE — CLINICAL WORKFLOW — SOFTWARE —</textPath>
  </text>
</svg>
```

### Rules

- max 2 uses on page
- size 96–160px
- do not place over important text

---

## 5. EditorialImage

### Purpose

Large project screenshot with controlled rotation and shadow.

### Props

```ts
type EditorialImageProps = {
  src: string;
  alt: string;
  rotate?: number;
  priority?: boolean;
  caption?: string;
};
```

### CSS

```css
.editorial-image-wrap {
  position: relative;
  width: min(78vw, 1200px);
}

.editorial-image {
  width: 100%;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 40px 120px rgba(0,0,0,0.22);
  transform: rotate(var(--rotate, -2deg));
}
```

### Rules

- use real screenshots whenever possible
- do not use placeholder stock UI long-term
- do not over-round corners

---

## 6. HeroSection

### Purpose

Immediate identity.

### Content

```txt
SANACODE
Clinical Workflow,
Redesigned.
Physical Therapist / Software Builder / AI Native Creator
```

### Layout

- black background
- huge title
- tiny role text
- optional circular text
- no CTA button

### Animation

- title lines reveal with y + opacity
- role text fades in
- scroll indicator appears last

---

## 7. AboutSection

### Purpose

Explain unique positioning.

### Content

```txt
I work in rehabilitation and build software around the invisible friction of clinical workflow.
```

### Layout

- white/off-white background
- large statement on right or center
- small metadata on left

### Animation

- large statement fades up
- small metadata has delayed fade

---

## 8. FeaturedProjectSection

### Purpose

Show ReFlow as flagship product.

### Props

```ts
type FeaturedProjectSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
};
```

### Required Visuals

- large title
- huge screenshots
- short captions
- black background

### Layout Variants

Variant A:

```txt
[03]
ReFlow huge title
[large screenshot offset right]
[short text bottom left]
```

Variant B:

```txt
[large screenshot rotated]
                        [caption]
```

Variant C:

```txt
[two overlapping screenshots]
[large title]
```

---

## 9. ProjectTransition

### Purpose

Pause and rhythm.

### Content

```txt
Scroll Down
to Next Project
```

### Layout

- 100vh
- mostly empty
- center or offset title

### Animation

- text scale 0.96 to 1
- opacity 0 to 1
- circular text rotates slowly

---

## 10. SelectedToolsSection

### Purpose

Show tools without a card grid.

### Data Shape

```ts
type ToolItem = {
  number: string;
  title: string;
  description: string;
  image?: string;
  href?: string;
};
```

### Layout

Use large list rows:

```txt
01  MOV to MP4 Converter       Browser-based video conversion utility.
02  QR Code Tool               Lightweight utility for everyday sharing.
```

### CSS

```css
.tool-row {
  display: grid;
  grid-template-columns: 80px 1fr minmax(280px, 420px);
  gap: 32px;
  padding-block: 40px;
  border-top: 1px solid currentColor;
}
```

### Hover

- title moves right 8px
- preview image opacity 0 to 1
- no glow

---

## 11. WritingSection

### Purpose

Show thinking.

### Data Shape

```ts
type WritingItem = {
  number: string;
  title: string;
  topic: string;
  href?: string;
};
```

### Layout

- black background
- large title
- editorial list

---

## 12. ContactSection

### Purpose

Quiet ending.

### Content

```txt
Let’s build calmer software.
```

### Layout

- white background
- huge text
- small links
- no contact form required initially

---

## 13. SplitTextReveal

### Purpose

Reusable text reveal animation.

### Behavior

- split by line or word
- initial: y 40, opacity 0
- animate to: y 0, opacity 1
- stagger: 0.04–0.08

### Reduced Motion

If reduced motion, render static text.

---

## 14. MagneticTextLink

### Purpose

Small hover interaction for links.

### Behavior

- on hover: translateX(6px)
- arrow moves slightly
- underline expands

Do not use strong magnetic cursor effects unless requested.

