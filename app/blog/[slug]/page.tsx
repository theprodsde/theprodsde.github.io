import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getDirectPosts, getAllPosts } from "@/lib/posts";
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

// Minimal markdown-to-HTML for direct posts (headings, paragraphs, code, bold, italic, links)
function mdToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hup]|<pre|<block)(.+)$/gm, (line) =>
      line.trim() ? line : ""
    )
    .replace(/^<\/p><p>$/, "")
    .trim();
}
