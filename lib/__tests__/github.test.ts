import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(false),
    readFileSync: vi.fn(),
  },
}));

import { getProjects } from "@/lib/github";

describe("getProjects", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("filters out forks and sorts featured projects first", async () => {
    const repos = [
      { name: "a", description: "desc a", html_url: "https://github.com/x/a", stargazers_count: 1, language: "TS", updated_at: "2024-01-01", fork: false, topics: [] },
      { name: "forked", description: "desc f", html_url: "https://github.com/x/forked", stargazers_count: 9, language: "JS", updated_at: "2024-01-02", fork: true, topics: [] },
      { name: "b", description: "desc b", html_url: "https://github.com/x/b", stargazers_count: 2, language: "Go", updated_at: "2024-01-03", fork: false, topics: [] },
    ];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => repos }));

    const projects = await getProjects();

    expect(projects.map((p) => p.name)).toEqual(["a", "b"]);
    expect(projects.every((p) => p.name !== "forked")).toBe(true);
  });

  it("returns an empty array when the GitHub request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(await getProjects()).toEqual([]);
  });
});
