import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
  metadataBase: new URL("https://theprodsde.github.io"),
  title: {
    default: "TheProdSDE",
    template: "%s · TheProdSDE",
  },
  description:
    "The Production Side of Software Engineering — the standards, trade-offs, decisions, and systems engineers learn only on the job. By Karan Gehlod.",
  authors: [{ name: "Karan Gehlod", url: "https://karangehlod.github.io" }],
  creator: "TheProdSDE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://theprodsde.github.io",
    siteName: "TheProdSDE",
    title: "TheProdSDE",
    description: "The Production Side of Software Engineering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheProdSDE",
    creator: "@theprodsde",
  },
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
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
