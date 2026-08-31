import { describe, expect, it, vi } from "vitest";

const parseURL = vi.fn();
vi.mock("rss-parser", () => ({
  default: class {
    parseURL = parseURL;
  },
}));

import { getMediumPosts } from "@/lib/medium";

describe("getMediumPosts", () => {
  it("maps feed items to BlogPost shape, stripping html and extracting a thumbnail", async () => {
    parseURL.mockResolvedValueOnce({
      items: [
        {
          title: "My Post",
          link: "https://medium.com/@theprodsde/my-post",
          isoDate: "2024-02-01T00:00:00.000Z",
          categories: ["ai"],
          "content:encoded": '<p>Hello <img src="https://img.example/1.png"> world</p>',
        },
      ],
    });

    const posts = await getMediumPosts();

    expect(posts).toEqual([
      {
        slug: "medium-https%3A%2F%2Fmedium.com%2F%40theprodsde%2Fmy-post",
        title: "My Post",
        excerpt: "Hello world",
        date: "2024-02-01T00:00:00.000Z",
        tags: ["ai"],
        source: "medium",
        url: "https://medium.com/@theprodsde/my-post",
        thumbnail: "https://img.example/1.png",
        readingTime: 1,
      },
    ]);
  });

  it("returns an empty array when the feed fails to load", async () => {
    parseURL.mockRejectedValueOnce(new Error("timeout"));
    expect(await getMediumPosts()).toEqual([]);
  });
});
