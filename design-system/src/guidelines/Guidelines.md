# Answer Layer Design System Guidelines

## Overview

A brutalist design system inspired by technical documentation, patent diagrams, and industrial aesthetics, featuring vintage CRT screen effects with chromatic aberration and pixelated edges.

---

## Design Approval Status (ANS-486)

> **Key Principle**: "Use the aesthetic but make it feel just a little less aggressive, softer."
>
> "Part of what distinguishes this style is the lack of complicated padding and pixel pushing. This makes the code easier to work with and the finished product more consistent when working with agents."

### ✅ Approved Elements

| Category | Element | Notes |
|----------|---------|-------|
| **CRT Effects** | Large text with `.crt-text` | Good balance, subtle |
| **CRT Effects** | Scanline containers (`.crt-screen`, `.crt-container`) | Approved |
| **CRT Effects** | `.crt-glow` on cards | Subtle depth effect |
| **Buttons** | `variant="ghost"` | Preferred - softer |
| **Badges** | `variant="default"` and `variant="filled"` | Approved |
| **Cards** | `variant="technical"` | Preferred - blueprint feel |
| **Components** | CRTHero, CodeBlock, TechnicalDiagram | Core components |
| **Components** | Header menu | Nearly perfect, minimal changes |
| **Visual** | Navy color palette | Approved as-is |
| **Visual** | Circle schematic + ® symbol in hero | Approved |
| **Philosophy** | Minimal padding | Intentional, agent-friendly |

### ❌ Elements to Avoid

| Element | Reason | Alternative |
|---------|--------|-------------|
| `.crt-heading` | Too aggressive | Use `.crt-text` instead |
| `.crt-pixelated` / EDGE EFFECT | Too harsh | Omit or use `.crt-glow` |
| `.crt-interactive`, `.crt-badge` on showcases | Too much flourish | Keep these minimal |
| ALL CAPS everywhere | Overwhelming | Use Title Case or lowercase |
| Background patterns on feature sections | Misses aesthetic | Use solid backgrounds |
| Hard white badges on dark backgrounds | Low contrast | Adjust color for readability |

### Styling Fixes Needed

- GET STARTED button - needs softening

## Visual Aesthetic

### Core Principles

1. **Technical Precision**: Inspired by patent diagrams and engineering documentation
2. **Brutalist Approach**: Direct, functional, without unnecessary decoration
3. **CRT Screen Effects**: Chromatic aberration creating "flipped pixel" vintage display aesthetic
4. **Monospace Foundation**: Technical typography with geometric display headings

### Design Language

- **Flat Design**: Minimal shadows, direct visual hierarchy
- **Bold Borders**: Strong 2-3px borders for structure and containment
- **Grid Systems**: Technical grid patterns for backgrounds
- **Chromatic Aberration**: RGB color separation on text and elements
- **Scanlines**: Subtle horizontal lines mimicking CRT displays

---

## Color System

### Navy Scale (Primary Brand Colors)

```css
--color-navy-50: #eef1fa;   /* Lightest - subtle backgrounds */
--color-navy-100: #dbe1f3;  /* Light text on dark */
--color-navy-200: #aebce5;  /* */
--color-navy-300: #8997d6;  /* CRT chromatic offset (light) */
--color-navy-400: #6275c7;  /* */
--color-navy-500: #4a57b4;  /* */
--color-navy-600: #384393;  /* Primary brand, CRT chromatic offset (dark) */
--color-navy-700: #2a3477;  /* */
--color-navy-800: #1f2858;  /* */
--color-navy-900: #151c3f;  /* Darkest - main text, borders */
--color-navy-950: #0c1129;  /* Near black */
```

### Semantic Colors

```css
--color-white: #ffffff;
--color-background: #f1f4f9;  /* Light blue-gray */
--color-foreground: #0f172a;  /* Dark text */
```

### Usage Guidelines

- **Navy 900**: Primary text, borders, strong emphasis
- **Navy 600**: Interactive elements, primary brand color, CRT effects
- **Navy 300**: Secondary accents, light CRT chromatic offset
- **Background**: Page backgrounds, light sections
- **White**: Cards, contrast sections, inverted elements

---

## Typography

### Font Families

```css
--font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
--font-mono: "Space Mono", "IBM Plex Mono", "Courier New", monospace;
--font-sans: "Inter", system-ui, sans-serif;
```

### Type Scale

- **H1**: 3.5rem (56px) - Display, uppercase, Space Grotesk
- **H2**: 2.5rem (40px) - Title, uppercase, Space Grotesk
- **H3**: 1.75rem (28px) - Section, uppercase, Space Grotesk
- **H4**: 1.25rem (20px) - Subsection, uppercase, Space Grotesk
- **Body**: 1rem (16px) - Space Mono (monospace)
- **Small**: 0.875rem (14px) - Metadata, captions

### Typography Rules

1. All headings use **Space Grotesk** (geometric, bold)
2. All headings are **UPPERCASE**
3. Body text uses **Space Mono** (monospace)
4. Letter spacing: -0.02em to -0.01em for headings
5. Line height: 1.1-1.3 for headings, 1.6 for body

---

## CRT Screen Effects

See [CRT-Effects.md](./CRT-Effects.md) for comprehensive documentation.

### Quick Reference

| Class | Purpose | Use Case |
|-------|---------|----------|
| `.crt-text` | Subtle chromatic aberration | Body text, UI elements |
| `.crt-heading` | Strong chromatic effect | Main titles, hero text |
| `.crt-container` | Scanline overlay | Sections with CRT aesthetic |
| `.crt-screen` | Full CRT effect | Dark sections, hero backgrounds |
| `.crt-glow` | Box chromatic shadow | Cards, containers |
| `.crt-pixelated` | Pixelated edges | Images, diagrams, technical cards |
| `.crt-badge` | Badge enhancement | Badges, labels |
| `.crt-interactive` | Hover effect | Buttons, clickable elements |
| `.crt-glitch` | Animated effect | Special emphasis elements |

---

## Spacing System

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
```

Use consistent spacing for margins, padding, and gaps to maintain visual rhythm.

---

## Border System

```css
--border-thin: 1px;
--border-medium: 2px;
--border-thick: 3px;
--border-heavy: 4px;
```

### Border Patterns

- **Standard**: 2px solid borders for most elements
- **Technical Border**: Double border system (outer light, inner dark)
- **Heavy Emphasis**: 3-4px borders for hero elements

---

## Component Library

### Buttons

```tsx
import { Button } from './components/Button';

<Button variant="primary" size="lg" className="crt-interactive">
  DEPLOY UNITS
</Button>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`  
**Sizes**: `sm`, `md`, `lg`

### Badges

```tsx
import { Badge } from './components/Badge';

<Badge variant="filled" className="crt-badge">ACTIVE</Badge>
```

**Variants**: `default`, `outlined`, `filled`  
**Sizes**: `sm`, `md`

### Cards

```tsx
import { Card } from './components/Card';

<Card variant="technical" className="crt-glow">
  <h4 className="crt-heading">TITLE</h4>
  <p>Content with CRT effects.</p>
</Card>
```

**Variants**: `default`, `bordered`, `technical`

### CRT Hero

```tsx
import { CRTHero } from './components/CRTHero';

<CRTHero
  badge="VERSION / 2.0"
  title="NUCLEUS"
  subtitle="EXPERIMENTAL LAB"
  description="Technical infrastructure description."
  primaryCta={{ label: 'ACTION', onClick: () => {} }}
  circularText="CIRCULAR BADGE TEXT"
/>
```

---

## Layout Patterns

### Container

```tsx
<div className="container mx-auto px-6">
  {/* Content */}
</div>
```

- Max width: 1400px (1600px on 2xl screens)
- Horizontal padding: 1.5rem (24px)
- Centered with auto margins

### Grid Layouts

```tsx
<div className="grid md:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Section Patterns

```tsx
<Section background="light" pattern border>
  <div className="container mx-auto px-6 crt-container">
    <SectionHeader
      subtitle="CATEGORY"
      title="SECTION TITLE"
      description="Section description."
    />
    {/* Section content */}
  </div>
</Section>
```

---

## Accessibility

- All interactive elements have sufficient color contrast (WCAG AA)
- Focus states clearly visible with navy-600 outlines
- Semantic HTML for screen readers
- ARIA labels where appropriate
- Keyboard navigation support

---

## Performance Guidelines

1. **CSS-Only Effects**: All CRT effects use pure CSS (no JavaScript)
2. **GPU Acceleration**: Interactive elements use `transform: translateZ(0)`
3. **Font Loading**: Async loading via Google Fonts with fallbacks
4. **Response Time Target**: <500ms for all visual effects
5. **Bundle Size**: Minimal dependencies, efficient Tailwind purging

---

## Development Workflow

### Adding CRT Effects

1. Start with base component
2. Add appropriate CRT class for enhancement
3. Test on multiple screen sizes
4. Verify performance (should render <500ms)
5. Ensure accessibility not impacted

### Example

```tsx
// Base component
<h1>TITLE</h1>

// Enhanced with CRT effect
<h1 className="crt-heading">TITLE</h1>
```

---

## File Structure

```
/components
  /Badge.tsx
  /Button.tsx
  /Card.tsx
  /CRTHero.tsx          # CRT-styled hero component
  /Header.tsx
  /Hero.tsx
  /Section.tsx
  /TechnicalDiagram.tsx
  ...

/styles
  /globals.css          # All CRT effects defined here

/guidelines
  /Guidelines.md        # This file
  /CRT-Effects.md       # Detailed CRT documentation
```

---

## Best Practices

### Do's

✅ Use CRT effects strategically for emphasis  
✅ Combine effects thoughtfully (e.g., `.crt-glow` + `.crt-interactive`)  
✅ Maintain navy color palette consistency  
✅ Test performance on lower-end devices  
✅ Use Space Grotesk for all headings  
✅ Keep scanlines subtle (opacity: 0.03)

### Don'ts

❌ Overuse animated effects (`.crt-glitch`)  
❌ Apply heavy effects to body text  
❌ Mix too many CRT classes on one element  
❌ Use CRT effects without performance testing  
❌ Ignore accessibility considerations  
❌ Add custom fonts beyond Space Grotesk/Space Mono

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Effects gracefully degrade on older browsers.

---

## Resources

- [CRT Effects Guide](./CRT-Effects.md) - Comprehensive CRT effect documentation
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)
- [Space Mono Font](https://fonts.google.com/specimen/Space+Mono)

---

## Version History

- **v2.0** - Added CRT screen effects, Space Grotesk typography
- **v1.0** - Initial brutalist design system with AnswerLayer colors
