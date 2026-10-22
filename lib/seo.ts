import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://theprodsde.github.io").replace(/\/$/, "");
export const SITE_NAME = "TheProdSDE";
export const AUTHOR_NAME = "Karan Gehlod";
export const AUTHOR_URL = "https://karangehlod.github.io";
export const DEFAULT_OG_IMAGE = "/assets/theprodsdelogo.jpg";

export function absoluteUrl(pathname = "") {
  return new URL(pathname.replace(/^\//, ""), `${SITE_URL}/`).toString();
}

export function pageMetadata({
  title,
  description,
  pathname = "/",
  type = "website",
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  pathname?: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: imageUrl, alt: `${SITE_NAME} logo` }],
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@theprodsde",
    },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
