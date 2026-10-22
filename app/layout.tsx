import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AUTHOR_NAME, AUTHOR_URL, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "TheProdSDE | Production Software Engineering",
    template: "%s · TheProdSDE",
  },
  description:
    "The Production Side of Software Engineering — practical writing, open-source projects, and lessons from building software that works in production.",
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "TheProdSDE | Production Software Engineering",
    description:
      "Practical writing, open-source projects, and lessons from building software that works in production.",
    images: [{ url: DEFAULT_OG_IMAGE, alt: `${SITE_NAME} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheProdSDE | Production Software Engineering",
    description:
      "Practical writing, open-source projects, and lessons from building software that works in production.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@theprodsde",
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${syne.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink text-text-primary min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: AUTHOR_NAME,
                url: AUTHOR_URL,
                sameAs: [AUTHOR_URL, "https://github.com/TheProdSDE"],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                description: metadata.description,
                publisher: { "@type": "Person", name: AUTHOR_NAME, url: AUTHOR_URL },
              },
            ]).replace(/</g, "\\u003c"),
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
