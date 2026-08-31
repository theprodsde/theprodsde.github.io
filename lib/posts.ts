import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@/types";
import { getMediumPosts } from "./medium";
import { getDevtoPosts } from "./devto";
import { estimateReadingTime, truncate } from "./text";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getDirectPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? truncate(content, 200),
        date: data.date ?? new Date().toISOString(),
        tags: data.tags ?? [],
        source: "direct" as const,
        url: `/blog/${slug}`,
        thumbnail: data.thumbnail,
        readingTime: estimateReadingTime(content),
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Registry of post sources — add a new source here without touching the
// aggregation logic below (open/closed principle).
const sources: Array<() => Promise<BlogPost[]>> = [
  getMediumPosts,
  getDevtoPosts,
  async () => getDirectPosts(),
];

export async function getAllPosts(): Promise<BlogPost[]> {
  const results = await Promise.all(sources.map((fetchSource) => fetchSource()));

  return results
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
