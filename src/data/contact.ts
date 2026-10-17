import type { Locale } from './locale';

export const EMAIL = 'me@ebrahimyoussef.com';
export const WHATSAPP_NUMBER = '201287877420';
export const TURNSTILE_SITE_KEY = import.meta.env.DEV ? '1x00000000000000000000AA' : '0x4AAAAAAFZgqEuLZO8TS1Sk';
// The booking button renders only when this holds a URL.
export const CAL_URL: string = '';

export const WHATSAPP_MESSAGE: Record<Locale, string> = {
  en: "Hi Ebrahim, I found you through your website. I'd like to talk about building something.",
  ar: 'أهلاً إبراهيم، وصلت لك من موقعك وحابب نتكلم عن مشروع.',
};

export function whatsappUrl(locale: Locale): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE[locale])}`;
}
