// @ts-check

const MAX_BODY_BYTES = 8192;
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_FROM = 'website@ebrahimyoussef.com';
const EMAIL_SUBJECT = 'New message from ebrahimyoussef.com';
/** @type {Record<string, string>} */
const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** @type {Array<['name' | 'contact' | 'message', number]>} */
const CONTACT_FIELD_LIMITS = [
  ['name', 100],
  ['contact', 200],
  ['message', 3000],
];

/**
 * @typedef {{ send: any }} ContactEmailBinding
 * @typedef {{ limit: any }} ContactLimiter
 * @typedef {{ CONTACT_EMAIL: ContactEmailBinding, CONTACT_LIMITER: ContactLimiter, TURNSTILE_SECRET_KEY: string, TURNSTILE_HOSTNAME: string, CONTACT_TO: string }} ContactEnvironment
 * @typedef {{ name?: unknown, contact?: unknown, message?: unknown, website?: unknown, token?: unknown }} ContactPayload
 * @typedef {{ to: string, from: string, subject: string, text: string, html: string, replyTo?: string }} ContactEmailMessage
 */

/** @param {Record<string, unknown>} body @param {number} status @param {Record<string, string>} [extraHeaders] */
function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

/** @param {string} value */
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

/** @param {string} value */
function isReplyToEmail(value) {
  return /^[^\s,<>@]+@[^\s,<>@]+\.[^\s,<>@]+$/.test(value);
}

/** @param {Request} request @param {ContactEnvironment} env @returns {Promise<Response>} */
export async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false }, 405, { Allow: 'POST' });
  }

  const requestOrigin = new URL(request.url).origin;
  if (request.headers.get('Origin') !== requestOrigin) {
    return jsonResponse({ ok: false }, 403);
  }

  const declaredLength = request.headers.get('Content-Length');
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false }, 413);
  }

  const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return jsonResponse({ ok: false }, 400);
  }

  if (!request.body) {
    return jsonResponse({ ok: false }, 400);
  }

  /** @type {Uint8Array[]} */
  const chunks = [];
  let bodyLength = 0;
  try {
    const reader = request.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bodyLength += value.byteLength;
      if (bodyLength > MAX_BODY_BYTES) {
        await reader.cancel();
        return jsonResponse({ ok: false }, 413);
      }
      chunks.push(value);
    }
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  const bodyBytes = new Uint8Array(bodyLength);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const bodyText = new TextDecoder().decode(bodyBytes);

  /** @type {ContactPayload} */
  let payload;
  try {
    const parsed = JSON.parse(bodyText);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return jsonResponse({ ok: false }, 400);
    }
    payload = parsed;
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return jsonResponse({ ok: true }, 200);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const limit = await env.CONTACT_LIMITER.limit({ key: ip });
  if (!limit.success) {
    return jsonResponse({ ok: false }, 429);
  }

  for (const [field, maxLength] of CONTACT_FIELD_LIMITS) {
    const value = payload[field];
    if (typeof value !== 'string' || value.trim() === '' || value.length > maxLength) {
      return jsonResponse({ ok: false, field }, 400);
    }
  }

  if (typeof payload.token !== 'string' || payload.token.trim() === '' || payload.token.length > 2048) {
    return jsonResponse({ ok: false }, 403);
  }

  const name = String(payload.name).trim();
  const contact = String(payload.contact).trim();
  const message = String(payload.message).trim();
  const token = String(payload.token).trim();
  const verificationBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: ip,
  });

  let verification;
  try {
    const verificationResponse = await fetch(TURNSTILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationBody,
      signal: AbortSignal.timeout(5000),
    });
    if (!verificationResponse.ok) {
      return jsonResponse({ ok: false }, 503);
    }
    verification = await verificationResponse.json();
  } catch {
    return jsonResponse({ ok: false }, 503);
  }

  if (Array.isArray(verification?.['error-codes']) && verification['error-codes'].length > 0) {
    console.warn('Turnstile verification error codes', verification['error-codes']);
  }
  if (verification?.success !== true || verification.hostname !== env.TURNSTILE_HOSTNAME) {
    return jsonResponse({ ok: false }, 403);
  }

  const text = `Name: ${name}\nContact: ${contact}\nMessage: ${message}`;
  const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Contact:</strong> ${escapeHtml(contact)}</p><p><strong>Message:</strong> ${escapeHtml(message)}</p>`;
  /** @type {ContactEmailMessage} */
  const email = {
    to: env.CONTACT_TO,
    from: EMAIL_FROM,
    subject: EMAIL_SUBJECT,
    text,
    html,
  };
  if (isReplyToEmail(contact)) email.replyTo = contact;

  try {
    await env.CONTACT_EMAIL.send(email);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = /** @type {{ code?: unknown }} */ (error)?.code;
    console.error('Contact email send failed:', errorCode, errorMessage);
    return jsonResponse({ ok: false }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
