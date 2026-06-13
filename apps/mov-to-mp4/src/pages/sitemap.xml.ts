import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const url = new URL("/", site).href;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } }
  );
};
