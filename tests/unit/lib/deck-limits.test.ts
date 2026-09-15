import { describe, expect, it } from "vitest";

import { MAX_COPY_COUNT, MAX_REMOVAL_AND_CONVERSION_COUNT } from "@/lib/deck-limits";

describe("deck-limits", () => {
  it("コピー上限は3", () => {
    expect(MAX_COPY_COUNT).toBe(3);
  });

  it("排除+変換の合計上限は5", () => {
    expect(MAX_REMOVAL_AND_CONVERSION_COUNT).toBe(5);
  });
});
