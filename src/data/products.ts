export interface Product {
  id: string;
  name: string;
  label: string;
  status: string | null;
  problem: string;
  contribution: string;
  result: string;
  /* null when the project has no live URL to send people to, so the card falls back
     to its source link instead of shipping a dead one. */
  href: string | null;
  repo: string;
  cta: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: 'arkan',
    name: 'Arkan · أركان',
    label: 'Arabic-only · offline-first · Expo',
    status: 'In development',
    problem:
      'Islamic knowledge usually reaches a family as study material, not as something the family can do together in an evening.',
    contribution:
      'Arkan is an Arabic-only quiz game for the family. Two to four players pass one device around a local majlis, there is a ten-question daily challenge shared by everyone on the same day, and progress runs across the five pillars. Every question carries four options, an explanation, and its source.',
    result:
      'Built with Expo and React Native for Android, iOS, and the web. Data stays on the device and play works offline, with no accounts, ads, or analytics. This is my main project right now and the clearest example of where I am heading: intentional, useful digital experiences for Muslims.',
    href: null,
    repo: 'https://github.com/ebrahim-youssef/arkan',
    cta: 'Open Arkan',
    featured: true,
  },
  {
    id: 'nabd',
    name: 'NABD · نبض',
    label: 'Arabic-first · RTL · web and Android',
    status: 'In development',
    problem:
      'A daily routine of worship is easy to start and hard to keep steady, and most habit apps are built for neither the language nor the routine.',
    contribution:
      'NABD is an Arabic-first companion for the daily wird: one page to check off the day, levels that fit the routine to where you actually are, per-item statistics for consistency and streaks, a dhikr counter, libraries of adhkar and intentions, prayer times, and reminders.',
    result:
      'A Next.js app with a Capacitor Android shell that keeps working offline. It is a product direction I intend to keep building, not a portfolio concept, and the codebase is public.',
    href: null,
    repo: 'https://github.com/ebrahim-youssef/nabd',
    cta: 'Open NABD',
    featured: true,
  },
  {
    id: 'quran-api',
    name: 'Quran Unified API',
    label: 'Open-source SDK · TypeScript',
    status: 'Pre-1.0, published on npm',
    problem:
      'Anyone building a Quran app has to stitch together providers that return text, audio, translation, and tafsir in incompatible shapes, and any one of them can be unavailable when it is needed.',
    contribution:
      'A typed JavaScript and TypeScript SDK that puts a single interface over those providers, with provider selection and automatic fallback when a source does not respond.',
    result:
      'Useful infrastructure for developers building Quran and Islamic products: one result model, provider adapters, full TypeScript types, and documentation.',
    href: 'https://ebrahim-youssef.github.io/quran-api-unified/',
    repo: 'https://github.com/ebrahim-youssef/quran-api-unified',
    cta: 'Read the docs',
    featured: true,
  },
  {
    id: 'quote-vault',
    name: 'Quote Vault',
    label: 'Full-stack side project · Next.js',
    status: 'Source available',
    problem:
      'The lines worth keeping end up scattered across screenshots and notes apps, and they are never there when you need them again.',
    contribution:
      'A quote and knowledge organiser with a dashboard for saving, editing, and finding quotes, email sign-in, a light and dark theme, and an interface in English and Arabic.',
    result:
      'Built with Next.js, TypeScript, Prisma, and PostgreSQL. A smaller project than the others, and where I worked out server actions, typed data access from database to component, and a bilingual interface end to end.',
    href: null,
    repo: 'https://github.com/ebrahim-youssef/quote-vault',
    cta: 'Open Quote Vault',
    featured: true,
  },
  {
    id: 'figures-game',
    name: 'Islamic Figures Game',
    label: 'Interactive experiment · Arabic and English',
    status: null,
    problem: 'Most people meet the figures of Islamic history as names in a list.',
    contribution:
      'A small guessing game about figures from Islamic history, in Arabic and English: tap or write mode, Arabic input that forgives spelling variations, streaks, and a share card. It runs as a React island inside this otherwise static Astro site.',
    result: 'A playable page section rather than a product, built because it was worth building.',
    href: '#play',
    repo: 'https://github.com/ebrahim-youssef/ebrahimyoussef',
    cta: 'Play the game',
    featured: false,
  },
];
