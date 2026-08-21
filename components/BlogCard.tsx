import Link from "next/link";
import type { BlogPost } from "@/types";

const sourceBadge = {
  medium: { label: "Medium", cls: "source-badge-medium" },
  devto: { label: "Dev.to", cls: "source-badge-devto" },
  direct: { label: "Direct", cls: "source-badge-direct" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const badge = sourceBadge[post.source];
  const isExternal = post.source !== "direct";

  return (
    <Link
      href={post.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="card group flex flex-col gap-3 no-underline"
    >
      {post.thumbnail && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className={badge.cls}>{badge.label}</span>
        {post.readingTime && (
          <span className="text-xs text-text-muted">{post.readingTime} min read</span>
        )}
      </div>

      <h3 className="font-display font-semibold text-text-primary text-base leading-snug group-hover:text-lime transition-colors">
        {post.title}
      </h3>

      <p className="text-sm text-text-muted leading-relaxed line-clamp-3 flex-1">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-text-muted">{formatDate(post.date)}</span>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
