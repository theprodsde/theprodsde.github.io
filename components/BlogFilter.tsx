"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPost, BlogSource } from "@/types";

const tabs: { label: string; value: BlogSource | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Medium", value: "medium" },
  { label: "Dev.to", value: "devto" },
  { label: "Direct", value: "direct" },
];

export default function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<BlogSource | "all">("all");

  const filtered =
    active === "all" ? posts : posts.filter((p) => p.source === active);

  const counts = {
    all: posts.length,
    medium: posts.filter((p) => p.source === "medium").length,
    devto: posts.filter((p) => p.source === "devto").length,
    direct: posts.filter((p) => p.source === "direct").length,
  };

  return (
    <>
      <div className="flex items-center gap-1 mb-8 p-1 bg-surface rounded-lg border border-border w-fit max-w-full overflow-x-auto scrollbar-none">
        {tabs.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              active === value
                ? "bg-lime text-ink font-semibold shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {label}
            <span
              className={`text-xs rounded-full px-1.5 py-0.5 ${
                active === value ? "bg-ink/20 text-ink" : "bg-border text-text-muted"
              }`}
            >
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted text-sm">
          No posts yet in this category.
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
