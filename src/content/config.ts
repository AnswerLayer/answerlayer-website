import { defineCollection, z } from 'astro:content';

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
  type: 'content',
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
  type: 'content',
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

export const collections = {
  discover: discoverCollection,
  blog: blogCollection,
};
