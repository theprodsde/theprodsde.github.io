import Link from "next/link";

const socials = [
  { label: "Twitter", href: "https://twitter.com/theprodsde", handle: "@theprodsde" },
  { label: "Medium", href: "https://medium.com/@theprodsde", handle: "@theprodsde" },
  { label: "Dev.to", href: "https://dev.to/theprodsde", handle: "theprodsde" },
  { label: "Reddit", href: "https://reddit.com/u/theprodsde", handle: "u/theprodsde" },
  { label: "Instagram", href: "https://instagram.com/theprodsde", handle: "@theprodsde" },
  { label: "YouTube", href: "https://youtube.com/@theprodsde", handle: "@theprodsde" },
  { label: "Email", href: "mailto:theprodsde@gmail.com", handle: "theprodsde@gmail.com" },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {socials.map(({ label, href, handle }) => (
        <Link
          key={label}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border
                     text-xs text-text-muted hover:border-lime/40 hover:text-lime
                     transition-colors duration-150 font-mono"
        >
          <span className="text-text-muted/60 text-[10px]">{label}</span>
          <span>/</span>
          <span>{handle}</span>
        </Link>
      ))}
    </div>
  );
}
