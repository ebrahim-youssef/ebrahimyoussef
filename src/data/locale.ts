export const LOCALES = ['en', 'ar'] as const;

export type Locale = (typeof LOCALES)[number];

export const DIRECTION: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};
