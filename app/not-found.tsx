import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 sm:py-32 flex flex-col items-center text-center gap-4">
      <span className="font-mono text-lime text-sm">404</span>
      <h1 className="font-display font-extrabold text-4xl text-text-primary">
        Page not found
      </h1>
      <p className="text-text-muted text-lg max-w-md">
        This page doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-lime mt-4">
        Go home
      </Link>
    </div>
  );
}
