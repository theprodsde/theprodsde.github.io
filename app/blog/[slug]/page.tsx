import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getDirectPosts, getAllPosts } from "@/lib/posts";
import { mdToHtml } from "@/lib/text";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { absoluteUrl, jsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getDirectPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const directPosts = getDirectPosts();
  const post = directPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const canonical = `/blog/${post.slug}`;
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    pathname: canonical,
    type: "article",
    image: post.thumbnail,
    publishedTime: post.date,
    modifiedTime: post.modified,
  });
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
  const relatedPosts = getDirectPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post: candidate }) => candidate);
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Karan Gehlod", url: "https://karangehlod.github.io" },
    datePublished: post.date,
    ...(post.modified ? { dateModified: post.modified } : {}),
    ...(post.thumbnail ? { image: absoluteUrl(post.thumbnail) } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Writing", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="container-prose py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([articleJsonLd, breadcrumbJsonLd]) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/blog">Writing</Link><span aria-hidden="true">/</span>
        <span className="text-text-primary" aria-current="page">{post.title}</span>
      </nav>
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

      {relatedPosts.length > 0 && (
        <aside className="mt-12 border-t border-border pt-8" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display font-bold text-xl text-text-primary mb-4">Related writing</h2>
          <ul className="space-y-3">
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link href={`/blog/${related.slug}`} className="text-lime hover:underline">
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}

