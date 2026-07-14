import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Discover Collection Schema
 *
 * Each markdown file represents a node in the discovery wizard.
 * The content body is rendered as markdown for the node's main text.
 *
 * Frontmatter fields:
 * - title: Display title for the node
 * - options: Navigation buttons with labels and target node IDs
 * - external: Whether this node redirects to an external URL
 * - externalUrl: The URL to redirect to (only used when external: true)
 */
const discoverCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/discover' }),
  schema: z.object({
    title: z.string(),
    options: z.array(z.object({
      label: z.string(),
      target: z.string(),
    })).default([]),
    external: z.boolean().default(false),
    externalUrl: z.string().nullable().default(null),
  }),
});

/**
 * Blog Collection Schema
 *
 * Each markdown file represents a blog post.
 * The content body is rendered as markdown for the post content.
 *
 * Frontmatter fields:
 * - title: Post title
 * - description: Short description for SEO and previews
 * - publishedAt: Publication date
 * - updatedAt: Last update date (optional)
 * - author: Author name
 * - tags: Array of topic tags
 * - featured: Whether to highlight on blog index
 * - draft: If true, hidden from production builds
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    author: z.string().default('AnswerLayer Team'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/**
 * Docs Collection Schema
 *
 * Each markdown file represents a documentation page.
 * Rendered at /docs/{slug}.
 *
 * Frontmatter fields:
 * - title: Page title
 * - description: Short description for SEO
 * - order: Sort order within the sidebar (lower = higher)
 * - section: Grouping label in the sidebar
 */
const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    section: z.string().default('General'),
  }),
});

/**
 * Home Collection Schema
 *
 * A single data entry (`copy.yaml`) holding all editable copy for the
 * marketing home page. Layout lives in src/pages/index.astro; text lives here.
 */
const chip = z.array(z.string());
const sectionHead = { eyebrow: z.string(), heading: z.string() };

const homeCollection = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home' }),
  schema: z.object({
    meta: z.object({ title: z.string() }),
    ctas: z.object({ primary: z.string(), secondary: z.string() }),
    hero: z.object({ ...sectionHead, sub: z.string() }),
    schematic: z.object({
      topChips: chip,
      contractLabel: z.string(),
      centerTitle: z.string(),
      centerCaption: z.string(),
      inPlaceLabel: z.string(),
      bottomChips: chip,
    }),
    embed: z.object({
      ...sectionHead,
      sub: z.string(),
      cards: z.array(z.object({ title: z.string(), body: z.string() })),
      ctaLabel: z.string(),
    }),
    semanticLayer: z.object({
      ...sectionHead,
      sub: z.string(),
      primitives: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    cloud: z.object({
      ...sectionHead,
      sub: z.string(),
      containerLabel: z.string(),
      stackTitle: z.string(),
      stackCaption: z.string(),
      guarantees: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    pricing: z.object({
      ...sectionHead,
      platform: z.object({ label: z.string(), price: z.string(), unit: z.string(), body: z.string() }),
      users: z.object({ label: z.string(), price: z.string(), unit: z.string(), body: z.string() }),
      perkLabel: z.string(),
      perkBody: z.string(),
    }),
    finalCta: z.object({ heading: z.string() }),
  }),
});

export const collections = {
  discover: discoverCollection,
  blog: blogCollection,
  docs: docsCollection,
  home: homeCollection,
};
