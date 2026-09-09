import type { OssPR, CommitActivity } from "@/types";

const GITHUB_USER = "TheProdSDE";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GH_PAT;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function repoNameFromApiUrl(apiUrl: string): string {
  return apiUrl.replace("https://api.github.com/repos/", "");
}

export async function getOssPRs(): Promise<OssPR[]> {
  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged+is:public&sort=updated&order=desc&per_page=50`,
      { headers: getHeaders(), next: { revalidate: false } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.items ?? [])
      .filter((item: Record<string, unknown>) => {
        const name = repoNameFromApiUrl(item.repository_url as string);
        return !name.toLowerCase().startsWith(`${GITHUB_USER.toLowerCase()}/`);
      })
      .map((item: Record<string, unknown>) => {
        const repoName = repoNameFromApiUrl(item.repository_url as string);
        return {
          id: item.id as number,
          title: item.title as string,
          url: item.html_url as string,
          repoName,
          repoUrl: `https://github.com/${repoName}`,
          createdAt: item.created_at as string,
          mergedAt:
            ((item.pull_request as Record<string, unknown>)?.merged_at as string) ??
            (item.closed_at as string),
          labels: ((item.labels as Array<Record<string, unknown>>) ?? []).map(
            (l) => l.name as string
          ),
        };
      });
  } catch {
    return [];
  }
}

export async function getRecentCommits(): Promise<CommitActivity[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`,
      { headers: getHeaders(), next: { revalidate: false } }
    );
    if (!res.ok) return [];

    const events: Array<Record<string, unknown>> = await res.json();
    const commits: CommitActivity[] = [];

    for (const event of events) {
      if (event.type !== "PushEvent") continue;
      const repoName = (event.repo as Record<string, unknown>).name as string;
      const pushedAt = event.created_at as string;
      const payload = event.payload as Record<string, unknown>;

      for (const commit of (payload.commits as Array<Record<string, unknown>>) ??
        []) {
        const message = commit.message as string;
        if (message.startsWith("Merge ")) continue;
        commits.push({
          sha: (commit.sha as string).slice(0, 7),
          message: message.split("\n")[0],
          url: `https://github.com/${repoName}/commit/${commit.sha as string}`,
          repoName,
          repoUrl: `https://github.com/${repoName}`,
          pushedAt,
        });
      }
    }

    return commits.slice(0, 30);
  } catch {
    return [];
  }
}
