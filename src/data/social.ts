import type { Locale } from './locale';

export type SocialId = 'linkedin' | 'github' | 'youtube' | 'qabilah' | 'facebook';

export const SOCIAL_LINKS: { id: SocialId; url: string; postsInArabic: boolean }[] = [
  { id: 'linkedin', url: 'https://www.linkedin.com/in/ebrahimyoussef391/', postsInArabic: true },
  { id: 'github', url: 'https://github.com/ebrahim-youssef', postsInArabic: false },
  { id: 'youtube', url: 'https://www.youtube.com/@ebrahimyoussef391', postsInArabic: false },
  { id: 'qabilah', url: 'https://qabilah.com/profile/ibrahim-youssef', postsInArabic: true },
  { id: 'facebook', url: 'https://www.facebook.com/61586254296785', postsInArabic: false },
];

export const SOCIAL_LABEL: Record<Locale, Record<SocialId, string>> = {
  en: {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    qabilah: 'Qabilah',
    facebook: 'Facebook',
  },
  ar: {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    qabilah: 'قبيلة',
    facebook: 'Facebook',
  },
};

export const LANDING_SOCIAL_IDS = ['linkedin', 'github', 'youtube'] as const;
