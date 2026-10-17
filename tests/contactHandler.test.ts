import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { handleContact } from '../worker/contact.js';

const origin = 'https://ebrahimyoussef.com';
const validBody = {
  name: 'Visitor',
  contact: 'visitor@example.com',
  message: 'I would like to build a website.',
  website: '',
  token: 'turnstile-token',
};

type FakeEnvironment = {
  CONTACT_EMAIL: { send: ReturnType<typeof vi.fn> };
  CONTACT_LIMITER: { limit: ReturnType<typeof vi.fn> };
  TURNSTILE_SECRET_KEY: string;
  TURNSTILE_HOSTNAME: string;
  CONTACT_TO: string;
};

type StreamRequestInit = RequestInit & { duplex: 'half' };

function makeEnvironment(success = true): FakeEnvironment {
  return {
    CONTACT_EMAIL: { send: vi.fn().mockResolvedValue(undefined) },
    CONTACT_LIMITER: { limit: vi.fn().mockResolvedValue({ success }) },
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
    TURNSTILE_HOSTNAME: 'ebrahimyoussef.com',
    CONTACT_TO: 'owner@example.com',
  };
}

function makeRequest(body: unknown = validBody, headers: Record<string, string> = {}): Request {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  return response.json() as Promise<Record<string, unknown>>;
}

describe('contact handler', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, hostname: 'ebrahimyoussef.com' }), { status: 200 }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('rejects non-POST requests before checking the origin', async () => {
    const request = new Request(`${origin}/api/contact`, { method: 'GET' });
    const response = await handleContact(request, makeEnvironment());

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  test('rejects a request with no Origin header', async () => {
    const request = new Request(`${origin}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    const environment = makeEnvironment();

    const response = await handleContact(request, environment);

    expect(response.status).toBe(403);
    expect(environment.CONTACT_LIMITER.limit).not.toHaveBeenCalled();
  });

  test('rejects a request from a foreign Origin', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(validBody, { Origin: 'https://example.com' }), environment);

    expect(response.status).toBe(403);
    expect(environment.CONTACT_LIMITER.limit).not.toHaveBeenCalled();
  });

  test('rejects a request whose Content-Length exceeds 8 KB', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(validBody, { 'Content-Length': '8193' }), environment);

    expect(response.status).toBe(413);
  });

  test('rejects a request whose actual body exceeds 8 KB', async () => {
    const environment = makeEnvironment();
    const body = JSON.stringify({ ...validBody, message: 'x'.repeat(8200) });
    const response = await handleContact(makeRequest(body), environment);

    expect(response.status).toBe(413);
  });

  test('cancels an unknown-length body as soon as it exceeds 8 KB', async () => {
    const environment = makeEnvironment();
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('x'.repeat(8193)));
        setTimeout(() => {
          try {
            controller.close();
          } catch {
            // The handler cancels the stream before the scheduled close.
          }
        }, 0);
      },
      cancel,
    });
    const request = new Request(`${origin}/api/contact`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body,
      duplex: 'half',
    } as StreamRequestInit);

    const response = await handleContact(request, environment);

    expect(response.status).toBe(413);
    expect(cancel).toHaveBeenCalledOnce();
  });

  test('rejects a request with the wrong Content-Type', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(validBody, { 'Content-Type': 'text/plain' }), environment);

    expect(response.status).toBe(400);
    expect(environment.CONTACT_LIMITER.limit).not.toHaveBeenCalled();
  });

  test('rejects a wrong Content-Type without reading a large body', async () => {
    const environment = makeEnvironment();
    let pullCount = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pullCount += 1;
        if (pullCount === 1) {
          controller.enqueue(new Uint8Array([123]));
        } else {
          controller.enqueue(new TextEncoder().encode('x'.repeat(9000)));
          controller.close();
        }
      },
    });
    const request = new Request(`${origin}/api/contact`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'text/plain' },
      body,
      duplex: 'half',
    } as StreamRequestInit);

    const response = await handleContact(request, environment);

    expect(response.status).toBe(400);
    expect(pullCount).toBe(1);
  });

  test('rejects a request with no body', async () => {
    const environment = makeEnvironment();
    const request = new Request(`${origin}/api/contact`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
    });

    const response = await handleContact(request, environment);

    expect(response.status).toBe(400);
  });

  test('rejects malformed JSON', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest('{not json'), environment);

    expect(response.status).toBe(400);
  });

  test('rejects a JSON array instead of an object', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest([validBody]), environment);

    expect(response.status).toBe(400);
  });

  test('silently accepts the honeypot without rate limiting, verification, or sending', async () => {
    const environment = makeEnvironment();
    const fetchMock = vi.mocked(globalThis.fetch);
    const response = await handleContact(makeRequest({ ...validBody, website: 'https://bot.example' }), environment);

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toEqual({ ok: true });
    expect(environment.CONTACT_LIMITER.limit).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(environment.CONTACT_EMAIL.send).not.toHaveBeenCalled();
  });

  test('returns too many requests when the IP rate limit rejects the request', async () => {
    const environment = makeEnvironment(false);
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(429);
    expect(environment.CONTACT_LIMITER.limit).toHaveBeenCalledWith({ key: 'unknown' });
  });

  test.each([
    ['name'],
    ['contact'],
    ['message'],
  ] as const)('rejects a request with a missing %s field', async (field) => {
    const environment = makeEnvironment();
    const body = { ...validBody };
    delete body[field];

    const response = await handleContact(makeRequest(body), environment);

    expect(response.status).toBe(400);
    expect(await responseBody(response)).toMatchObject({ ok: false, field });
  });

  test.each([
    ['name', 'x'.repeat(101)],
    ['contact', 'x'.repeat(201)],
    ['message', 'x'.repeat(3001)],
  ] as const)('rejects a %s field over its length limit', async (field, value) => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest({ ...validBody, [field]: value }), environment);

    expect(response.status).toBe(400);
    expect(await responseBody(response)).toMatchObject({ ok: false, field });
  });

  test('rejects a missing Turnstile token', async () => {
    const environment = makeEnvironment();
    const { token: _token, ...body } = validBody;
    const response = await handleContact(makeRequest(body), environment);

    expect(response.status).toBe(403);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('returns service unavailable when Turnstile fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('verification unavailable')));
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(503);
    expect(environment.CONTACT_EMAIL.send).not.toHaveBeenCalled();
  });

  test('returns service unavailable when Turnstile returns a non-success status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('unavailable', { status: 503 })));
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(503);
    expect(environment.CONTACT_EMAIL.send).not.toHaveBeenCalled();
  });

  test('rejects a failed Turnstile verification', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), { status: 200 }),
      ),
    );
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(403);
    expect(environment.CONTACT_EMAIL.send).not.toHaveBeenCalled();
  });

  test('rejects a Turnstile response for the wrong hostname', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, hostname: 'example.com' }), { status: 200 }),
      ),
    );
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(403);
    expect(environment.CONTACT_EMAIL.send).not.toHaveBeenCalled();
  });

  test('returns bad gateway when sending the email throws', async () => {
    const environment = makeEnvironment();
    environment.CONTACT_EMAIL.send.mockRejectedValue(new Error('mail service failed'));
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(502);
  });

  test('sends a valid message with the fixed sender and subject', async () => {
    const environment = makeEnvironment();
    const response = await handleContact(makeRequest(), environment);

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toEqual({ ok: true });
    expect(environment.CONTACT_EMAIL.send).toHaveBeenCalledOnce();
    expect(environment.CONTACT_EMAIL.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
        from: 'website@ebrahimyoussef.com',
        subject: 'New message from ebrahimyoussef.com',
      }),
    );
  });

  test('sets Reply-To for a valid email address', async () => {
    const environment = makeEnvironment();
    await handleContact(makeRequest({ ...validBody, contact: 'visitor@example.com' }), environment);

    expect(environment.CONTACT_EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'visitor@example.com' }));
  });

  test('omits Reply-To for a phone number', async () => {
    const environment = makeEnvironment();
    await handleContact(makeRequest({ ...validBody, contact: '+201012345678' }), environment);

    expect(environment.CONTACT_EMAIL.send.mock.calls[0][0]).not.toHaveProperty('replyTo');
  });

  test('omits Reply-To for an address containing a header injection', async () => {
    const environment = makeEnvironment();
    await handleContact(makeRequest({ ...validBody, contact: 'a@b.com\r\nBcc: x@y.com' }), environment);

    expect(environment.CONTACT_EMAIL.send.mock.calls[0][0]).not.toHaveProperty('replyTo');
  });

  test('HTML-escapes visitor values in the sent message', async () => {
    const environment = makeEnvironment();
    await handleContact(makeRequest({ ...validBody, message: '<script>alert("x")</script> & \'quoted\'' }), environment);

    expect(environment.CONTACT_EMAIL.send.mock.calls[0][0].html).toContain(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quoted&#39;',
    );
  });

  test('does not call Turnstile when a field is invalid', async () => {
    const environment = makeEnvironment();
    const fetchMock = vi.mocked(globalThis.fetch);
    const response = await handleContact(makeRequest({ ...validBody, name: '' }), environment);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
