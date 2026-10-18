export const fixturePosts = [
  {
    id: 'older-note',
    data: {
      title: 'An older note',
      date: new Date('2026-01-10T00:00:00.000Z'),
      lang: 'en' as const,
      tags: ['life', 'building'],
      draft: false,
    },
  },
  {
    id: 'newer-note',
    data: {
      title: 'A newer note',
      date: new Date('2026-02-10T00:00:00.000Z'),
      lang: 'en' as const,
      tags: ['building', 'New Tag'],
      draft: false,
    },
  },
  {
    id: 'arabic-note',
    data: {
      title: 'ملاحظة عربية',
      date: new Date('2026-03-10T00:00:00.000Z'),
      lang: 'ar' as const,
      tags: ['life'],
      draft: false,
    },
  },
  {
    id: 'draft-note',
    data: {
      title: 'A draft note',
      date: new Date('2026-04-10T00:00:00.000Z'),
      lang: 'en' as const,
      tags: ['drafts'],
      draft: true,
    },
  },
] as const;
