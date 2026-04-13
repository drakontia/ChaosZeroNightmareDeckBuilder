import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

import { resolveLocale } from '@/i18n/locale';

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const requestedLocale = await requestLocale;
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = resolveLocale({
    requestedLocale,
    cookieLocale,
    acceptLanguage: requestHeaders.get('accept-language'),
  });

  // 各カテゴリのjsonをマージ
  const messages = {
    ...(await import(`../messages/${locale}/common.json`)).default,
    ...(await import(`../messages/${locale}/cards.json`)).default,
    ...(await import(`../messages/${locale}/equipment.json`)).default,
  };

  return {
    locale,
    messages
  };
});
