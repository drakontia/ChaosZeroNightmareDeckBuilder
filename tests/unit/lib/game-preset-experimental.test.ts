import { describe, expect, it } from "vitest";

import { decodeExperimentalGamePreset } from "@/lib/game-preset-experimental";

describe("decodeExperimentalGamePreset", () => {
  it("フェイ8枚コードを復元できる", () => {
    const result = decodeExperimentalGamePreset(
      "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0zomKkYPcWHSevgIys0f1EFVQl"
    );

    expect(result.deck).not.toBeNull();
    expect(result.deck?.character?.id).toBe("fei");
    expect(result.deck?.cards).toHaveLength(8);
    expect(result.warnings).toHaveLength(0);
  });

  it("フェイ3枚コードを復元できる", () => {
    const result = decodeExperimentalGamePreset(
      "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4ihbEkamk6ku54O22fuDT9gB4n-w8Xl-0N8"
    );

    expect(result.deck).not.toBeNull();
    expect(result.deck?.character?.id).toBe("fei");
    expect(result.deck?.cards).toHaveLength(3);
  });

  it("未知コードは復元失敗になる", () => {
    const result = decodeExperimentalGamePreset("unknown-code");
    expect(result.deck).toBeNull();
  });
});

