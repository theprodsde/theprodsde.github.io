import type { Metadata } from "next";
import Link from "next/link";
import { getOssPRs, getRecentCommits } from "@/lib/contributions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Open Source Contributions",
  description:
    "Merged pull requests and recent public commit activity from Karan Gehlod's open-source work.",
  pathname: "/oss",
});

export const revalidate = false;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function repoOwner(repoName: string) {
  return repoName.split("/")[0];
}
function repoShortName(repoName: string) {
  return repoName.split("/")[1];
}

export default async function OssPage() {
  const [prs, commits] = await Promise.all([getOssPRs(), getRecentCommits()]);

  const uniqueRepos = new Set([
    ...prs.map((p) => p.repoName),
    ...commits.map((c) => c.repoName),
  ]).size;

  return (
    <div className="container-page py-12 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-3">
          Open Source
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-2xl">
          Merged pull requests to external projects and recent commit activity —
          what the code actually looks like.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-10 sm:mb-12">
        {[
          { label: "PRs merged", value: prs.length },
          { label: "repos contributed to", value: uniqueRepos },
          { label: "recent commits", value: commits.length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface"
          >
            <span className="font-display font-bold text-2xl text-lime">
              {value}
            </span>
            <span className="text-xs font-mono text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Merged PRs */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5">
          External Contributions
        </h2>

        {prs.length === 0 ? (
          <p className="text-text-muted text-sm py-8">
            No external merged PRs found — or the GitHub API rate limit was hit.
            Set{" "}
            <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded">
              GH_PAT
            </code>{" "}
            for better results.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {prs.map((pr) => (
              <Link
                key={pr.id}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex flex-col sm:flex-row sm:items-start gap-3 no-underline"
              >
                {/* Repo badge */}
                <div className="shrink-0 flex items-center gap-1.5 font-mono text-xs">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-text-muted shrink-0"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span className="text-text-muted">
                    {repoOwner(pr.repoName)}/
                  </span>
                  <span className="text-text-primary font-semibold">
                    {repoShortName(pr.repoName)}
                  </span>
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium leading-snug group-hover:text-lime transition-colors mb-1.5 line-clamp-2">
                    {pr.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-lime/80">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm3-8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" />
                      </svg>
                      merged
                    </span>
                    {pr.labels.slice(0, 3).map((l) => (
                      <span key={l} className="tag">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date + arrow */}
                <div className="shrink-0 flex items-center gap-2 text-xs text-text-muted font-mono">
                  {formatDate(pr.mergedAt)}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-text-muted group-hover:text-lime transition-colors"
                  >
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Commits */}
      <section>
        <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5">
          Recent Commits
        </h2>

        {commits.length === 0 ? (
          <p className="text-text-muted text-sm py-8">
            No recent public push events found.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {commits.map((c) => (
              <Link
                key={c.sha}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-start gap-4 no-underline py-4"
              >
                {/* SHA chip */}
                <span className="shrink-0 font-mono text-xs px-2 py-1 rounded bg-ink border border-border text-text-muted group-hover:border-lime/40 transition-colors">
                  {c.sha}
                </span>

                {/* Message + repo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium leading-snug group-hover:text-lime transition-colors mb-0.5 truncate">
                    {c.message}
                  </p>
                  <span className="text-xs font-mono text-text-muted">
                    {c.repoName}
                  </span>
                </div>

                {/* Date */}
                <span className="shrink-0 text-xs font-mono text-text-muted">
                  {formatDate(c.pushedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
