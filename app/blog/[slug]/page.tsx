import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getDirectPosts, getAllPosts } from "@/lib/posts";
import { mdToHtml } from "@/lib/text";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const directPosts = getDirectPosts();
  const post = directPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  // External posts — redirect to source
  if (post.source !== "direct") {
    redirect(post.url);
  }

  // Direct MDX post — render content
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${slug}.mdx`
  );
  const fallbackPath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${slug}.md`
  );
  const raw = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : fs.existsSync(fallbackPath)
    ? fs.readFileSync(fallbackPath, "utf-8")
    : null;

  if (!raw) notFound();

  const { content } = matter(raw);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="container-prose py-12 sm:py-16">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4 font-mono">
          <span className="source-badge-direct">Direct</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <article className="prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:font-bold
        prose-a:text-lime prose-a:no-underline hover:prose-a:underline
        prose-code:font-mono prose-pre:bg-surface prose-pre:border prose-pre:border-border">
        {/* MDX content rendered as plain HTML — for full MDX, use next-mdx-remote or similar */}
        <div dangerouslySetInnerHTML={{ __html: mdToHtml(content) }} />
      </article>
    </div>
  );
}

