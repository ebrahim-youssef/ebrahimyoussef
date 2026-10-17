import type { Locale } from './locale';

export const SITE_URL = 'https://ebrahimyoussef.com';

export const SITE_NAME: Record<Locale, string> = {
  en: 'Ebrahim Youssef',
  ar: 'إبراهيم يوسف',
};

export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ar: 'ar_EG',
};

export const SKIP_LINK: Record<Locale, string> = {
  en: 'Skip to content',
  ar: 'انتقل إلى المحتوى',
};

export function localizedPath(locale: Locale, path: string): string {
  if (!path.startsWith('/') || !path.endsWith('/')) {
    throw new Error(`Invalid unlocalized path: ${path}`);
  }

  if (locale === 'en') return path;
  return path === '/' ? '/ar/' : `/ar${path}`;
}

export function alternateLinks(path: string): { hreflang: Locale | 'x-default'; href: string }[] {
  const englishPath = localizedPath('en', path);

  return [
    { hreflang: 'en', href: `${SITE_URL}${englishPath}` },
    { hreflang: 'ar', href: `${SITE_URL}${localizedPath('ar', path)}` },
    { hreflang: 'x-default', href: `${SITE_URL}${englishPath}` },
  ];
}
