import Parser from "rss-parser";
import type { BlogPost } from "@/types";
import { estimateReadingTime, stripHtml, truncate } from "./text";

const FEED_URL = "https://medium.com/feed/@theprodsde";

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
        excerpt: truncate(text, 200),
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
