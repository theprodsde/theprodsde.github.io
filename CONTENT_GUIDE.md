# Content Guide

## Add a direct blog post

Create `content/blog/your-slug.mdx`:

```
---
title: "Your Post Title"
date: "2026-08-21"
tags: ["tag1", "tag2"]
excerpt: "One sentence preview shown on listing cards."
---

## Your heading

Content here in Markdown.
```

Posts appear at `/blog/your-slug`.

---

## Register a GitHub project

Create `content/projects/repo-name.json` (must match the exact GitHub repo name):

```json
{
  "idea": "One-line description of the concept.",
  "why": "Why you built it — the problem, the motivation, the context.",
  "tags": ["rust", "cli"],
  "featured": true,
  "hideFromSite": false
}
```

- `featured: true` → shown on the homepage strip and at the top of the Projects page
- `hideFromSite: true` → hidden everywhere
- Repos with no JSON file are excluded by default

---

## Add a paper / publication

Create `content/papers/your-slug.md`:

```
---
title: "Paper Title"
date: "2026-01-01"
venue: "Conference or Journal Name"
url: "https://link-to-paper.com"
abstract: "Short abstract shown on the card."
tags: ["distributed systems", "databases"]
---
```

---

## Swap in your logo

Drop `logo.svg` into `public/assets/`. Update `components/Nav.tsx` and `components/Footer.tsx` to use `<Image src="/assets/logo.svg" .../>` instead of the text wordmark.

---

## GitHub Actions secrets

For higher GitHub API rate limits (500/hr instead of 60/hr), add a GitHub Personal Access Token to your repo secrets:
- **Name**: `GH_PAT`
- **Value**: A fine-grained PAT with `public_repositories` read-only scope
