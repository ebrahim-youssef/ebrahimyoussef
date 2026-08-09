export interface ProofCard { title: string; body: string; evidence: string; href: string; }
export const proof: ProofCard[] = [
  {
    title: 'Production apps, end to end',
    body: 'NABD ships as a web app and a native Android build: offline-first data, prayer-time alarms, native transitions.',
    evidence: 'Evidence: NABD',
    href: 'https://github.com/Ibrahim-Rezq/nabd',
  },
  {
    title: 'Developer tools & open source',
    body: 'The Quran Unified API is a typed, tested, published SDK that unifies inconsistent third-party providers behind one interface.',
    evidence: 'Evidence: quran-api-unified',
    href: 'https://github.com/Ibrahim-Rezq/quran-api-unified',
  },
  {
    title: 'Interactive, bilingual UI',
    body: 'The game on this page handles RTL Arabic input, game state and share cards — inside a static Astro site.',
    evidence: 'Evidence: press Play',
    href: '#play',
  },
];
