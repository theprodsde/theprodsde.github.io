import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogFilter from "@/components/BlogFilter";

export const metadata: Metadata = {
  title: "Writing",
  description: "Production engineering writing — trade-offs, standards, decisions, and systems that engineers usually learn only on the job.",
};

export const revalidate = false;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-3">
          Writing
        </h1>
        <p className="text-text-muted text-base sm:text-lg">
          Production engineering — the decisions, trade-offs, and systems that
          don&apos;t show up in tutorials.
        </p>
      </div>

      <BlogFilter posts={posts} />
    </div>
  );
}
