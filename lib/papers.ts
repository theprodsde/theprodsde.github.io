import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Paper } from "@/types";

const PAPERS_DIR = path.join(process.cwd(), "content", "papers");

export function getPapers(): Paper[] {
  if (!fs.existsSync(PAPERS_DIR)) return [];

  return fs
    .readdirSync(PAPERS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(PAPERS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? new Date().toISOString(),
        venue: data.venue,
        url: data.url,
        abstract: data.abstract ?? "",
        tags: data.tags ?? [],
      } satisfies Paper;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
