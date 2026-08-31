import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getProjects } from "@/lib/github";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks from "@/components/SocialLinks";

export const revalidate = false;

export default async function Home() {
  const [allPosts, allProjects] = await Promise.all([getAllPosts(), getProjects()]);

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
