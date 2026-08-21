import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "@/types";
import { getMediumPosts } from "./medium";
import { getDevtoPosts } from "./devto";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function estimateReadingTime(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}

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
        excerpt: data.excerpt ?? content.slice(0, 200) + "…",
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

export async function getAllPosts(): Promise<BlogPost[]> {
  const [medium, devto, direct] = await Promise.all([
    getMediumPosts(),
    getDevtoPosts(),
    Promise.resolve(getDirectPosts()),
  ]);

  return [...medium, ...devto, ...direct].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
