import Link from "next/link";
import type { Project } from "@/types";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Shell: "#89e051",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card group flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-text-primary text-base leading-snug">
          {project.name}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0 text-text-muted text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {project.stars}
        </div>
      </div>

      <p className="text-sm text-text-muted leading-relaxed flex-1 line-clamp-2">
        {project.idea}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.language && (
          <span className="tag flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: langColors[project.language] ?? "#7A8099" }}
            />
            {project.language}
          </span>
        )}
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Link
          href={`/projects/${project.slug}`}
          className="btn-ghost text-xs px-3 py-1.5"
        >
          More info
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        <Link
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs px-3 py-1.5"
          aria-label={`View ${project.name} on GitHub`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </Link>
      </div>
    </div>
  );
}
