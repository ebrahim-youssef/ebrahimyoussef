import type { Locale } from './locale';

type DaftarWallCopy = {
  title: string;
  text: string;
  more?: string;
  label?: string;
  soon?: string;
  start?: string;
};

export interface DaftarContent {
  title: string;
  back: string;
  h1: string;
  sub: string;
  workWithMe: string;
  nowLabel: string;
  walls: {
    watch: DaftarWallCopy & { more: string };
    play: DaftarWallCopy & { start: string };
  write: DaftarWallCopy & { label: string; soon: string; allTags: string };
  };
  railLabel: string;
  swipeHint: string;
  elsewhereTitle: string;
  inArabic: string;
  ctaTitle: string;
  ctaLink: string;
  shareFallback: string;
}

export const daftar = {
  en: {
    title: "Daftar, Ebrahim Youssef's notebook",
    back: 'Main page',
    h1: 'My notebook',
    sub: "What I'm building, making and learning, kept in one place. For work, the main page has it all.",
    workWithMe: 'Work with me',
    nowLabel: 'Now',
    walls: {
      watch: { title: 'On YouTube', text: 'Short videos from building Fastabiqu, mostly in Arabic.', more: 'All videos on YouTube' },
      play: { title: 'Play', text: 'Guess the Islamic historical figure from clues, in Arabic or English. Forgiving Arabic input, streaks and share cards.', start: 'Start the game' },
      write: { title: 'Writing', label: 'Each post is in English or Arabic, marked with its language.', text: 'Notes on building products, working in Arabic first, and what I study.', soon: 'First post soon.', allTags: 'Browse all tags' },
    },
    railLabel: 'Jump to a wall',
    swipeHint: 'Swipe the wall',
    elsewhereTitle: 'Elsewhere',
    inArabic: 'in Arabic',
    ctaTitle: 'Want to build something together?',
    ctaLink: 'See what I do',
    shareFallback: 'Select and copy the link',
  },
  ar: {
    title: 'دفتر إبراهيم يوسف',
    back: 'الصفحة الرئيسية',
    h1: 'دفتري',
    sub: 'ما أبنيه وأصنعه وأتعلّمه، في مكان واحد. وإن كنت تبحث عن العمل معي، فالصفحة الرئيسية فيها كل شيء.',
    workWithMe: 'اعمل معي',
    nowLabel: 'الآن',
    walls: {
      watch: { title: 'على YouTube', text: 'مقاطع قصيرة من رحلة بناء فاستبقوا، وأغلبها بالعربية.', more: 'كل المقاطع على YouTube' },
      play: { title: 'العب', text: 'خمّن الشخصية من التاريخ الإسلامي من خلال التلميحات، بالعربية أو الإنجليزية. كتابة عربية متسامحة، وسلاسل فوز، وبطاقات للمشاركة.', start: 'ابدأ اللعبة' },
      write: { title: 'كتابات', label: 'كل تدوينة بالعربية أو بالإنجليزية، ومكتوب عليها لغتها.', text: 'ملاحظات عن بناء المنتجات، والعمل بالعربية أولًا، وما أدرسه.', soon: 'أول تدوينة قريبًا.', allTags: 'تصفّح كل الوسوم' },
    },
    railLabel: 'انتقل إلى جدار',
    swipeHint: 'اسحب الجدار',
    elsewhereTitle: 'تجدني أيضًا',
    inArabic: 'بالعربية',
    ctaTitle: 'تريد أن نبني شيئًا معًا؟',
    ctaLink: 'شاهد ما أعمل',
    shareFallback: 'حدّد الرابط وانسخه',
  },
} satisfies Record<Locale, DaftarContent>;
