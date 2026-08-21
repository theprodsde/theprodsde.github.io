import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/github";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.idea,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="container-prose py-12 sm:py-16">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-lime transition-colors mb-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        All projects
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono mb-3">
          <span>Updated {formatDate(project.updatedAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {project.stars}
          </span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
          {project.name}
        </h1>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.language && (
            <span className="tag font-mono">{project.language}</span>
          )}
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Idea */}
      <section className="mb-8">
        <h2 className="font-display font-bold text-sm text-lime uppercase tracking-widest mb-3">
          The Idea
        </h2>
        <p className="text-text-primary text-lg leading-relaxed">{project.idea}</p>
      </section>

      {/* Why */}
      <section className="mb-10 p-6 bg-surface border border-border rounded-xl">
        <h2 className="font-display font-bold text-sm text-lime uppercase tracking-widest mb-3">
          Why It Was Built
        </h2>
        <p className="text-text-muted leading-relaxed whitespace-pre-wrap">{project.why}</p>
      </section>

      {/* Description if exists */}
      {project.description && (
        <section className="mb-10">
          <h2 className="font-display font-bold text-sm text-text-muted uppercase tracking-widest mb-3">
            Overview
          </h2>
          <p className="text-text-muted leading-relaxed">{project.description}</p>
        </section>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3">
        <Link
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lime"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          View on GitHub
        </Link>
        <Link href="/projects" className="btn-ghost">
          ← Back to projects
        </Link>
      </div>
    </div>
  );
}
