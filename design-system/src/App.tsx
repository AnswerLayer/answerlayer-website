import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CRTHero } from "./components/CRTHero";
import { Section, SectionHeader } from "./components/Section";
import { FeatureGrid } from "./components/FeatureGrid";
import { Card } from "./components/Card";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { Input, TextArea } from "./components/Input";
import { TechnicalDiagram } from "./components/TechnicalDiagram";
import { Stats } from "./components/Stats";
import { CodeBlock } from "./components/CodeBlock";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* New CRT-styled Hero */}
      <CRTHero
        badge="ENGINEERING OFFICE / V2.0"
        title="NUCLEUS"
        subtitle="EXPERIMENTAL LAB / NEW YORK CITY"
        description="Deploy automated manufacturing units across national grid. Technical infrastructure for precision engineering and experimental autonomous development."
        primaryCta={{
          label: "DEPLOY UNITS",
          onClick: () => {},
        }}
        secondaryCta={{
          label: "VIEW SPECS",
          onClick: () => {},
        }}
        circularText="NUCLEUS ENGINEERING OFFICE • REINDUSTRIALIZE"
      />

      {/* Stats Section */}
      <Section background="light" border>
        <div className="container mx-auto px-6">
          <Stats
            variant="horizontal"
            stats={[
              { value: "99.9", label: "UPTIME", unit: "%" },
              { value: "<50", label: "MS LATENCY", unit: "MS" },
              { value: "1M+", label: "REQUESTS/DAY" },
              { value: "24/7", label: "SUPPORT" },
            ]}
          />
        </div>
      </Section>

      {/* CRT Effects Showcase */}
      <Section background="white" border>
        <div className="container mx-auto px-6 crt-container">
          <SectionHeader
            subtitle="VISUAL EFFECTS"
            title="CRT SCREEN AESTHETICS"
            description="Chromatic aberration and pixelated edge effects inspired by vintage CRT displays."
          />

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="mb-4 crt-heading">
                CRT HEADING EFFECT
              </h3>
              <p className="mb-4">
                Headings feature enhanced chromatic aberration
                with navy blue color separation, creating the
                illusion of individual pixels on CRT screen
                edges.
              </p>
              <div className="space-y-3">
                <div className="crt-text text-2xl">
                  LARGE TEXT WITH CRT
                </div>
                <div className="crt-text">
                  Standard text with subtle chromatic effect
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4">CRT CONTAINER</h3>
              <div className="crt-screen p-8 bg-navy-900 text-white rounded-sm">
                <div className="crt-heading text-2xl mb-4">
                  EXPERIMENTAL LAB
                </div>
                <p className="crt-text mb-4">
                  This container features scanline overlays and
                  subtle screen texture, mimicking an old CRT
                  monitor display.
                </p>
                <div className="flex gap-3">
                  <Badge
                    variant="outlined"
                    className="crt-badge border-white text-white"
                  >
                    ACTIVE
                  </Badge>
                  <Badge
                    variant="outlined"
                    className="crt-badge border-white text-white"
                  >
                    OPERATIONAL
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-navy-900 p-6 crt-glow crt-interactive">
              <Badge
                variant="filled"
                className="mb-4 crt-badge"
              >
                ENHANCED
              </Badge>
              <h4 className="mb-2 crt-text">CRT GLOW CARD</h4>
              <p className="text-sm text-gray-600">
                Subtle chromatic box-shadow creates depth and
                screen glow effect.
              </p>
            </div>

            <div className="border-2 border-navy-900 p-6 bg-navy-900 text-white crt-pixelated">
              <Badge
                variant="outlined"
                className="mb-4 crt-badge border-white text-white"
              >
                PIXELATED
              </Badge>
              <h4 className="mb-2 crt-heading">EDGE EFFECT</h4>
              <p className="text-sm text-navy-100">
                Pixelated edges with color gradients on
                container borders.
              </p>
            </div>

            <div className="border-2 border-navy-600 p-6">
              <Badge variant="filled" className="mb-4">
                ANIMATED
              </Badge>
              <h4 className="mb-2 crt-glitch">GLITCH TEXT</h4>
              <p className="text-sm text-gray-600">
                Subtle pulsing chromatic aberration animation.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section background="light" pattern border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="CAPABILITIES"
            title="CORE FEATURES"
            description="Built for performance, scalability, and developer experience."
            align="center"
          />
          <FeatureGrid
            columns={3}
            features={[
              {
                badge: "PERFORMANCE",
                title: "OPTIMIZED",
                description:
                  "Lightning-fast load times with optimized assets and minimal dependencies.",
              },
              {
                badge: "SCALABLE",
                title: "INFRASTRUCTURE",
                description:
                  "Scales seamlessly from prototype to production-grade applications.",
              },
              {
                badge: "DEVELOPER",
                title: "EXPERIENCE",
                description:
                  "Clean APIs and comprehensive documentation for rapid development.",
              },
              {
                badge: "RESPONSIVE",
                title: "DESIGN",
                description:
                  "Mobile-first approach ensuring perfect display on any device.",
              },
              {
                badge: "ACCESSIBLE",
                title: "STANDARDS",
                description:
                  "WCAG compliant components ensuring accessibility for all users.",
              },
              {
                badge: "CUSTOMIZABLE",
                title: "THEMING",
                description:
                  "Extensive design tokens for complete visual customization.",
              },
            ]}
          />
        </div>
      </Section>

      {/* Technical Diagram */}
      <Section background="white" border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="ARCHITECTURE"
            title="SYSTEM OVERVIEW"
            description="Visual representation of the technical infrastructure and data flow."
          />
          <TechnicalDiagram
            title="Client/Server Architecture"
            nodes={[
              { id: "client", label: "CLIENT", type: "box" },
              { id: "api", label: "API LAYER", type: "box" },
              { id: "cache", label: "CACHE", type: "circle" },
              { id: "db", label: "DATABASE", type: "database" },
            ]}
            connections={[
              {
                from: "CLIENT",
                to: "API LAYER",
                label: "HTTPS",
              },
              {
                from: "API LAYER",
                to: "CACHE",
                label: "Redis",
              },
              {
                from: "API LAYER",
                to: "DATABASE",
                label: "PostgreSQL",
              },
            ]}
          />
        </div>
      </Section>

      {/* Code Example */}
      <Section background="light" border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="IMPLEMENTATION"
            title="CODE EXAMPLES"
            description="Clean, well-documented code for rapid integration."
          />
          <CodeBlock
            title="example.tsx"
            language="typescript"
            code={`import { Button } from './components/Button';
import { Card } from './components/Card';

export function Example() {
  return (
    <Card variant="technical">
      <h3>HELLO WORLD</h3>
      <p>Technical brutalist design system.</p>
      <Button variant="primary">
        GET STARTED
      </Button>
    </Card>
  );
}`}
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="white" border>
        <div className="container mx-auto px-6">
          <CTA
            variant="bordered"
            title="READY TO BUILD?"
            description="Start using the Answer Layer design system in your next project. Comprehensive documentation and support available."
            primaryButton={{
              label: "GET STARTED",
              onClick: () => {},
            }}
            secondaryButton={{
              label: "READ DOCS",
              onClick: () => {},
            }}
          />
        </div>
      </Section>

      {/* Typography Showcase */}
      <Section background="light" border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="TYPOGRAPHY"
            title="TYPE SYSTEM"
            description="Monospace-first typography for technical precision."
          />
          <div className="space-y-8">
            <div>
              <h1>HEADING 1 - DISPLAY</h1>
            </div>
            <div>
              <h2>HEADING 2 - TITLE</h2>
            </div>
            <div>
              <h3>HEADING 3 - SECTION</h3>
            </div>
            <div>
              <h4>HEADING 4 - SUBSECTION</h4>
            </div>
            <div>
              <p className="text-lg">
                Body Text Large - This is a sample of larger
                body text used for important paragraphs and
                lead-ins. The monospace font creates a distinct
                technical aesthetic while maintaining
                readability across different screen sizes and
                device types.
              </p>
            </div>
            <div>
              <p>
                Body Text Regular - Standard paragraph text for
                general content. The consistent letter spacing
                and monospace design ensures clear communication
                of technical information and documentation while
                maintaining a strong visual identity that
                distinguishes your brand.
              </p>
            </div>
            <div>
              <small>SMALL TEXT - METADATA AND CAPTIONS</small>
            </div>
          </div>
        </div>
      </Section>

      {/* Color Palette */}
      <Section background="white" border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="COLORS"
            title="COLOR SYSTEM"
            description="Navy-based palette with flat, direct design approach."
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="h-32 bg-navy-900 border-2 border-navy-900 mb-3"></div>
              <div className="uppercase text-sm tracking-wide">
                NAVY 900
              </div>
              <div className="text-xs text-gray-500">
                #151c3f
              </div>
            </div>
            <div>
              <div className="h-32 bg-navy-600 border-2 border-navy-900 mb-3"></div>
              <div className="uppercase text-sm tracking-wide">
                NAVY 600
              </div>
              <div className="text-xs text-gray-500">
                #384393
              </div>
            </div>
            <div>
              <div className="h-32 bg-navy-300 border-2 border-navy-900 mb-3"></div>
              <div className="uppercase text-sm tracking-wide">
                NAVY 300
              </div>
              <div className="text-xs text-gray-500">
                #8997d6
              </div>
            </div>
            <div>
              <div className="h-32 bg-white border-2 border-navy-900 mb-3"></div>
              <div className="uppercase text-sm tracking-wide">
                WHITE
              </div>
              <div className="text-xs text-gray-500">
                #FFFFFF
              </div>
            </div>
            <div>
              <div className="h-32 bg-background border-2 border-navy-900 mb-3"></div>
              <div className="uppercase text-sm tracking-wide">
                BACKGROUND
              </div>
              <div className="text-xs text-gray-500">
                #f1f4f9
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Component Showcase */}
      <Section background="white" border>
        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="COMPONENTS"
            title="DESIGN SYSTEM"
            description="A comprehensive collection of reusable components built with React and Tailwind CSS."
          />

          {/* Buttons with CRT effect */}
          <div className="mb-16">
            <h3 className="mb-6 crt-heading">BUTTONS</h3>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                variant="primary"
                className="crt-interactive"
              >
                PRIMARY
              </Button>
              <Button
                variant="secondary"
                className="crt-interactive"
              >
                SECONDARY
              </Button>
              <Button
                variant="outline"
                className="crt-interactive"
              >
                OUTLINE
              </Button>
              <Button
                variant="ghost"
                className="crt-interactive"
              >
                GHOST
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="sm"
                className="crt-interactive"
              >
                SMALL
              </Button>
              <Button
                variant="primary"
                size="md"
                className="crt-interactive"
              >
                MEDIUM
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="crt-interactive"
              >
                LARGE
              </Button>
            </div>
          </div>

          {/* Badges with CRT effect */}
          <div className="mb-16">
            <h3 className="mb-6 crt-heading">BADGES</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default" className="crt-badge">
                DEFAULT
              </Badge>
              <Badge variant="outlined" className="crt-badge">
                OUTLINED
              </Badge>
              <Badge variant="filled" className="crt-badge">
                FILLED
              </Badge>
              <Badge
                variant="default"
                size="sm"
                className="crt-badge"
              >
                SMALL
              </Badge>
              <Badge
                variant="filled"
                size="md"
                className="crt-badge"
              >
                MEDIUM
              </Badge>
            </div>
          </div>

          {/* Cards with CRT effects */}
          <div className="mb-16">
            <h3 className="mb-6 crt-heading">CARDS</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                variant="default"
                className="crt-interactive"
              >
                <h4 className="mb-2 crt-text">DEFAULT CARD</h4>
                <p className="text-gray-600">
                  Simple border styling for basic containers.
                </p>
              </Card>
              <Card variant="bordered" className="crt-glow">
                <h4 className="mb-2 crt-text">BORDERED CARD</h4>
                <p className="text-gray-600">
                  Stronger border for emphasis and hierarchy.
                </p>
              </Card>
              <Card
                variant="technical"
                className="crt-pixelated"
              >
                <h4 className="mb-2 crt-heading">
                  TECHNICAL CARD
                </h4>
                <p className="text-gray-600">
                  Double border system inspired by blueprints.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}