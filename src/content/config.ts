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

export const collections = {
  discover: discoverCollection,
};
