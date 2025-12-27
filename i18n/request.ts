import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ja';

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
