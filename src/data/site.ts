const email = 'ebrahimamin391@gmail.com';

export const SITE = {
  name: 'Ebrahim Youssef',
  role: 'Front-end engineer & product builder',
  tagline: 'I build clear, dependable digital products for startups and small businesses.',
  description:
    'Front-end engineer helping startups and small businesses turn ideas into accessible websites and production-ready interfaces.',
  url: 'https://ebrahimyoussef.com',
  email,
  emailUrl: `mailto:${email}?subject=Project%20inquiry`,
  // Temporary named fallback until Ebrahim confirms a calendar URL.
  bookingUrl: `mailto:${email}?subject=Schedule%20a%20discovery%20call`,
  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    {
      name: 'Product interfaces',
      body: 'Thoughtful, accessible interfaces that make complex products feel straightforward.',
    },
    {
      name: 'Business websites',
      body: 'Focused websites that explain your offer clearly and make the next step easy.',
    },
    {
      name: 'Front-end engineering',
      body: 'Production-ready implementation that is responsive, maintainable, and built to last.',
    },
  ],
  process: [
    { name: 'Understand', body: 'We define the audience, the problem, and what success needs to look like.' },
    { name: 'Build', body: 'I turn the agreed direction into a working, reviewable product.' },
    { name: 'Refine', body: 'We test the details, remove friction, and sharpen the experience.' },
    { name: 'Ship', body: 'I prepare production, verify the release, and leave a maintainable handoff.' },
  ],
  personalNote:
    'I took the self-taught route into front-end development, so I share useful lessons that can make the path clearer for newer developers.',
  socials: {
    github: 'https://github.com/Ibrahim-Rezq',
    linkedin: 'https://linkedin.com/in/ibrahimamin391',
    qabilah: 'https://qabilah.com/profile/ibrahim-youssef',
  },
} as const;
