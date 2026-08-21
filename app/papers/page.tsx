import type { Metadata } from "next";
import { getPapers } from "@/lib/papers";
import PaperCard from "@/components/PaperCard";

export const metadata: Metadata = {
  title: "Papers",
  description: "Research papers and technical publications by TheProdSDE.",
};

export default function PapersPage() {
  const papers = getPapers();

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-3">
          Papers
        </h1>
        <p className="text-text-muted text-base sm:text-lg">
          Research, publications, and technical writing.
        </p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-20 text-text-muted text-sm">
          No publications yet — check back soon.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {papers.map((paper) => (
            <PaperCard key={paper.slug} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}
