import Link from "next/link";
import type { Paper } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        {paper.venue && <span className="text-lime/80">{paper.venue}</span>}
        {paper.venue && <span>·</span>}
        <span>{formatDate(paper.date)}</span>
      </div>

      <h3 className="font-display font-semibold text-text-primary text-base leading-snug">
        {paper.title}
      </h3>

      <p className="text-sm text-text-muted leading-relaxed line-clamp-3 flex-1">
        {paper.abstract}
      </p>

      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1">
          {paper.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {paper.url && (
          <Link
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs px-3 py-1.5 shrink-0"
          >
            Read paper
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
