# CRT Screen Effects Guide

## Overview

The CRT (Cathode Ray Tube) screen effects system creates chromatic aberration and pixelated edge effects inspired by vintage displays. These effects are achieved using pure CSS for maximum performance (<500ms response times) and maintain the AnswerLayer navy color palette.

## Key Features

- **Chromatic Aberration**: RGB color separation creating "flipped pixel" edges
- **Scanline Overlays**: Subtle horizontal lines mimicking CRT screens
- **Screen Glow**: Soft box-shadow effects with navy color separation
- **Pixelated Edges**: Color gradients on container borders
- **Performance Optimized**: Pure CSS with GPU acceleration
- **Lightweight**: No JavaScript or image dependencies

## Available CSS Classes

### Text Effects

#### `.crt-text`
Subtle chromatic aberration for body text and UI elements.

```tsx
<p className="crt-text">Standard text with subtle chromatic effect</p>
```

**Effect:**
- Navy blue left offset: `rgba(56, 67, 147, 0.5)`
- Light navy right offset: `rgba(137, 151, 214, 0.5)`
- Subtle glow at 3px

#### `.crt-heading`
Enhanced chromatic aberration for headings and titles.

```tsx
<h1 className="crt-heading">EXPERIMENTAL LAB</h1>
```

**Effect:**
- Stronger color separation (2px offsets)
- Multi-layer glow (6px and 12px)
- Increased contrast and brightness

#### `.crt-glitch`
Animated pulsing chromatic aberration effect.

```tsx
<h2 className="crt-glitch">GLITCH TEXT</h2>
```

**Effect:**
- 3-second ease-in-out animation
- Alternating chromatic intensity

---

### Container Effects

#### `.crt-container`
Adds subtle scanline overlay to a container.

```tsx
<div className="crt-container">
  {/* Content with scanlines */}
</div>
```

**Effect:**
- Horizontal scanlines at 2px intervals
- Opacity: 0.03 for subtlety
- Pointer-events: none to avoid interaction issues

#### `.crt-screen`
Full CRT screen effect with texture and scanlines.

```tsx
<div className="crt-screen p-8 bg-navy-900 text-white">
  {/* Content appears on CRT screen */}
</div>
```

**Effect:**
- Combined horizontal and vertical scanlines
- Screen texture with navy tint
- Background gradient overlay

---

### Box Effects

#### `.crt-glow`
Box-shadow chromatic aberration for cards and containers.

```tsx
<Card className="crt-glow">
  <h4>CRT Glow Card</h4>
</Card>
```

**Effect:**
- Left shadow: `rgba(56, 67, 147, 0.3)`
- Right shadow: `rgba(137, 151, 214, 0.3)`
- Diffuse glow at 10px

#### `.crt-pixelated`
Pixelated edge effect for images and diagrams.

```tsx
<div className="crt-pixelated">
  {/* Content with pixelated edges */}
</div>
```

**Effect:**
- Gradient borders with navy color separation
- Image rendering: crisp-edges
- Overlay blend mode

#### `.crt-badge`
Enhanced badge styling with chromatic effect.

```tsx
<Badge className="crt-badge">ENHANCED</Badge>
```

**Effect:**
- Text-shadow with navy offset
- Box-shadow with color separation

---

### Interactive Effects

#### `.crt-interactive`
Performance-optimized hover effects.

```tsx
<Button className="crt-interactive">DEPLOY UNITS</Button>
```

**Effect:**
- Smooth filter transitions (200ms)
- Increased contrast on hover
- GPU-accelerated transforms

---

## Typography System

The design system now uses two primary font families:

### Display Font (Headings)
```css
--font-display: "Space Grotesk", "Inter", system-ui, -apple-system, sans-serif;
```

**Usage:** All headings (h1-h6) automatically use Space Grotesk for the bold, geometric aesthetic similar to the reference image.

### Monospace Font (Body Text)
```css
--font-mono: "Space Mono", "IBM Plex Mono", "Courier New", monospace;
```

**Usage:** Body text, code blocks, and technical metadata.

---

## CRT Variables

Customize the effect intensity using CSS variables:

```css
--crt-aberration: 2px;          /* Chromatic offset distance */
--crt-glow: 4px;                /* Glow blur radius */
--crt-scanline-opacity: 0.03;   /* Scanline visibility */
```

---

## Usage Examples

### Hero Section with CRT Effect

```tsx
import { CRTHero } from './components/CRTHero';

<CRTHero
  badge="ENGINEERING OFFICE / V2.0"
  title="NUCLEUS"
  subtitle="EXPERIMENTAL LAB / NEW YORK CITY"
  description="Deploy automated manufacturing units across national grid."
  primaryCta={{ label: 'DEPLOY UNITS', onClick: () => {} }}
  circularText="NUCLEUS ENGINEERING OFFICE • REINDUSTRIALIZE"
/>
```

### Card Grid with Mixed Effects

```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div className="border-2 border-navy-900 p-6 crt-glow crt-interactive">
    <h4 className="crt-text">CRT GLOW CARD</h4>
  </div>

  <div className="border-2 border-navy-900 p-6 bg-navy-900 text-white crt-pixelated">
    <h4 className="crt-heading">EDGE EFFECT</h4>
  </div>

  <div className="border-2 border-navy-600 p-6">
    <h4 className="crt-glitch">GLITCH TEXT</h4>
  </div>
</div>
```

### Section with Screen Effect

```tsx
<Section background="white" border>
  <div className="container mx-auto px-6 crt-container">
    <h2 className="crt-heading">SYSTEM STATUS</h2>
    <p className="crt-text">All systems operational.</p>
  </div>
</Section>
```

---

## Performance Considerations

All CRT effects are optimized for performance:

1. **Pure CSS**: No JavaScript calculations or animations
2. **GPU Acceleration**: Uses `transform: translateZ(0)` for hardware acceleration
3. **Minimal Repaints**: Effects use compositing-friendly properties
4. **Lazy Loading**: Font files loaded asynchronously via Google Fonts
5. **Response Times**: All effects render in <500ms

### Best Practices

- Use `.crt-heading` sparingly on main titles only
- Apply `.crt-interactive` to buttons and clickable elements
- Combine effects carefully to avoid visual overload
- Test on lower-end devices for performance validation

---

## Color Palette Integration

The CRT effects use the existing AnswerLayer navy color palette:

- **Navy 600** (`#384393`): Primary chromatic offset color
- **Navy 300** (`#8997d6`): Secondary chromatic offset color
- **Navy 900** (`#151c3f`): Dark backgrounds for CRT screens
- **Navy 100** (`#dbe1f3`): Light text on dark CRT backgrounds

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Graceful degradation on older browsers (effects simply won't show).

---

## Future Enhancements

Potential additions while maintaining performance:

1. Adjustable chromatic offset intensity
2. Optional VHS tape distortion effects
3. Customizable scanline density
4. CRT color temperature variations
5. Bloom/glow intensity controls
