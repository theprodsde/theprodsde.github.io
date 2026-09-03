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
            href="https://buymeacoffee.com/theprodsde"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-lime/30 bg-lime/5 text-lime text-xs font-medium
                       hover:bg-lime/15 hover:border-lime/60 transition-all duration-150"
          >
            <span>☕</span>
            Buy me a coffee
          </Link>
          <Link
            href="https://paypal.me/karangehlod"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PayPal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-border text-text-muted text-xs font-medium
                       hover:border-lime/40 hover:text-lime transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
            </svg>
            PayPal
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
              href="https://buymeacoffee.com/theprodsde"
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
            <Link
              href="https://paypal.me/karangehlod"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-md text-sm font-medium text-text-muted
                         border border-border hover:border-lime/40 hover:text-lime transition-colors
                         inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
              </svg>
              PayPal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
