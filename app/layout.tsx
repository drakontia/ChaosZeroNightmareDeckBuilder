import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: "カオスゼロナイトメア デッキビルダー",
  description: "ゲーム「カオスゼロナイトメア」のカードデッキを構築出来る攻略補助サイトです。",
  keywords: ['カオスゼロナイトメア', 'カオゼロ', 'Chaos Zero Nightmare', 'Deck Builder', 'デッキビルダー', 'ローグライク', 'Roguelike', 'カードゲーム', 'Card Game' ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
