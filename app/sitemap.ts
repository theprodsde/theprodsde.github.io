import type { MetadataRoute } from "next";
import { getDirectPosts } from "@/lib/posts";
import { getProjects } from "@/lib/github";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = ["/", "/blog", "/projects", "/oss"].map((pathname) => ({
    url: absoluteUrl(pathname),
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : 0.7,
  }));

  const posts = getDirectPosts().map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: post.modified ?? post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projects = (await getProjects()).map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));

  return [...staticPages, ...posts, ...projects];
}
