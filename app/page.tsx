import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getProjects } from "@/lib/github";
import { getOssPRs, getRecentCommits } from "@/lib/contributions";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks from "@/components/SocialLinks";

export const revalidate = false;

function fmtDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default async function Home() {
  const [allPosts, allProjects, ossPRs, recentCommits] = await Promise.all([
    getAllPosts(),
    getProjects(),
    getOssPRs(),
    getRecentCommits(),
  ]);

  const latestPosts = allPosts.slice(0, 3);
  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="bg-dot-grid min-h-screen">
      {/* Hero */}
      <section className="container-page pt-16 sm:pt-20 lg:pt-28 pb-14 sm:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime/20 bg-lime/5 text-lime text-xs font-mono mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            The Production Side of Software Engineering
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight text-text-primary mb-5 sm:mb-6 whitespace-nowrap">
            The<span className="text-lime">Prod</span>SDE
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl mb-2">
            You learned how to code.
          </p>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl mb-3 sm:mb-4">
            Nobody taught you how code actually works{" "}
            <span className="text-text-primary font-medium">at work</span>.
          </p>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mb-7 sm:mb-8">
            TheProdSDE covers the gap — the standards, trade-offs, decisions,
            and systems that engineers usually learn only through years of
            production experience. Written by{" "}
            <Link
              href="https://karangehlod.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-lime transition-colors underline underline-offset-4 decoration-border"
            >
              Karan Gehlod
            </Link>
            .
          </p>

          {/* Quote */}
          <blockquote className="mb-7 sm:mb-8 pl-4 border-l-2 border-lime/40">
            <p className="text-sm sm:text-base text-text-muted italic leading-relaxed">
              &ldquo;You start as SDE, you stay SDE. Just the title changes.&rdquo;
            </p>
            <cite className="mt-1.5 block text-xs text-text-muted not-italic font-mono">
              — Karan Gehlod
            </cite>
          </blockquote>

          <SocialLinks />
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="container-page section-gap border-t border-border">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
              Featured Projects
            </h2>
            <Link href="/projects" className="btn-ghost text-xs sm:text-sm">
              All projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Open Source */}
      {(ossPRs.length > 0 || recentCommits.length > 0) && (
        <section className="container-page section-gap border-t border-border">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
              Open Source
            </h2>
            <Link href="/oss" className="btn-ghost text-xs sm:text-sm">
              All contributions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { n: ossPRs.length, label: "PRs merged" },
              {
                n: new Set([...ossPRs.map((p) => p.repoName), ...recentCommits.map((c) => c.repoName)]).size,
                label: "repos",
              },
              { n: recentCommits.length, label: "recent commits" },
            ].map(({ n, label }) => (
              <div key={label} className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface">
                <span className="font-display font-bold text-lg text-lime">{n}</span>
                <span className="text-xs font-mono text-text-muted">{label}</span>
              </div>
            ))}
          </div>

          {/* Top PRs */}
          {ossPRs.length > 0 && (
            <div className="flex flex-col gap-2 mb-6">
              {ossPRs.slice(0, 4).map((pr) => {
                const [owner, repo] = pr.repoName.split("/");
                return (
                  <Link
                    key={pr.id}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group flex items-center gap-3 py-3 px-4 no-underline"
                  >
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-lime/10 border border-lime/20 font-mono text-xs text-lime shrink-0">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" />
                      </svg>
                      merged
                    </span>
                    <p className="flex-1 min-w-0 text-sm text-text-primary font-medium truncate group-hover:text-lime transition-colors">
                      {pr.title}
                    </p>
                    <span className="shrink-0 font-mono text-xs text-text-muted">
                      <span className="text-text-muted">{owner}/</span>
                      <span className="text-text-primary">{repo}</span>
                    </span>
                    <span className="shrink-0 text-xs font-mono text-text-muted hidden sm:block">
                      {fmtDate(pr.mergedAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Commit log terminal */}
          {recentCommits.length > 0 && (
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-ink/60">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 font-mono text-xs text-text-muted">git log --oneline</span>
              </div>
              <div className="divide-y divide-border/40">
                {recentCommits.slice(0, 6).map((c) => (
                  <Link
                    key={c.sha}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface/60 transition-colors group no-underline"
                  >
                    <span className="font-mono text-xs text-lime/70 shrink-0 w-14">{c.sha}</span>
                    <span className="font-mono text-xs text-text-primary flex-1 min-w-0 truncate group-hover:text-lime transition-colors">
                      {c.message}
                    </span>
                    <span className="font-mono text-xs text-text-muted shrink-0 hidden sm:block">
                      {c.repoName.split("/")[1]}
                    </span>
                    <span className="font-mono text-xs text-text-muted shrink-0">
                      {fmtDate(c.pushedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Latest Writing */}
      {latestPosts.length > 0 && (
        <section className="container-page section-gap border-t border-border">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
              Latest Writing
            </h2>
            <Link href="/blog" className="btn-ghost text-xs sm:text-sm">
              All posts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className="card-grid">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {latestPosts.length === 0 && featuredProjects.length === 0 && (
        <section className="container-page section-gap border-t border-border">
          <div className="flex flex-col items-center justify-center py-16 text-text-muted text-sm gap-2">
            <span>Content loading — check back soon.</span>
            <Link href="/blog" className="text-lime hover:underline">Browse writing →</Link>
          </div>
        </section>
      )}

      {/* Quick nav */}
      <section className="container-page section-gap border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: "/blog", title: "Writing", desc: "Production engineering: trade-offs, standards, decisions, and the reasoning behind real engineering work." },
            { href: "/projects", title: "Projects", desc: "Open-source tools and experiments built to solve real problems." },
          ].map(({ href, title, desc }) => (
            <Link key={href} href={href} className="card group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-text-primary group-hover:text-lime transition-colors">
                  {title}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-text-muted group-hover:text-lime transition-colors shrink-0">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
