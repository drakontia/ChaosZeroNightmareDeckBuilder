import { describe, expect, it } from "vite-plus/test";

import { formatSeason4DesireStatusLabels } from "@/lib/season4";
import { CardStatus } from "@/types";

describe("formatSeason4DesireStatusLabels", () => {
  const translate = (status: CardStatus) => {
    switch (status) {
      case CardStatus.CONTROL:
        return "統制";
      case CardStatus.INQUIRY:
        return "探求";
      case CardStatus.CLAIM:
        return "所有";
      case CardStatus.SURVIVAL:
        return "生存";
      default:
        return status;
    }
  };

  it("does not append a count when a status appears only once", () => {
    expect(formatSeason4DesireStatusLabels([CardStatus.INQUIRY], translate)).toEqual(["探求"]);
  });

  it("collapses three identical statuses into a single label with a count", () => {
    expect(
      formatSeason4DesireStatusLabels(
        [CardStatus.INQUIRY, CardStatus.INQUIRY, CardStatus.INQUIRY],
        translate,
      ),
    ).toEqual(["探求3"]);
  });

  it("collapses two identical statuses followed by a distinct status", () => {
    expect(
      formatSeason4DesireStatusLabels(
        [CardStatus.INQUIRY, CardStatus.INQUIRY, CardStatus.CLAIM],
        translate,
      ),
    ).toEqual(["探求2", "所有"]);
  });

  it("collapses two identical statuses with no additional status", () => {
    expect(
      formatSeason4DesireStatusLabels([CardStatus.INQUIRY, CardStatus.INQUIRY], translate),
    ).toEqual(["探求2"]);
  });

  it("preserves first-occurrence order even when duplicates are non-adjacent", () => {
    expect(
      formatSeason4DesireStatusLabels(
        [CardStatus.INQUIRY, CardStatus.CLAIM, CardStatus.INQUIRY],
        translate,
      ),
    ).toEqual(["探求2", "所有"]);
  });

  it("returns an empty array when there are no statuses", () => {
    expect(formatSeason4DesireStatusLabels([], translate)).toEqual([]);
  });
});
