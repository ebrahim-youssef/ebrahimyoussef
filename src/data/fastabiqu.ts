import { type Locale } from './locale';

type Link = { label: string; href: string };

export type ShotId = 'home' | 'challenges';

export interface CaseStudyContent {
  title: string;
  description: string;
  back: string;
  h1: string;
  lede: string;
  status: string;
  links: Link[];
  facts: { value: string; label: string }[];
  audienceTitle: string;
  audience: string[];
  shots: { id: ShotId; alt: string; caption: string }[];
  localTitle: string;
  local: string[];
  pipelineTitle: string;
  pipeline: string[];
  pipelineSteps: { title: string; text: string }[];
  arabicTitle: string;
  arabic: string[];
  testingTitle: string;
  testing: string[];
  rolesTitle: string;
  roles: string[];
  tradeoffTitle: string;
  tradeoff: string;
  toolsTitle: string;
  tools: string;
  ctaTitle: string;
  ctaText: string;
}

export const WEB_GAME_URL = 'https://fastabiqu.ebrahimyoussef.com';
export const PRODUCT_SITE_URL = 'https://site.fastabiqu.ebrahimyoussef.com';

export const fastabiqu = {
  en: {
    title: 'Fastabiqu case study, Ebrahim Youssef',
    description:
      'How I built Fastabiqu, an Arabic family quiz game for Android, iOS and the web, from the first idea to the Google Play release.',
    back: 'Back to the main page',
    h1: 'Fastabiqu: a quiz game for the whole family, built by one person',
    lede:
      'Fastabiqu is a free Arabic quiz game about Islamic knowledge. Families pass one phone around and race to answer, and every answer comes with an explanation and its source. I did all of it: the name, the design, the code, the testing and the release.',
    status: 'Live on the web. The Android version finished closed testing, and the Google Play release is being prepared.',
    links: [
      { label: 'Play the web game', href: WEB_GAME_URL },
      { label: 'Product site', href: PRODUCT_SITE_URL },
    ],
    facts: [
      { value: '2 to 6', label: 'players on one phone' },
      { value: '375', label: 'questions, each one reviewed' },
      { value: '5 × 3', label: 'categories and levels' },
      { value: '12+', label: 'people in the closed test' },
    ],
    audienceTitle: 'Who it is for',
    audience: [
      'Fastabiqu is for families and friends who want a game that also teaches something true. The competition is what brings people to the table. What they take away is the knowledge: each answer shows an explanation, the verse or hadith behind it, and the exact reference.',
      'There are no ads and no accounts. The game works offline, and everything a player does stays on their own device.',
    ],
    shots: [
      { id: 'home', alt: 'The Fastabiqu home screen in Arabic, with the Majlis, the daily challenge and achievements.', caption: 'The home screen: the Majlis, the daily challenge and achievements.' },
      { id: 'challenges', alt: 'The Fastabiqu challenges screen in Arabic, with the daily challenge and a two-minute race.', caption: 'Challenges: the same 10 questions for everyone each day, or a two-minute race.' },
    ],
    localTitle: 'One phone before online play',
    local: [
      'Multiplayer started with the Majlis (المجلس): 2 to 6 players, alone or in teams, sharing one device. Playing on one phone keeps the game\'s promises. It needs no server, no sign-in and no internet connection.',
      'There is also a daily challenge, where everyone gets the same 10 questions, and a progress system with points, levels, mastery rings and achievements. Online rooms are in development now. The game does not offer them until they work.',
    ],
    pipelineTitle: 'New questions without a new app release',
    pipeline: [
      'The questions live in their own public question bank, separate from the app. That means new questions reach players without waiting for an app update and a store review.',
      'If an update is broken, players never see it. The app keeps using the last set of questions that passed every check.',
    ],
    pipelineSteps: [
      { title: 'Question bank', text: 'A public repository. Every question is checked for format and duplicates before it is published.' },
      { title: 'Cloudflare Worker', text: 'Serves the questions with a version number and an integrity check, so the app knows exactly what it received.' },
      { title: 'The app', text: 'Downloads new questions when it is online and keeps the last good set for offline play.' },
    ],
    arabicTitle: 'Arabic first, not translated',
    arabic: [
      'Arabic is the game\'s first language. Every screen was laid out right to left from the start, the questions are written in formal Arabic, and Quran and hadith text always appears with its exact reference.',
    ],
    testingTitle: 'Testing before release',
    testing: [
      'One TypeScript codebase runs on Android, iOS and the web. The game rules are kept apart from the screens and the storage, so they can be tested on their own, including tests that throw many random inputs at them.',
      'Every change passes automated checks on GitHub before it can ship. Before the Google Play release, more than 12 people played the Android version in a closed test.',
    ],
    rolesTitle: 'What I did',
    roles: [
      'The name and the rebrand (it started life as Arkan)',
      'The scope, the user flows and the written design decisions',
      'The design system and every screen',
      'The code, the tests and the release builds',
      'Finding testers and making the videos',
    ],
    tradeoffTitle: 'A trade-off I chose',
    tradeoff:
      'No accounts. Nobody has to sign up, which keeps the game private and quick to start. The cost is that progress lives on one device and does not move to a new phone.',
    toolsTitle: 'Tools',
    tools:
      'Expo and React Native, TypeScript, Expo Router, NativeWind, Zustand, Reanimated, Jest, Testing Library, fast-check, GitHub Actions, EAS Build and Cloudflare Workers.',
    ctaTitle: 'Have an idea like this?',
    ctaText: 'I can take it from the first conversation to the store, in Arabic, English or both.',
  },
  ar: {
    title: 'قصة فاستبقوا، إبراهيم يوسف',
    description:
      'كيف بنيت فاستبقوا، لعبة أسئلة عربية للعائلة على أندرويد وiOS والويب، من الفكرة الأولى حتى الإصدار على Google Play.',
    back: 'العودة إلى الصفحة الرئيسية',
    h1: 'فاستبقوا: لعبة أسئلة للعائلة كلها، بناها شخص واحد',
    lede:
      'فاستبقوا لعبة أسئلة عربية مجانية عن المعرفة الإسلامية. تتناقل العائلة هاتفًا واحدًا وتتسابق في الإجابة، وكل إجابة تأتي مع شرحها ومصدرها. قمت بكل شيء فيها: الاسم والتصميم والبرمجة والاختبار والإصدار.',
    status: 'اللعبة متاحة على الويب. انتهى الاختبار المغلق لنسخة أندرويد، ويجري تجهيز الإصدار على Google Play.',
    links: [
      { label: 'العب على الويب', href: WEB_GAME_URL },
      { label: 'موقع اللعبة', href: PRODUCT_SITE_URL },
    ],
    facts: [
      { value: '٢ إلى ٦', label: 'لاعبين على هاتف واحد' },
      { value: '٣٧٥', label: 'سؤالًا، كل سؤال تمت مراجعته' },
      { value: '٥ × ٣', label: 'تصنيفات ومستويات' },
      { value: '+١٢', label: 'شخصًا في الاختبار المغلق' },
    ],
    audienceTitle: 'لمن صُنعت',
    audience: [
      'فاستبقوا للعائلات والأصدقاء الذين يريدون لعبة تعلّمهم شيئًا صحيحًا. المنافسة هي ما يجمعهم، والمعرفة هي ما يخرجون به: كل إجابة تعرض شرحًا، والآية أو الحديث الذي تستند إليه، والمرجع بالضبط.',
      'لا إعلانات ولا حسابات. اللعبة تعمل دون إنترنت، وكل ما يفعله اللاعب يبقى على جهازه.',
    ],
    shots: [
      { id: 'home', alt: 'الشاشة الرئيسية في فاستبقوا، وفيها المجلس والتحدي اليومي والإنجازات.', caption: 'الشاشة الرئيسية: المجلس والتحدي اليومي والإنجازات.' },
      { id: 'challenges', alt: 'شاشة التحديات في فاستبقوا، وفيها التحدي اليومي وسباق الوقت.', caption: 'التحديات: الأسئلة العشرة نفسها للجميع كل يوم، أو سباق لمدة دقيقتين.' },
    ],
    localTitle: 'هاتف واحد قبل اللعب عبر الإنترنت',
    local: [
      'بدأ اللعب الجماعي بالمجلس: من ٢ إلى ٦ لاعبين، فرادى أو فرقًا، على جهاز واحد. اللعب على هاتف واحد يحفظ وعود اللعبة: لا خادم، ولا تسجيل دخول، ولا حاجة إلى الإنترنت.',
      'وفيها أيضًا تحدٍّ يومي يحصل فيه الجميع على الأسئلة العشرة نفسها، ونظام تقدّم بالنقاط والمستويات وحلقات الإتقان والإنجازات. الغرف عبر الإنترنت قيد التطوير الآن، ولن تظهر في اللعبة قبل أن تعمل.',
    ],
    pipelineTitle: 'أسئلة جديدة دون إصدار جديد للتطبيق',
    pipeline: [
      'الأسئلة محفوظة في بنك أسئلة عام ومنفصل عن التطبيق. لذلك تصل الأسئلة الجديدة إلى اللاعبين دون انتظار تحديث للتطبيق ومراجعة من المتجر.',
      'وإذا كان التحديث معطوبًا فلن يراه اللاعبون، لأن التطبيق يستمر في استخدام آخر مجموعة أسئلة اجتازت كل الفحوص.',
    ],
    pipelineSteps: [
      { title: 'بنك الأسئلة', text: 'مستودع عام. يُفحص كل سؤال من حيث الصيغة والتكرار قبل نشره.' },
      { title: 'Cloudflare Worker', text: 'يقدّم الأسئلة مع رقم إصدار وفحص سلامة، فيعرف التطبيق بالضبط ما الذي وصله.' },
      { title: 'التطبيق', text: 'ينزّل الأسئلة الجديدة عند الاتصال، ويحتفظ بآخر مجموعة سليمة للعب دون إنترنت.' },
    ],
    arabicTitle: 'العربية أولًا، لا ترجمة',
    arabic: [
      'العربية هي اللغة الأولى للعبة. صُممت كل شاشة من اليمين إلى اليسار منذ البداية، والأسئلة مكتوبة بالفصحى، ونصوص القرآن والحديث تظهر دائمًا مع مرجعها الدقيق.',
    ],
    testingTitle: 'الاختبار قبل الإصدار',
    testing: [
      'كود TypeScript واحد يعمل على أندرويد وiOS والويب. قواعد اللعبة منفصلة عن الشاشات والتخزين، لذلك يمكن اختبارها وحدها، ومن ذلك اختبارات تجرّبها على مدخلات عشوائية كثيرة.',
      'كل تعديل يمرّ بفحوص آلية على GitHub قبل أن يُنشر. وقبل الإصدار على Google Play، لعب أكثر من ١٢ شخصًا نسخة أندرويد في اختبار مغلق.',
    ],
    rolesTitle: 'ما قمت به',
    roles: [
      'الاسم وتغيير الهوية (كان اسمها في البداية أركان)',
      'تحديد النطاق ومسارات المستخدم وتوثيق قرارات التصميم',
      'نظام التصميم وكل الشاشات',
      'البرمجة والاختبارات ونسخ الإصدار',
      'البحث عن المختبرين وصناعة الفيديوهات',
    ],
    tradeoffTitle: 'مقايضة اخترتها',
    tradeoff:
      'لا حسابات. لا يحتاج أحد إلى التسجيل، فتبقى اللعبة خاصة وسريعة البدء. والثمن أن التقدّم يبقى على جهاز واحد ولا ينتقل إلى هاتف جديد.',
    toolsTitle: 'الأدوات',
    tools:
      'Expo وReact Native وTypeScript وExpo Router وNativeWind وZustand وReanimated وJest وTesting Library وfast-check وGitHub Actions وEAS Build وCloudflare Workers.',
    ctaTitle: 'عندك فكرة مثل هذه؟',
    ctaText: 'أستطيع أن آخذها من أول حديث حتى المتجر، بالعربية أو الإنجليزية أو بهما معًا.',
  },
} satisfies Record<Locale, CaseStudyContent>;
