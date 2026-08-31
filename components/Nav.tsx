"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/blog", label: "Writing" },
  { href: "/projects", label: "Projects" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/80 backdrop-blur-md">
      <div className="container-page h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <Image
            src="/assets/theprodsdelogo.jpg"
            alt="TheProdSDE"
            width={30}
            height={30}
            className="rounded-md group-hover:opacity-80 transition-opacity"
          />
          <span className="font-display font-bold text-base tracking-tight text-text-primary group-hover:text-lime transition-colors">
            The<span className="text-lime">Prod</span>SDE
          </span>
        </Link>

        {/* Desktop nav — hidden below md */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                path?.startsWith(href)
                  ? "text-lime bg-lime/10"
                  : "text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
            >
              {label}
            </Link>
          ))}

          <Link
            href="https://paypal.me/karangehlod"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-lime/30 bg-lime/5 text-lime text-xs font-medium
                       hover:bg-lime/15 hover:border-lime/60 transition-all duration-150"
          >
            <span>☕</span>
            Buy me a coffee
          </Link>
        </nav>

        {/* Mobile hamburger — visible below md */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-ink/95 backdrop-blur-md">
          <nav className="container-page py-3 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  path?.startsWith(href)
                    ? "text-lime bg-lime/10"
                    : "text-text-muted hover:text-text-primary hover:bg-surface"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="https://paypal.me/karangehlod"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 px-3 py-2.5 rounded-md text-sm font-medium text-lime
                         border border-lime/20 bg-lime/5 hover:bg-lime/10 transition-colors
                         inline-flex items-center gap-2"
            >
              <span>☕</span>
              Buy me a coffee
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
