import type { Locale } from '../../data/locale';

export interface GameStrings {
  dialogLabel: string;
  closeLabel: string;
  loading: string;
  title: string;
  intro: string;
  streak: string;
  tapAnswer: string;
  writeAnswer: string;
  progress: string;
  chooseFigure: string;
  writeLabel: string;
  writePlaceholder: string;
  check: string;
  showMe: string;
  correct: string;
  incorrect: string;
  next: string;
  endHeadline: string;
  shareMessage: string;
  best: string;
  preparing: string;
  share: string;
  playAgain: string;
  switchMode: string;
  copied: string;
  shareRejected: string;
  shareUnavailable: string;
  copyBlocked: string;
  footer: string;
}

export const gameStrings = {
  en: {
    dialogLabel: 'Islamic figures game',
    closeLabel: 'Close game',
    loading: 'Loading…',
    title: 'Name the figure',
    intro: 'Seven rounds. Read the hint, then name the figure. Tap an answer, or write it in Arabic.',
    streak: '🔥 {streak}-day streak',
    tapAnswer: '👆 Tap the answer',
    writeAnswer: '✍️ Write it in Arabic',
    progress: 'Round {round} of {total} · Score {score}',
    chooseFigure: 'Choose the figure',
    writeLabel: 'اكتب الاسم بالعربية',
    writePlaceholder: '…اكتب هنا',
    check: 'Check',
    showMe: 'Show me',
    correct: 'Correct',
    incorrect: "Not quite. Here's the answer",
    next: 'Next →',
    endHeadline: 'I named {score} of {total} figures in {seconds}s',
    shareMessage: 'I named {score} of {total} Islamic figures in {seconds}s. Play at ebrahimyoussef.com',
    best: 'Best: {best} of {total}',
    preparing: 'Preparing…',
    share: 'Share',
    playAgain: 'Play again',
    switchMode: 'Switch mode',
    copied: 'Copied!',
    shareRejected: "Couldn't share. The browser rejected the request.",
    shareUnavailable: "Couldn't share. Clipboard access is unavailable in this browser.",
    copyBlocked: "Couldn't share. Copy was blocked by the browser.",
    footer: 'A small experiment in Arabic input and game state.',
  },
  ar: {
    dialogLabel: 'لعبة الشخصيات الإسلامية',
    closeLabel: 'إغلاق اللعبة',
    loading: 'جارٍ التحميل…',
    title: 'سمِّ الشخصية',
    intro: 'سبع جولات. اقرأ التلميح، ثم سمِّ الشخصية. اختر إجابة أو اكتب اسمها بالعربية.',
    streak: '🔥 {streak} يومًا متتاليًا',
    tapAnswer: '👆 اختر الإجابة',
    writeAnswer: '✍️ اكتب الاسم بالعربية',
    progress: 'الجولة {round} من {total} · النتيجة {score}',
    chooseFigure: 'اختر الشخصية',
    writeLabel: 'اكتب الاسم بالعربية',
    writePlaceholder: '…اكتب هنا',
    check: 'تحقّق',
    showMe: 'أظهر لي',
    correct: 'صحيح',
    incorrect: 'ليس تمامًا. إليك الإجابة',
    next: 'التالي ←',
    endHeadline: 'سمّيت {score} من أصل {total} شخصية خلال {seconds} ثوانٍ',
    shareMessage: 'سمّيت {score} من أصل {total} شخصية إسلامية خلال {seconds} ثوانٍ. العب على ebrahimyoussef.com',
    best: 'الأفضل: {best} من {total}',
    preparing: 'جارٍ الإعداد…',
    share: 'مشاركة',
    playAgain: 'العب مجددًا',
    switchMode: 'بدّل الوضع',
    copied: 'نُسخت!',
    shareRejected: 'تعذّرت المشاركة. جرّب مرة أخرى.',
    shareUnavailable: 'تعذّرت المشاركة. لا تتوفر الحافظة في هذا المتصفح.',
    copyBlocked: 'تعذّرت المشاركة. منع المتصفح النسخ.',
    footer: 'تجربة صغيرة في الإدخال بالعربية وحالة اللعبة.',
  },
} satisfies Record<Locale, GameStrings>;

export function formatGameString(template: string, values: Record<string, number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
