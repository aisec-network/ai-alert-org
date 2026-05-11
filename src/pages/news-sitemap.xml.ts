import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { siteConfig } from "@config/site";

export async function GET(_context: APIContext) {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const posts = await getCollection("posts", ({ data }) => {
    if (data.draft) return false;
    return data.pubDate >= twoDaysAgo;
  });

  const urls = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => {
      const pubDate = post.data.pubDate.toISOString();
      const title = post.data.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      return `  <url>
    <loc>${siteConfig.url}/posts/${post.slug}/</loc>
    <news:news>
      <news:publication>
        <news:name>${siteConfig.title}</news:name>
        <news:language>${siteConfig.language}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
