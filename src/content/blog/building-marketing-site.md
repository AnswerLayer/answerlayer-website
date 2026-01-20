---
title: "A Data Scientist's Guide to Building a Marketing Website"
description: "How I built AnswerLayer's marketing site with zero design experience, 8 parallel AI agents, and a philosophy of value over hype."
publishedAt: 2026-01-19
author: "Josh Harris"
tags: ["open-source", "design", "astro", "ai-tools", "side-project"]
featured: true
draft: true
---

I'm a data scientist. Before this project, I had never designed anything. No Figma experience. No understanding of what a "design system" even meant. AnswerLayer's marketing website is now open source—built from scratch as a side project over the past few weeks.

## The Relaunch

This isn't our first marketing site. Previously, the marketing pages lived in the same repository as our product frontend. It worked, but it created coupling we didn't want—especially as we started supporting on-premise deployments.

Splitting out the marketing site was a technical necessity. But it was also an opportunity to rebuild with intention.

## Value Over Hype

Most SaaS landing pages look the same. Hypercrisp gradients. Floating UI mockups. That particular shade of purple-to-blue. There's nothing wrong with this aesthetic, but it wasn't what I wanted for AnswerLayer.

The visual direction I landed on references CRT monitors—subtle chromatic aberration, faint scanlines, a slight glow. It's not retro for retro's sake. The effect is meant to feel more human than today's pixel-perfect screens. It references older, more established industries that aren't inclined to chase trends, but look for quality.

The effects are implemented in CSS—no JavaScript animations, no performance cost. A light but distinctive touch.

## Learning Design as an Engineer

My background is machine learning and data science. I've spent years writing Python, building models, architecting data pipelines. Design was foreign territory.

Figma Make changed that. The AI-assisted features made it possible to produce an actual design system without prior experience. I learned what a design system *is*—the color scales, the typography hierarchy, the component patterns. I produced one from scratch: a navy palette, Space Grotesk for headings, a consistent spacing system. The barrier to "good enough" is now low for technical founders willing to learn.

## Why Astro

For a marketing site, I wanted static-first. No hydration unless absolutely necessary. Fast loads. Simple architecture.

Astro delivers this perfectly. Pages are static HTML by default. You opt into JavaScript only where needed—what they call "islands architecture." Our only interactive component is an SVG visualization that responds to cursor movement.

The content collections feature also fit the discover wizard well.

## The Discover Wizard

Instead of a traditional landing page, the AnswerLayer site uses a branching content tree. Click through from the homepage and you're invited to self-select your journey: are you here to build, to explore, or to get in touch?

This solves several problems at once:

**Multiple audiences.** Builders want technical details. Buyers want business value. Curious visitors want to understand what this even is. A single landing page can't serve all of them well.

**Content flexibility.** Each node in the tree is a standalone page. I can link to specific pages from blog posts, social content, or ads—dropping visitors exactly where they need to be.

**Modular maintainability.** Each piece of content only influences nearby nodes. It's a content map that simplifies adding new ideas while keeping everything consistent. Change one node and the ripple effects are local, not global.

The wizard is 72 markdown files forming a navigable tree. Each file has YAML frontmatter defining the title and the options (buttons linking to other nodes). The body is the page content. Simple, version-controlled, diffable.

## The Vibecoded CMS

72 markdown files are hard to reason about without visualization. So I built a tool.

The tree-editor is a small Express server that reads all the discover content, presents it as JSON, and provides a visual interface for editing. It lives in the `/tools/` directory of the repo.

Building it was part of a broader workflow I've developed: running up to 8 parallel AI coding agent streams. While one agent works on component styling, another builds tooling, another writes content. The tree-editor was one of those streams—spun up when I realized I needed to see the content map to make sense of it. Simple, purpose-built, and exactly what I needed.

## Why Open Source

Three reasons:

**Give back.** This project wouldn't exist without open source tools—Astro, Tailwind, Express, and the countless packages they depend on. Open sourcing the site is a small way to contribute back.

**Show how we build.** If you're considering working with AnswerLayer, or joining the team, the marketing repo shows how we think. The code is the portfolio.

**Force good practices.** Knowing the code is public creates healthy pressure to keep things clean. No embarrassing hacks. No secrets in the repo. The public eye is a form of accountability.

---

The repo is at [github.com/answerlayer/answerlayer-website](https://github.com/answerlayer/answerlayer-website). The discover wizard pattern, the CRT effects, and the tree-editor are all there if any of it is useful for your own projects.
