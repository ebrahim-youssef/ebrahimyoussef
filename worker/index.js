const EXTRA_CONSENT_COUNTRIES = new Set(['IS', 'LI', 'NO', 'GB', 'CH']);

export function requiresConsent(cf) {
  if (!cf) return true;
  if (cf.isEUCountry === '1') return true;

  return typeof cf.country === 'string' && EXTRA_CONSENT_COUNTRIES.has(cf.country.toUpperCase());
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/api/privacy-region') {
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET' },
      });
    }

    return Response.json(
      { requiresConsent: requiresConsent(request.cf) },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  return env.ASSETS.fetch(request);
}

export default { fetch: handleRequest };
