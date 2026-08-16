import { describe, expect, it, vi } from 'vitest';
import worker, { requiresConsent } from '../worker/index.js';

interface RequestGeo {
  isEUCountry?: string;
  country?: string;
}

function requestWithGeo(url: string, init: RequestInit = {}, cf?: RequestGeo): Request {
  const request = new Request(url, init);
  Object.defineProperty(request, 'cf', { value: cf });
  return request;
}

describe('requiresConsent', () => {
  it.each([
    [{ isEUCountry: '1', country: 'DE' }, true],
    [{ isEUCountry: '0', country: 'IS' }, true],
    [{ isEUCountry: '0', country: 'LI' }, true],
    [{ isEUCountry: '0', country: 'NO' }, true],
    [{ isEUCountry: '0', country: 'GB' }, true],
    [{ isEUCountry: '0', country: 'CH' }, true],
    [{ isEUCountry: '0', country: 'US' }, false],
    [undefined, true],
  ])('maps %o to %s', (cf, expected) => {
    expect(requiresConsent(cf)).toBe(expected);
  });
});

describe('privacy-region Worker', () => {
  it('returns only the no-store consent decision', async () => {
    const response = await worker.fetch(
      requestWithGeo('https://example.com/api/privacy-region', {}, { isEUCountry: '1', country: 'FR' }),
      { ASSETS: { fetch: vi.fn() } },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({ requiresConsent: true });
  });

  it('rejects unsupported endpoint methods', async () => {
    const response = await worker.fetch(
      requestWithGeo('https://example.com/api/privacy-region', { method: 'POST' }),
      { ASSETS: { fetch: vi.fn() } },
    );

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
  });

  it('delegates non-endpoint requests to static assets', async () => {
    const fetch = vi.fn(async () => new Response('static asset'));
    const request = requestWithGeo('https://example.com/index.html');

    const response = await worker.fetch(request, { ASSETS: { fetch } });

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(request);
    expect(await response.text()).toBe('static asset');
  });
});
