import type { Metadata } from "next";
import { getProjects } from "@/lib/github";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source tools, experiments, and personal projects by TheProdSDE.",
};

export const revalidate = false;

export default async function ProjectsPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-3">
          Projects
        </h1>
        <p className="text-text-muted text-base sm:text-lg">
          Personal open-source work — tools, experiments, and builds.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-text-muted text-sm">
          Projects loading from GitHub — check back soon.
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mb-10 sm:mb-12">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                Featured
              </h2>
              <div className="card-grid">
                {featured.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                  All Projects
                </h2>
              )}
              <div className="card-grid">
                {rest.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
