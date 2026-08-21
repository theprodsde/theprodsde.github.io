import type { BlogPost } from "@/types";

const BASE = "https://dev.to/api";
const USERNAME = "theprodsde";

interface DevtoArticle {
  id: number;
  title: string;
  description: string;
  published_at: string;
  tag_list: string[];
  url: string;
  cover_image?: string;
  reading_time_minutes: number;
  slug: string;
}

export async function getDevtoPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/articles?username=${USERNAME}&per_page=30`, {
      next: { revalidate: false },
    });
    if (!res.ok) return [];
    const articles: DevtoArticle[] = await res.json();

    return articles.map((a) => ({
      slug: `devto-${a.slug}`,
      title: a.title,
      excerpt: a.description ?? "",
      date: a.published_at,
      tags: a.tag_list,
      source: "devto" as const,
      url: a.url,
      thumbnail: a.cover_image ?? undefined,
      readingTime: a.reading_time_minutes,
    }));
  } catch {
    return [];
  }
}
