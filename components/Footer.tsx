import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-4 mb-0 text-center text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-2">
            <span>ChaosZeroNightmare Deck Builder © 2025 Drakontia</span>
            <span className="hidden sm:inline">·</span>
            <Link href="https://github.com/drakontia/ChaosZeroNightmareDeckEditor" target="_blank" rel="noopener noreferrer">
              <Image
                className="w-6 h-6"
                src="images/GitHub_Invertocat_Black_Clearspace.png"
                alt="GitHub Mark"
                width={6}
                height={6}
              />
            </Link>
            <span className="hidden sm:inline">·</span>
            <span className="inline">GPL v3</span>
        </footer>
    );
}
