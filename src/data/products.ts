export interface Product {
  id: string;
  name: string;
  label: string;
  problem: string;
  contribution: string;
  result: string;
  href: string;
  repo: string;
  cta: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: 'nabd',
    name: 'NABD · نبض',
    label: 'Product in development · RTL-first',
    problem: 'Daily worship and personal habits are easy to start and difficult to sustain.',
    contribution:
      'I am building a calm, Arabic-first companion for daily devotional routines, reflection, and accountability.',
    result:
      'A working product direction and public codebase shaped around local-first data and a focused daily routine.',
    href: 'https://nobd-frontend.vercel.app',
    repo: 'https://github.com/Ibrahim-Rezq/nabd',
    cta: 'View NABD',
    featured: true,
  },
  {
    id: 'quran-api',
    name: 'Quran Unified API',
    label: 'Open-source developer tool · TypeScript',
    problem:
      'Quran applications depend on providers that return text, audio, translation, and tafsir in incompatible shapes.',
    contribution:
      'I built one typed interface that normalizes those providers and can fall back when a source is unavailable.',
    result:
      'A pre-release SDK with a unified result model, provider adapters, full TypeScript types, and tests across four content types.',
    href: 'https://ibrahim-rezq.github.io/quran-api-unified/',
    repo: 'https://github.com/Ibrahim-Rezq/quran-api-unified',
    cta: 'Read the docs',
    featured: true,
  },
  {
    id: 'figures-game',
    name: 'Islamic Figures Game',
    label: 'Interactive experiment · Arabic and English',
    problem: 'A portfolio can show interaction and bilingual craft instead of only describing it.',
    contribution:
      'I built a compact game with Arabic input normalization, tap and write modes, streaks, and shareable results.',
    result: 'A playable React island embedded inside this otherwise static Astro site.',
    href: '#play',
    repo: 'https://github.com/Ibrahim-Rezq/ebrahimyoussef',
    cta: 'Play the game',
    featured: false,
  },
];
