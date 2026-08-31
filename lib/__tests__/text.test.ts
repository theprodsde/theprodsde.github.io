import { describe, expect, it } from "vitest";
import { estimateReadingTime, stripHtml, truncate } from "@/lib/text";

describe("estimateReadingTime", () => {
  it("rounds to the nearest minute at 200 words/minute", () => {
    const text = Array(400).fill("word").join(" ");
    expect(estimateReadingTime(text)).toBe(2);
  });

  it("never returns less than 1 minute", () => {
    expect(estimateReadingTime("one two three")).toBe(1);
    expect(estimateReadingTime("")).toBe(1);
  });

  it("ignores extra whitespace between words", () => {
    expect(estimateReadingTime("word   word\n\nword")).toBe(1);
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <b>world</b></p>")).toBe("Hello world");
  });

  it("returns plain text unchanged", () => {
    expect(stripHtml("just text")).toBe("just text");
  });
});

describe("truncate", () => {
  it("leaves short text untouched", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates and appends an ellipsis when text exceeds the limit", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcde…");
  });
});
