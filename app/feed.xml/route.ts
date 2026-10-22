import { getDirectPosts } from "@/lib/posts";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);
}

export function GET() {
  const items = getDirectPosts().map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(post.url)}</link>
      <guid isPermaLink="true">${absoluteUrl(post.url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${SITE_NAME} Writing</title>
  <link>${absoluteUrl("/blog")}</link>
  <description>Production engineering articles by Karan Gehlod.</description>
  <language>en</language>${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
