import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://theprodsde.github.io").replace(/\/$/, "");
const failures = [];

if (!fs.existsSync(outDir)) failures.push("out/ does not exist; run npm run build first");
const htmlFiles = fs.existsSync(outDir)
  ? fs.readdirSync(outDir, { recursive: true }).filter((file) => String(file).endsWith(".html") && !/^google[a-f0-9]+\.html$/i.test(String(file).split(/[\\/]/).pop()))
  : [];
const titles = new Map();
const descriptions = new Map();

for (const relativeFile of htmlFiles) {
  const file = path.join(outDir, relativeFile);
  const html = fs.readFileSync(file, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1];
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i)?.[1];
  if (!title) failures.push(`${relativeFile}: missing title`);
  else titles.set(title, [...(titles.get(title) ?? []), relativeFile]);
  if (!description) failures.push(`${relativeFile}: missing meta description`);
  else descriptions.set(description, [...(descriptions.get(description) ?? []), relativeFile]);
  if (!canonical) failures.push(`${relativeFile}: missing canonical`);
  if (canonical && !canonical.startsWith(`${siteUrl}/`) && canonical !== siteUrl) failures.push(`${relativeFile}: canonical is outside ${siteUrl}`);
  const isErrorPage = /(?:^|[\\/])(?:404|_not-found)(?:[\\/]|\.html$)/i.test(String(relativeFile));
  if (!isErrorPage && /<meta[^>]+robots[^>]+noindex/i.test(html)) failures.push(`${relativeFile}: unintended noindex directive`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { failures.push(`${relativeFile}: invalid JSON-LD`); }
  }
}

for (const [title, files] of titles) {
  const publicFiles = files.filter((file) => !/(?:^|[\\/])(?:404|_not-found)(?:[\\/]|\.html$)/i.test(String(file)));
  if (publicFiles.length > 1) failures.push(`duplicate title "${title}" in ${publicFiles.join(", ")}`);
}
for (const [, files] of descriptions) {
  const publicFiles = files.filter((file) => !/(?:^|[\\/])(?:404|_not-found)(?:[\\/]|\.html$)/i.test(String(file)));
  if (publicFiles.length > 1) failures.push(`duplicate description in ${publicFiles.join(", ")}`);
}

if (fs.existsSync(outDir)) {
  const output = fs.readdirSync(outDir, { recursive: true })
    .filter((file) => String(file).endsWith(".html") || String(file).endsWith(".xml") || String(file).endsWith(".txt"))
    .map((file) => fs.readFileSync(path.join(outDir, file), "utf8"))
    .join("\\n");
  if (/(?:ghp_(?!your_token_here)[A-Za-z0-9]{20,}|github_pat_(?!your_token_here)[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z]{20,})/.test(output)) failures.push("possible credential pattern found in production output");
}

const sitemapPath = path.join(outDir, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) failures.push("missing out/sitemap.xml");
else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes("<urlset") || !sitemap.includes("</urlset>")) failures.push("invalid sitemap XML envelope");
  if (sitemap.includes("localhost") || sitemap.includes("staging")) failures.push("sitemap contains a staging/localhost URL");
  if ([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].some(([, url]) => !url.startsWith(`${siteUrl}/`) && url !== siteUrl)) failures.push("sitemap contains a non-production URL");
}

const robotsPath = path.join(outDir, "robots.txt");
if (!fs.existsSync(robotsPath)) failures.push("missing out/robots.txt");
else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) failures.push("robots.txt sitemap reference does not match sitemap.xml");
}

if (failures.length) {
  console.error(failures.map((failure) => `SEO: ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`SEO checks passed for ${htmlFiles.length} HTML files, sitemap.xml, and robots.txt.`);
