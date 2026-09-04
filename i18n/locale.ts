export const SUPPORTED_LOCALES = ["ja", "en", "zh", "ko"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizeLocaleTag(locale: string | null | undefined): AppLocale | undefined {
  if (!locale) {
    return undefined;
  }

  const normalized = locale.toLowerCase();
  if (normalized.startsWith("ja")) {
    return "ja";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  if (normalized.startsWith("zh")) {
    return "zh";
  }
  if (normalized.startsWith("ko")) {
    return "ko";
  }

  return undefined;
}

function parseAcceptLanguage(acceptLanguage: string | null | undefined): AppLocale | undefined {
  if (!acceptLanguage) {
    return undefined;
  }

  const candidates = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tagPart, ...params] = part.trim().split(";");
      const quality = params.map((param) => param.trim()).find((param) => param.startsWith("q="));

      return {
        locale: normalizeLocaleTag(tagPart),
        quality: quality ? Number.parseFloat(quality.slice(2)) : 1,
        index,
      };
    })
    .filter((candidate): candidate is { locale: AppLocale; quality: number; index: number } =>
      Boolean(candidate.locale),
    )
    .sort((left, right) => {
      if (right.quality !== left.quality) {
        return right.quality - left.quality;
      }
      return left.index - right.index;
    });

  return candidates[0]?.locale;
}

export function resolveLocale({
  requestedLocale,
  cookieLocale,
  acceptLanguage,
  defaultLocale = "ja",
}: {
  requestedLocale?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
  defaultLocale?: AppLocale;
}): AppLocale {
  return (
    normalizeLocaleTag(requestedLocale) ??
    normalizeLocaleTag(cookieLocale) ??
    parseAcceptLanguage(acceptLanguage) ??
    defaultLocale
  );
}
