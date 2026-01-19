import Image from "next/image";

export function Footer() {
    return (
        <div className="mt-4 mb-0 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>ChaosZeroNightmare Deck Builder © 2025 Drakontia</span>
            <span className="hidden sm:inline">·</span>
            <a href="https://github.com/drakontia/ChaosZeroNightmareDeckEditor" target="_blank" rel="noopener noreferrer">
              <Image
                className="w-6 h-6"
                src="images/GitHub_Invertocat_Black_Clearspace.png"
                alt="GitHub Mark"
                width={6}
                height={6}
              />
            </a>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">GPL v3</span>
        </div>
    );
}
