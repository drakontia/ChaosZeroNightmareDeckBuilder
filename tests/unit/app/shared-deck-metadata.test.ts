import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/components/DeckBuilder", () => ({
  DeckBuilder: () => null,
}));

vi.mock("@/lib/calculateFaintMemory", () => ({
  calculateFaintMemory: vi.fn(),
}));

vi.mock("@/lib/deck-share", () => ({
  decodeDeckShare: vi.fn(() => null),
}));

import { getLocale, getTranslations } from "next-intl/server";
import { generateMetadata } from "@/app/deck/[shareId]/page";

describe("shared deck metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts locale and translation lookups concurrently", async () => {
    let resolveLocale!: (locale: string) => void;
    let resolveTranslations!: (translator: Awaited<ReturnType<typeof getTranslations>>) => void;

    vi.mocked(getLocale).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLocale = resolve;
        }),
    );
    vi.mocked(getTranslations).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveTranslations = resolve;
        }),
    );

    const metadata = generateMetadata(
      { params: Promise.resolve({ shareId: "invalid" }) },
      {} as never,
    );

    await Promise.resolve();

    expect(getLocale).toHaveBeenCalledOnce();
    expect(getTranslations).toHaveBeenCalledOnce();

    resolveLocale("ja");
    resolveTranslations(((key: string) => key) as Awaited<ReturnType<typeof getTranslations>>);

    await metadata;
  });
});
