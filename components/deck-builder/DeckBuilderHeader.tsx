import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface DeckBuilderHeaderProps {
  locale: string;
  title: string;
  description: string;
}

export function DeckBuilderHeader({ locale, title, description }: DeckBuilderHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-end sm:items-start gap-2 mb-2">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
          <iframe src="https://github.com/sponsors/drakontia/button" title="Sponsor drakontia" height="32" width="114" style={{ border: 0, borderRadius: "6px" }} />
          <Link
            href="https://x.com/MhdenOfRamuh"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="x-icon-link"
            aria-label="X (Twitter)"
          >
            <Image
              src="/images/x-logo.svg"
              alt="X (Twitter)"
              width={24}
              height={24}
              className="w-6 h-6 dark:invert"
            />
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <div className="order-2 sm:order-1 w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2">
            <Link href="/" className="hover:underline">
              {title}
            </Link>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </header>
  );
}
