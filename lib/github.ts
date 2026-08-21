import fs from "fs";
import path from "path";
import type { Project, ProjectMeta } from "@/types";

const GITHUB_USER = "TheProdSDE";
const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

function loadMeta(repoName: string): ProjectMeta | null {
  const file = path.join(CONTENT_DIR, `${repoName}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as ProjectMeta;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    const token = process.env.GH_PAT;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=public&sort=updated&per_page=100`,
      { headers, next: { revalidate: false } }
    );
    if (!res.ok) return [];

    const repos: GithubRepo[] = await res.json();

    const projects: Project[] = [];
    for (const repo of repos) {
      const meta = loadMeta(repo.name);
      if (!meta || meta.hideFromSite) continue;

      projects.push({
        name: repo.name,
        slug: repo.name.toLowerCase(),
        description: repo.description ?? "",
        idea: meta.idea,
        why: meta.why,
        tags: meta.tags,
        featured: meta.featured,
        githubUrl: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language ?? undefined,
        updatedAt: repo.updated_at,
      });
    }

    return projects.sort((a, b) =>
      a.featured === b.featured ? 0 : a.featured ? -1 : 1
    );
  } catch {
    return [];
  }
}
