import Parser from "rss-parser";
import type { BlogPost } from "@/types";

const FEED_URL = "https://medium.com/feed/@theprodsde";

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractThumbnail(content: string): string | undefined {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

export async function getMediumPosts(): Promise<BlogPost[]> {
  try {
    const parser = new Parser({ timeout: 8000 });
    const feed = await parser.parseURL(FEED_URL);

    return (feed.items ?? []).map((item) => {
      const rawContent = item["content:encoded"] ?? item.content ?? "";
      const text = stripHtml(rawContent);
      return {
        slug: `medium-${encodeURIComponent(item.link ?? item.title ?? "")}`,
        title: item.title ?? "Untitled",
        excerpt: text.slice(0, 200) + (text.length > 200 ? "…" : ""),
        date: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        tags: item.categories ?? [],
        source: "medium" as const,
        url: item.link ?? FEED_URL,
        thumbnail: extractThumbnail(rawContent),
        readingTime: estimateReadingTime(text),
      };
    });
  } catch {
    return [];
  }
}
