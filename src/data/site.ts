const email = 'ebrahimamin391@gmail.com';
const emailUrl = `mailto:${email}?subject=Project%20inquiry`;

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  body: string;
  arabic: boolean;
}

export const socials: SocialLink[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ebrahimyoussef391/',
    body: 'Arabic reflections, lessons from building, and things I am learning.',
    arabic: true,
  },
  {
    id: 'qabilah',
    name: 'Qabilah',
    url: 'https://qabilah.com/profile/ibrahim-youssef',
    body: 'Arabic learning notes and conversations with a community of builders.',
    arabic: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/61586254296785',
    body: 'Helping people with questions and sharing useful discussions.',
    arabic: false,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@ebrahimyoussef391',
    body: 'Videos about learning, building, and useful development knowledge.',
    arabic: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/ebrahim-youssef',
    body: 'The products, experiments, and tools I build in public.',
    arabic: false,
  },
];

export function socialUrl(id: string): string {
  const link = socials.find((item) => item.id === id);
  if (!link) throw new Error(`Unknown social link: ${id}`);
  return link.url;
}

export const SITE = {
  name: 'Ebrahim Youssef',
  role: 'Front-end engineer and product builder',
  location: 'Egypt',
  tagline: 'I build useful products, then share what I learn building them.',
  title: 'Ebrahim Youssef | Product builder and front-end engineer',
  description:
    'I build useful digital products for people and businesses, and share practical lessons for self-taught developers and career-switchers.',
  url: 'https://ebrahimyoussef.com',
  googleTagId: 'G-ZSD8RW67L3',
  email,
  emailUrl,
  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Sharing', href: '#sharing' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    {
      name: 'Product interfaces',
      body: 'Turning complicated workflows into web experiences people can move through without a manual.',
    },
    {
      name: 'Arabic-first and bilingual products',
      body: 'Interfaces built for Arabic and RTL from the first screen, not translated into it afterwards, so the language and the people reading it are treated properly.',
    },
    {
      name: 'Front-end engineering',
      body: 'Dependable React and TypeScript front ends: maintainable structure, careful details, and product thinking behind the code.',
    },
  ],
  process: [
    {
      name: 'Understand',
      body: 'Learn the real problem, the people, and the constraints before deciding what to build.',
    },
    {
      name: 'Shape',
      body: 'Make the simplest useful version of the product and get the user journey clear.',
    },
    {
      name: 'Build',
      body: 'Build the interface with maintainable front-end engineering and attention to the details people feel.',
    },
    {
      name: 'Refine and ship',
      body: 'Test the important flows, fix what is unclear, and release something people can rely on.',
    },
  ],
  audiences: [
    {
      name: 'For businesses',
      body: 'I help turn real operational problems and product ideas into interfaces people can understand and use.',
      cta: { label: 'Email me about a project', href: emailUrl },
    },
    {
      name: 'For developers finding their path',
      body: 'I share practical lessons for self-taught developers and career-switchers who want a clearer, less lonely route into programming.',
      cta: { label: 'See where I share', href: '#sharing' },
    },
  ],
  personalNote:
    'I share the lessons, the mistakes, and the parts of the process that usually stay hidden, not only the finished screens. If you are teaching yourself or changing careers, I hope it saves you some of the time it cost me.',
} as const;
