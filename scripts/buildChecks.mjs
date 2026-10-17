export const SITE_URL = 'https://ebrahimyoussef.com';

export function localizedPath(locale, path) {
  if (locale === 'en') return path;
  return path === '/' ? '/ar/' : `/ar${path}`;
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] ?? null;
}

function report(path, check) {
  return `${path}: ${check}`;
}

function hasMeta(metaTags, attributeName, value) {
  return metaTags.some((tag) => {
    const attributeValue = attribute(tag, attributeName);
    return attributeValue?.toLowerCase() === value.toLowerCase() && Boolean(attribute(tag, 'content')?.trim());
  });
}

export function checkPage(html, { locale, path }) {
  const problems = [];
  const expectedPath = localizedPath(locale, path);
  const canonical = `${SITE_URL}${expectedPath}`;
  const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
  const htmlTags = tags(html, 'html');
  const metaTags = tags(html, 'meta');

  if (htmlTags.length !== 1 || attribute(htmlTags[0], 'lang') !== locale || attribute(htmlTags[0], 'dir') !== expectedDir) {
    problems.push(report(path, `html lang and dir must be ${locale}/${expectedDir}`));
  }

  const canonicalLinks = tags(html, 'link').filter((tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical');
  if (canonicalLinks.length !== 1 || attribute(canonicalLinks[0], 'href') !== canonical) {
    problems.push(report(path, `exactly one canonical link must equal ${canonical}`));
  }

  const expectedAlternates = {
    en: `${SITE_URL}${localizedPath('en', path)}`,
    ar: `${SITE_URL}${localizedPath('ar', path)}`,
    'x-default': `${SITE_URL}${localizedPath('en', path)}`,
  };
  const alternateLinks = tags(html, 'link').filter((tag) => attribute(tag, 'rel')?.toLowerCase() === 'alternate');
  if (alternateLinks.length !== 3) {
    problems.push(report(path, 'there must be exactly three hreflang alternate links'));
  }
  for (const [hreflang, href] of Object.entries(expectedAlternates)) {
    const matches = alternateLinks.filter((tag) => attribute(tag, 'hreflang')?.toLowerCase() === hreflang);
    if (matches.length !== 1 || attribute(matches[0], 'href') !== href) {
      problems.push(report(path, `hreflang ${hreflang} must equal ${href}`));
    }
  }

  if (!hasMeta(metaTags, 'property', 'og:locale')) {
    problems.push(report(path, 'missing non-empty og:locale metadata'));
  }
  if (!hasMeta(metaTags, 'property', 'og:url') || !metaTags.some((tag) => attribute(tag, 'property')?.toLowerCase() === 'og:url' && attribute(tag, 'content') === canonical)) {
    problems.push(report(path, `og:url must equal ${canonical}`));
  }

  const socialMetadata = [
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:image'],
    ['property', 'og:image:alt'],
    ['name', 'twitter:card'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
    ['name', 'twitter:image'],
    ['name', 'twitter:image:alt'],
  ];
  for (const [attributeName, value] of socialMetadata) {
    if (!hasMeta(metaTags, attributeName, value)) {
      problems.push(report(path, `missing non-empty ${value} metadata`));
    }
  }

  const jsonLdScripts = tags(html, 'script').filter((tag) => attribute(tag, 'type')?.toLowerCase() === 'application/ld+json');
  let hasValidGraph = false;
  let hasParseableJson = false;
  for (const script of jsonLdScripts) {
    const scriptStart = html.indexOf(script);
    const end = html.indexOf('</script>', scriptStart + script.length);
    const json = end === -1 ? '' : html.slice(scriptStart + script.length, end).trim();
    try {
      const value = JSON.parse(json);
      hasParseableJson = true;
      const graph = Array.isArray(value?.['@graph']) ? value['@graph'] : [value];
      const types = new Set(graph.flatMap((entry) => {
        if (Array.isArray(entry?.['@type'])) return entry['@type'];
        return entry?.['@type'] ? [entry['@type']] : [];
      }));
      if (types.has('Person') && types.has('WebSite')) hasValidGraph = true;
    } catch {
      // The specific parse failure is reported below so the page path is included.
    }
  }
  if (!hasParseableJson) problems.push(report(path, 'a JSON-LD script must contain parseable JSON'));
  if (!hasValidGraph) problems.push(report(path, 'JSON-LD must contain Person and WebSite in its graph'));

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) problems.push(report(path, 'page must contain exactly one h1'));

  const mainCount = tags(html, 'main').filter((tag) => attribute(tag, 'id') === 'main').length;
  if (mainCount !== 1) problems.push(report(path, 'page must contain exactly one main element with id main'));

  if (!tags(html, 'a').some((tag) => attribute(tag, 'href') === '#main')) {
    problems.push(report(path, 'page must contain a skip link to #main'));
  }

  return problems;
}

export function checkForbidden(text, label) {
  const problems = [];
  const lowerText = text.toLowerCase();
  const markers = [
    'googletagmanager',
    'gtag(',
    'g-zsd8rw67l3',
    'analytics-consent',
    'data-analytics',
    'privacy-region',
  ];
  for (const marker of markers) {
    if (lowerText.includes(marker)) problems.push(`${label}: forbidden marker ${marker}`);
  }
  if (/tiktok/i.test(text)) problems.push(`${label}: TikTok links or text are forbidden`);
  if (/href\s*=\s*["']\s*(?:#\s*)?["']/i.test(text)) problems.push(`${label}: empty links and href="#" are forbidden`);
  if (/\b(?:TBD|TODO|coming soon|lorem)\b/i.test(text)) problems.push(`${label}: placeholder text is forbidden`);
  if (/Tukh|طوخ|Qalyubia|القليوبية/i.test(text)) problems.push(`${label}: the forbidden town name is present`);
  return problems;
}

export function checkPdf(bytes) {
  const problems = [];
  let view;
  try {
    view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  } catch {
    return ['PDF: bytes must be a byte array'];
  }
  const header = new TextDecoder().decode(view.slice(0, 5));
  if (header !== '%PDF-') problems.push('PDF: file must start with %PDF-');
  if (view.byteLength <= 10 * 1024) problems.push('PDF: file must be larger than 10 KB');
  return problems;
}
