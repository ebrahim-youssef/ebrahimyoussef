import { type Locale } from './locale';

type SectionId = 'services' | 'results' | 'work' | 'method' | 'about' | 'contact';
type WorkId = 'fastabiqu' | 'institution' | 'store' | 'calendar' | 'quote-vault' | 'figures';

type LandingLink = { label: string; href: string };
type LandingFields = { name: string; contact: string; message: string };

interface LandingContent {
  title: string;
  nav: { id: SectionId; label: string; ar?: string }[];
  navLabel: string;
  h1: string;
  sub: string;
  seeWork: string;
  servicesTitle: string;
  proofLabel: string;
  services: { id: 'websites' | 'apps' | 'systems' | 'arabic'; ar?: string; title: string; text: string; proof: string }[];
  resultsTitle: string;
  results: { big: string; who: string; text: string }[];
  workTitle: string;
  work: {
    id: WorkId;
    ar?: string;
    name: string;
    who: string;
    text: string;
    facts?: { value: string; label: string }[];
    links?: LandingLink[];
  }[];
  methodTitle: string;
  steps: { title: string; text: string }[];
  aboutTitle: string;
  about: string;
  cv: LandingLink;
  journey: { when: string; title: string; text: string }[];
  contactTitle: string;
  orEmail: string;
  bookCall: string;
  formTitle: string;
  fields: LandingFields;
  fieldErrors: LandingFields;
  contactPlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  failed: string;
  formNeedsScript: string;
  footer: string;
  switchLabel: string;
  waButton: string;
  copy: string;
  copied: string;
  copyFallback: string;
  nameLabel: string;
  daftarLink: string;
  daftarSmall: string;
}

export const landing = {
  en: {
    title: 'Ebrahim Youssef, web and app developer',
    nav: [
      { id: 'services', label: 'Services', ar: 'خدماتي' },
      { id: 'results', label: 'Results', ar: 'نتائج' },
      { id: 'work', label: 'Work', ar: 'أعمالي' },
      { id: 'method', label: 'How it works', ar: 'طريقتي' },
      { id: 'about', label: 'About', ar: 'عنّي' },
      { id: 'contact', label: 'Contact', ar: 'تواصل' },
    ],
    navLabel: 'Sections',
    h1: 'I build websites and apps, from the <em>first idea</em> to launch day.',
    sub: 'Web and app developer in Egypt. I work with businesses, brands and people who want to build something.',
    seeWork: 'See the work',
    servicesTitle: 'What I can build for you',
    proofLabel: 'Done before:',
    services: [
      { id: 'websites', ar: 'مواقع', title: 'Websites', text: 'A site for your business or brand that loads fast and reads well on every phone, in Arabic, English or both.', proof: 'An online store for AFDV Marketing' },
      { id: 'apps', ar: 'تطبيقات', title: 'Mobile apps', text: 'Android apps built and tested on real phones, then prepared for the Google Play store.', proof: 'Fastabiqu, a family quiz game' },
      { id: 'systems', ar: 'أنظمة', title: 'Systems for your team', text: 'The screens your staff log into every day: records, progress tracking, weekly reports.', proof: 'Student progress tracking for an education institution' },
      { id: 'arabic', ar: 'عربي أولًا', title: 'Arabic done properly', text: 'Right-to-left layouts and Arabic text planned from the first screen, so Arabic readers feel at home.', proof: 'Every product I have shipped' },
    ],
    resultsTitle: 'What the work actually did',
    results: [
      { big: 'One phone. Six players.', who: 'Fastabiqu · my own product', text: 'A family quiz game where 2 to 6 people pass one phone around and race to answer.' },
      { big: '375 questions, each one reviewed.', who: 'Fastabiqu · content', text: '5 categories and 3 levels, plus a daily challenge where everyone gets the same 10 questions.' },
      { big: '12+ people tested it first.', who: 'Fastabiqu · closed test', text: 'The web game is live. The closed test is done, and the Google Play release is being prepared.' },
      { big: 'Student progress, tracked in Arabic.', who: 'Islamic Educational Institution · 2026', text: 'Arabic-first screens for weekly assessments and student progress, plus Excel and Telegram tools for the staff.' },
      { big: 'An online store, from designs to launch.', who: 'AFDV Marketing · 2023', text: "Built from the agency's designs, with a content system the team could edit themselves and an event calendar." },
      { big: 'Freelance clients, delivered.', who: 'Freelance clients on Upwork · 2022', text: "Content calendar screens built from the client's designs, and new features added to an existing web app." },
    ],
    workTitle: 'Work I have delivered',
    work: [
      { id: 'fastabiqu', ar: 'فاستبقوا', name: 'Fastabiqu', who: 'My own product · 2026', text: 'A free family quiz game. 2 to 6 people share one phone and race to answer, or everyone plays the same daily challenge. The web game is live and the Google Play release is being prepared.', facts: [{ value: '375', label: 'questions, each one reviewed' }, { value: '2 to 6', label: 'players on one phone' }, { value: '12+', label: 'people in the closed test' }], links: [{ label: 'Read the story', href: '/fastabiqu/' }, { label: 'Play it', href: 'https://fastabiqu.ebrahimyoussef.com' }] },
      { id: 'institution', ar: 'متابعة الطلاب', name: 'Student progress system', who: 'Islamic Educational Institution · 2026', text: 'Arabic-first screens for tracking student progress and weekly assessments, plus Excel and Telegram tools that save the staff time.' },
      { id: 'store', ar: 'متجر', name: 'Online store', who: 'AFDV Marketing · 2023', text: "An online store built from the agency's designs, with a content system the team could edit themselves and an event calendar." },
      { id: 'calendar', ar: 'تقويم', name: 'Content calendar', who: 'Freelance clients on Upwork · 2022', text: "Content calendar screens built from the client's designs, and new features added to an existing web app." },
      { id: 'quote-vault', ar: 'خزانة الاقتباسات', name: 'Quote Vault', who: 'My own app', text: 'Save and organize quotes in Arabic and English, with accounts and light and dark themes.', links: [{ label: 'Source', href: 'https://github.com/ebrahim-youssef/quote-vault' }] },
      { id: 'figures', ar: 'من هو؟', name: 'Guess the figure', who: 'In my daftar', text: 'A guessing game about Islamic historical figures, played in Arabic or English.', links: [{ label: 'Play it', href: '/daftar/#play' }] },
    ],
    methodTitle: 'How we work together',
    steps: [
      { title: 'We talk', text: 'You tell me who it is for and what they do today.' },
      { title: 'We pick the first version', text: 'The smallest version worth launching, with a clear scope.' },
      { title: 'I design the screens', text: 'You see how it looks and works before I build it.' },
      { title: 'I build and test', text: 'In small pieces you can check, on real phones and browsers.' },
      { title: 'Launch, then improve', text: 'It goes live, real people use it, and the next version follows what they say.' },
    ],
    aboutTitle: 'From nursing to my own products',
    about: "I'm Ebrahim, a developer in Egypt. I studied nursing first, then taught myself to build software. Now I build websites and apps in Arabic and English, and I like owning the whole thing: the idea, the screens, the build, the launch and what users say after.",
    cv: { label: 'Download my CV (PDF)', href: '/cv.pdf' },
    journey: [
      { when: 'Before 2022', title: 'Nursing', text: 'I studied nursing first.' },
      { when: '2022', title: 'Self-taught, then freelance', text: 'Udacity courses in web and React development, then my first clients on Upwork.' },
      { when: '2023', title: 'Marketing agency', text: 'Developer at AFDV Marketing: an online store and the tools behind it.' },
      { when: '2024 to 2025', title: 'Military service', text: 'Mandatory military service in Egypt.' },
      { when: '2026', title: 'Education institution', text: 'Software developer building student progress tools.' },
      { when: 'Now', title: 'My own products', text: 'Fastabiqu is live on the web, with the Google Play release in preparation.' },
    ],
    contactTitle: 'Need something built, or hiring for your team?',
    orEmail: 'Or email me',
    bookCall: 'Book a call',
    formTitle: 'Or tell me here',
    fields: { name: 'Your name', contact: 'Email or WhatsApp number', message: 'What do you want to build?' },
    contactPlaceholder: 'you@email.com or 010 1234 5678',
    fieldErrors: { name: 'Add your name.', contact: 'Enter your email or WhatsApp number. Outside Egypt, add the country code, like +971.', message: 'Tell me a little about what you want to build.' },
    send: 'Send message',
    sending: 'Sending…',
    sent: 'Thanks, your message is on its way to my inbox.',
    failed: "That didn't send. Message me on WhatsApp or email me instead.",
    formNeedsScript: 'The form needs JavaScript. WhatsApp and email work without it.',
    footer: 'Ebrahim Youssef · Egypt',
    switchLabel: 'عربي',
    waButton: 'Message me on WhatsApp',
    copy: 'Copy email',
    copied: 'Email copied',
    copyFallback: 'Press Ctrl+C to copy',
    nameLabel: 'Ebrahim Youssef, written in Arabic',
    daftarLink: 'Daftar',
    daftarSmall: 'my notebook',
  },
  ar: {
    title: 'إبراهيم يوسف، مطوّر مواقع وتطبيقات',
    nav: [
      { id: 'services', label: 'خدماتي' },
      { id: 'results', label: 'نتائج' },
      { id: 'work', label: 'أعمالي' },
      { id: 'method', label: 'طريقتي' },
      { id: 'about', label: 'عنّي' },
      { id: 'contact', label: 'تواصل' },
    ],
    navLabel: 'الأقسام',
    h1: 'أبني المواقع والتطبيقات، من <em>أول فكرة</em> حتى يوم الإطلاق.',
    sub: 'مطوّر مواقع وتطبيقات في مصر. أعمل مع الشركات والعلامات التجارية والأفراد الذين يريدون بناء شيء.',
    seeWork: 'شاهد أعمالي',
    servicesTitle: 'ما الذي أستطيع بناءه لك',
    proofLabel: 'نفّذته من قبل:',
    services: [
      { id: 'websites', title: 'مواقع', text: 'موقع لعملك أو علامتك التجارية، سريع وواضح على كل هاتف، بالعربية أو الإنجليزية أو بهما معًا.', proof: 'متجر إلكتروني لوكالة AFDV Marketing' },
      { id: 'apps', title: 'تطبيقات', text: 'تطبيقات أندرويد أبنيها وأختبرها على هواتف حقيقية، ثم أجهّزها لمتجر Google Play.', proof: 'فاستبقوا، لعبة أسئلة عائلية' },
      { id: 'systems', title: 'أنظمة لفريقك', text: 'الشاشات التي يدخل إليها فريقك كل يوم: السجلات ومتابعة التقدّم والتقارير الأسبوعية.', proof: 'نظام متابعة الطلاب لمؤسسة تعليمية' },
      { id: 'arabic', title: 'عربي أولًا', text: 'صفحات من اليمين إلى اليسار ونصوص عربية مخطّط لها من أول شاشة، حتى يشعر القارئ العربي أنه في بيته.', proof: 'كل منتج أطلقته' },
    ],
    resultsTitle: 'ماذا حققت هذه الأعمال',
    results: [
      { big: 'هاتف واحد. ستة لاعبين.', who: 'فاستبقوا · منتجي الخاص', text: 'لعبة أسئلة عائلية يتناوب فيها من ٢ إلى ٦ أشخاص على هاتف واحد ويتسابقون في الإجابة.' },
      { big: '٣٧٥ سؤالًا، كل سؤال تمت مراجعته.', who: 'فاستبقوا · المحتوى', text: '٥ تصنيفات و٣ مستويات، وتحدٍّ يومي يحصل فيه الجميع على الأسئلة العشرة نفسها.' },
      { big: 'جرّبه أكثر من ١٢ شخصًا أولًا.', who: 'فاستبقوا · الاختبار المغلق', text: 'اللعبة متاحة على الويب. انتهى الاختبار المغلق، ويجري تجهيز الإصدار على Google Play.' },
      { big: 'متابعة تقدّم الطلاب بالعربية.', who: 'مؤسسة تعليمية إسلامية · ٢٠٢٦', text: 'شاشات عربية أولًا للتقييمات الأسبوعية وتقدّم الطلاب، مع أدوات Excel وTelegram للموظفين.' },
      { big: 'متجر إلكتروني، من التصميم حتى الإطلاق.', who: 'AFDV Marketing · ٢٠٢٣', text: 'بنيته من تصاميم الوكالة، مع نظام محتوى يعدّله الفريق بنفسه وتقويم للفعاليات.' },
      { big: 'عملاء مستقلون، تم التسليم.', who: 'عملاء على Upwork · ٢٠٢٢', text: 'شاشات تقويم محتوى من تصاميم العميل، وميزات جديدة أُضيفت إلى تطبيق ويب قائم.' },
    ],
    workTitle: 'أعمال سلّمتها',
    work: [
      { id: 'fastabiqu', name: 'فاستبقوا', who: 'منتجي الخاص · ٢٠٢٦', text: 'لعبة أسئلة عائلية مجانية. من ٢ إلى ٦ أشخاص يتشاركون هاتفًا واحدًا ويتسابقون في الإجابة، أو يلعب الجميع التحدي اليومي نفسه. اللعبة متاحة على الويب، وإصدار Google Play قيد التجهيز.', facts: [{ value: '٣٧٥', label: 'سؤالًا، كل سؤال تمت مراجعته' }, { value: '٢ إلى ٦', label: 'لاعبين على هاتف واحد' }, { value: '١٢', label: 'شخصًا وأكثر في الاختبار المغلق' }], links: [{ label: 'اقرأ القصة', href: '/fastabiqu/' }, { label: 'العبها', href: 'https://fastabiqu.ebrahimyoussef.com' }] },
      { id: 'institution', name: 'متابعة الطلاب', who: 'مؤسسة تعليمية إسلامية · ٢٠٢٦', text: 'شاشات عربية أولًا لمتابعة تقدّم الطلاب والتقييمات الأسبوعية، مع أدوات Excel وTelegram توفّر وقت الموظفين.' },
      { id: 'store', name: 'متجر', who: 'AFDV Marketing · ٢٠٢٣', text: 'متجر إلكتروني من تصاميم الوكالة، مع نظام محتوى يعدّله الفريق بنفسه وتقويم للفعاليات.' },
      { id: 'calendar', name: 'تقويم', who: 'عملاء على Upwork · ٢٠٢٢', text: 'شاشات تقويم محتوى من تصاميم العميل، وميزات جديدة أُضيفت إلى تطبيق ويب قائم.' },
      { id: 'quote-vault', name: 'خزانة الاقتباسات', who: 'تطبيقي الخاص', text: 'احفظ اقتباساتك ونظّمها بالعربية والإنجليزية، مع حسابات ووضعين فاتح وداكن.', links: [{ label: 'الكود المصدري', href: 'https://github.com/ebrahim-youssef/quote-vault' }] },
      { id: 'figures', name: 'من هو؟', who: 'في دفتري', text: 'لعبة تخمين عن شخصيات من التاريخ الإسلامي، بالعربية أو الإنجليزية.', links: [{ label: 'العبها', href: '/daftar/#play' }] },
    ],
    methodTitle: 'كيف نعمل معًا',
    steps: [
      { title: 'نتكلم', text: 'تخبرني لمن هذا المنتج وماذا يفعلون اليوم.' },
      { title: 'نتفق', text: 'على أصغر نسخة تستحق الإطلاق، بنطاق واضح.' },
      { title: 'أصمم', text: 'ترى الشكل وطريقة العمل قبل أن أبدأ البناء.' },
      { title: 'أبني', text: 'على أجزاء صغيرة تستطيع مراجعتها، على هواتف ومتصفحات حقيقية.' },
      { title: 'نطلق', text: 'يصبح متاحًا ويستخدمه الناس، وتتبع النسخة التالية ما يقولونه.' },
    ],
    aboutTitle: 'من التمريض إلى منتجاتي الخاصة',
    about: 'أنا إبراهيم، مطوّر من مصر. درست التمريض أولًا، ثم تعلّمت بناء البرمجيات بنفسي. اليوم أبني مواقع وتطبيقات بالعربية والإنجليزية، وأحب أن أتولى العمل كله: الفكرة والشاشات والبناء والإطلاق، وما يقوله المستخدمون بعد ذلك.',
    cv: { label: 'حمّل سيرتي الذاتية (PDF بالإنجليزية)', href: '/cv.pdf' },
    journey: [
      { when: 'قبل ٢٠٢٢', title: 'التمريض', text: 'درست التمريض أولًا.' },
      { when: '٢٠٢٢', title: 'تعلّم ذاتي ثم عمل حر', text: 'دورات Udacity في تطوير الويب وReact، ثم أول عملائي على Upwork.' },
      { when: '٢٠٢٣', title: 'وكالة تسويق', text: 'مطوّر في AFDV Marketing: متجر إلكتروني والأدوات التي تديره.' },
      { when: '٢٠٢٤ إلى ٢٠٢٥', title: 'الخدمة العسكرية', text: 'الخدمة العسكرية الإلزامية في مصر.' },
      { when: '٢٠٢٦', title: 'مؤسسة تعليمية', text: 'مطوّر برمجيات يبني أدوات متابعة الطلاب.' },
      { when: 'الآن', title: 'منتجاتي الخاصة', text: 'فاستبقوا متاحة على الويب، وإصدار Google Play قيد التجهيز.' },
    ],
    contactTitle: 'تحتاج إلى بناء شيء، أو توظّف لفريقك؟',
    orEmail: 'أو راسلني بالبريد',
    bookCall: 'احجز مكالمة',
    formTitle: 'أو اكتب لي هنا',
    fields: { name: 'اسمك', contact: 'بريدك أو رقم واتساب', message: 'ماذا تريد أن تبني؟' },
    contactPlaceholder: 'you@email.com أو 010 1234 5678',
    fieldErrors: { name: 'اكتب اسمك.', contact: 'اكتب بريدك أو رقم واتساب. من خارج مصر، أضف كود الدولة، مثل ‎+971.', message: 'أخبرني قليلًا عمّا تريد بناءه.' },
    send: 'أرسل الرسالة',
    sending: 'جارٍ الإرسال…',
    sent: 'شكرًا، رسالتك في طريقها إلى بريدي.',
    failed: 'لم تُرسل الرسالة. راسلني على واتساب أو بالبريد بدلًا من ذلك.',
    formNeedsScript: 'النموذج يحتاج JavaScript. واتساب والبريد يعملان بدونه.',
    footer: 'إبراهيم يوسف · مصر',
    switchLabel: 'English',
    waButton: 'راسلني على واتساب',
    copy: 'انسخ البريد',
    copied: 'تم نسخ البريد',
    copyFallback: 'اضغط Ctrl+C للنسخ',
    nameLabel: 'إبراهيم يوسف، مكتوبًا بخط الرقعة',
    daftarLink: 'دفتري',
    daftarSmall: '',
  },
} satisfies Record<Locale, LandingContent>;
