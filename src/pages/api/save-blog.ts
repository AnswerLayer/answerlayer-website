import type { APIRoute } from 'astro';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Only allow in dev mode
  if (import.meta.env.PROD) {
    return new Response('Not available in production', { status: 403 });
  }

  try {
    const { slug, content } = await request.json();

    if (!slug || typeof content !== 'string') {
      return new Response('Missing slug or content', { status: 400 });
    }

    // Sanitize slug to prevent path traversal
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    const filePath = join(process.cwd(), 'src/content/blog', `${safeSlug}.md`);

    await writeFile(filePath, content, 'utf-8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Save error:', error);
    return new Response('Failed to save', { status: 500 });
  }
};

export const GET: APIRoute = async ({ request }) => {
  // Only allow in dev mode
  if (import.meta.env.PROD) {
    return new Response('Not available in production', { status: 403 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  try {
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
    const filePath = join(process.cwd(), 'src/content/blog', `${safeSlug}.md`);
    const content = await readFile(filePath, 'utf-8');

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
};
