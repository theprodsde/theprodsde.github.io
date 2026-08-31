import { afterEach, describe, expect, it, vi } from "vitest";
import { getDevtoPosts } from "@/lib/devto";

describe("getDevtoPosts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps dev.to articles to BlogPost shape", async () => {
    const article = {
      id: 1,
      title: "Test Article",
      description: "A description",
      published_at: "2024-01-01T00:00:00.000Z",
      tag_list: ["typescript", "testing"],
      url: "https://dev.to/theprodsde/test-article",
      cover_image: "https://example.com/cover.png",
      reading_time_minutes: 4,
      slug: "test-article",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [article] })
    );

    const posts = await getDevtoPosts();

    expect(posts).toEqual([
      {
        slug: "devto-test-article",
        title: "Test Article",
        excerpt: "A description",
        date: "2024-01-01T00:00:00.000Z",
        tags: ["typescript", "testing"],
        source: "devto",
        url: "https://dev.to/theprodsde/test-article",
        thumbnail: "https://example.com/cover.png",
        readingTime: 4,
      },
    ]);
  });

  it("returns an empty array when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(await getDevtoPosts()).toEqual([]);
  });

  it("returns an empty array when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    expect(await getDevtoPosts()).toEqual([]);
  });
});
