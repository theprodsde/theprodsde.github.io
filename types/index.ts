export type BlogSource = "medium" | "devto" | "direct";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  source: BlogSource;
  url: string;
  thumbnail?: string;
  readingTime?: number;
  content?: string;
}

export interface Project {
  name: string;
  slug: string;
  description: string;
  idea: string;
  why: string;
  tags: string[];
  featured: boolean;
  githubUrl: string;
  stars: number;
  language?: string;
  updatedAt: string;
  docsUrl?: string;
}

export interface ProjectMeta {
  idea: string;
  why: string;
  tags: string[];
  featured: boolean;
  hideFromSite: boolean;
  docsUrl?: string;
}

export interface Paper {
  slug: string;
  title: string;
  date: string;
  venue?: string;
  url?: string;
  abstract: string;
  tags: string[];
}
