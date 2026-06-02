# SITE_ARCHITECTURE.md — Page Structure and Content Flow

## 1. Overall Structure

The portfolio is a single-page editorial experience.

Order:

```txt
01 Hero
02 About / Positioning
03 Featured Project: ReFlow
04 Project Transition
05 Selected Tools
06 Writing / Thinking
07 Contact
```

The site should feel like scrolling through a premium digital magazine.

---

## 2. Section Rhythm

Use alternating background moods:

```txt
Hero              black
About             white / off-white
ReFlow            black
Transition        white
Selected Tools    off-white
Writing           black
Contact           white
```

This rhythm helps users feel each section change without heavy borders.

---

## 3. Hero Section

### Goal

Create immediate identity.

### Required Content

```txt
SANACODE
Clinical Workflow,
Redesigned.
Physical Therapist / Software Builder / AI Native Creator
```

### Layout

Desktop:

```txt
Top fixed header

[Huge SANACODE title]
[Huge statement below or overlapping]

                               [small role text]
                    [scroll indicator]
```

### Implementation

- `min-height: 100svh`
- black background
- white text
- huge typography
- no CTA button
- optional small circular text
- optional background word

### Avoid

- portrait photo as main hero
- skill badges
- “Welcome to my portfolio”
- multiple buttons

---

## 4. About Section

### Goal

Explain the unique position: clinical work + software building.

### Copy

Primary text:

```txt
I work in rehabilitation and build software around the invisible friction of clinical workflow.
```

Secondary text:

```txt
From records to billing, from daily practice to better tools — Sanacode explores how software can make clinical work calmer and clearer.
```

### Layout

Desktop:

```txt
[small number 02]

                              [Large serif statement]

[small metadata]              [short paragraph]
```

### Visual

- white or off-white background
- black text
- minimal
- mostly typography

---

## 5. Featured Project: ReFlow

### Goal

Make ReFlow memorable.

This is the most important section.

### Core Copy

```txt
ReFlow
Rehabilitation workflow,
from record to billing.
```

Description:

```txt
A clinical workflow system for rehabilitation teams. It connects daily implementation records, patient management, billing categories, and monthly aggregation into one calmer flow.
```

### Layout

This section may be split into several 100vh panels:

```txt
03-A ReFlow introduction
03-B Dashboard screenshot
03-C Patient / record workflow
03-D Billing / monthly aggregation
```

### Panel 03-A

```txt
[03]
REFLOW huge background word

ReFlow
Rehabilitation workflow,
from record to billing.

[large screenshot partially visible]
```

### Panel 03-B

```txt
[large tilted dashboard screenshot]
                       [small caption]
```

Caption:

```txt
Daily visibility without spreadsheet fatigue.
```

### Panel 03-C

```txt
[small label: RECORD]
[large title: From implementation to structure]
[overlapping screenshots]
```

### Panel 03-D

```txt
[large title: Billing aggregation, without losing context]
[monthly table screenshot]
```

### Visual Rules

- black background
- white text
- screenshots large
- use rotations between -4deg and 4deg
- avoid dashboard SaaS clichés

---

## 6. Project Transition Section

### Goal

Create a pause between major sections.

### Copy

```txt
Scroll Down
to Next Project
```

or

```txt
Selected Work
Continues
```

### Layout

- 100vh
- almost empty
- centered or slightly offset typography
- optional circular text

### Motion

- text fades in slowly
- circular text rotates subtly

---

## 7. Selected Tools Section

### Goal

Show breadth without looking like a generic project grid.

### Items

Use 2–4 items:

1. MOV to MP4 Converter
2. QR Code Tool
3. Translation News Site
4. Statistics Tool

### Layout

Use editorial list, not cards.

Desktop:

```txt
[04 Selected Tools]

01  MOV to MP4 Converter        Browser-based video conversion utility.
02  QR Code Tool                Lightweight utility for everyday sharing.
03  Translation News Site       Small publishing system for language learning.
04  Statistics Tool             Clearer statistical output for medical workers.
```

Hover:

- reveal preview image near cursor or right side
- text shifts slightly
- underline expands

### Avoid

- four equal cards
- icons for every item
- tech-stack badges

---

## 8. Writing / Thinking Section

### Goal

Show thinking and personality.

### Themes

- clinical workflow
- AI in daily work
- software for rehabilitation
- tool-making
- learning in public

### Layout

Black background.

```txt
[05 Writing]

Short notes on clinical workflow,
AI tools, and software building.

[large list of 3–5 posts]
```

Example list:

```txt
01  Why clinical software feels heavier than the work itself
02  AI is not magic, but it changes the starting point
03  Rehabilitation records should become structured data
```

---

## 9. Contact Section

### Goal

End quietly.

### Copy

```txt
Let’s build calmer software.
```

Secondary:

```txt
Open to small tools, clinical workflow experiments, and product collaboration.
```

Links:

```txt
GitHub
Threads
Email
```

### Layout

White background.
Huge closing typography.
Minimal links.

---

## 10. Content Priority

The site priority is:

```txt
1. ReFlow
2. Sanacode identity
3. Tools
4. Writing
5. Contact
```

ReFlow must receive the most visual weight.

---

## 11. What Not To Include

Do not include:

- ordinary resume timeline
- long work history
- percentage skill bars
- “HTML / CSS / JS / React” badge grid
- generic “About Me” paragraphs
- stock photos
- fake testimonials
- pricing
- newsletter signup unless explicitly requested later

