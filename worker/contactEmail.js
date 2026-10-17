// @ts-check
import { classifyContact } from './contactValidation.js';

const SITE_HOST = 'ebrahimyoussef.com';
const MAX_DISPLAY_NAME_LENGTH = 60;
const PREVIEW_LENGTH = 110;
const FONT_STACK = "'Readex Pro', 'Segoe UI', Tahoma, Arial, sans-serif";
// Site tokens from src/styles/global.css, inlined because mail clients ignore stylesheets.
const COLOR = {
  ground: '#43210e',
  cream: '#f7f1e8',
  paper: '#fffaf2',
  ink: '#2b2118',
  muted: '#665b51',
  gold: '#deaf59',
  rustInk: '#934312',
  line: '#e8dccb',
};
/** @type {Record<string, string>} */
const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** @param {string} value */
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

/** Header-safe name: no line breaks or address delimiters, so it cannot inject headers or a fake address. @param {string} name */
function toDisplayName(name) {
  const cleaned = name.replace(/[\u0000-\u001f\u007f"<>@,;:\\]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned.slice(0, MAX_DISPLAY_NAME_LENGTH) || 'Visitor';
}

/** @param {string} message */
function toPreview(message) {
  const flat = message.replace(/\s+/g, ' ').trim();
  return flat.length > PREVIEW_LENGTH ? `${flat.slice(0, PREVIEW_LENGTH - 1)}…` : flat;
}

/** @param {string} contact @param {string} displayName */
function describeReply(contact, displayName) {
  const classified = classifyContact(contact);
  if (classified?.kind === 'email') {
    const subject = encodeURIComponent(`Re: your message on ${SITE_HOST}`);
    return {
      label: 'Email',
      shown: classified.address,
      buttonText: `Reply to ${displayName}`,
      href: `mailto:${classified.address}?subject=${subject}`,
      note: 'Hitting reply in your mail app also goes straight to them.',
    };
  }
  if (classified?.kind === 'whatsapp') {
    return {
      label: 'WhatsApp',
      shown: `+${classified.digits}`,
      buttonText: `Open WhatsApp chat`,
      href: `https://wa.me/${classified.digits}`,
      note: 'They asked for a reply on WhatsApp, so replying to this email will not reach them.',
    };
  }
  return { label: 'Contact', shown: contact, buttonText: '', href: '', note: '' };
}

/** @param {string} label @param {string} valueHtml */
function fieldRow(label, valueHtml) {
  return `<tr><td style="padding:0 0 18px">
<div style="font:600 11px/1.4 ${FONT_STACK};letter-spacing:.12em;text-transform:uppercase;color:${COLOR.muted};padding-bottom:4px">${label}</div>
<div dir="auto" style="font:400 16px/1.5 ${FONT_STACK};color:${COLOR.ink}">${valueHtml}</div>
</td></tr>`;
}

/**
 * @param {{ name: string, contact: string, message: string }} input
 * @returns {{ subject: string, fromName: string, text: string, html: string }}
 */
export function buildContactEmail({ name, contact, message }) {
  const displayName = toDisplayName(name);
  const reply = describeReply(contact, displayName);
  const preview = toPreview(message);
  const subject = `New message from ${displayName}`;
  const fromName = `${displayName} (via your website)`;

  const text = [
    `New message from ${name} on ${SITE_HOST}`,
    '',
    `Name: ${name}`,
    `${reply.label}: ${reply.shown}`,
    '',
    message,
    '',
    reply.href ? `Reply: ${reply.href}` : '',
  ].join('\n').trim();

  const messageHtml = escapeHtml(message).replace(/\r?\n/g, '<br>');
  const button = reply.href
    ? `<tr><td style="padding:6px 0 10px">
<a href="${escapeHtml(reply.href)}" style="display:inline-block;background:${COLOR.rustInk};color:#ffffff;font:600 15px/1 ${FONT_STACK};text-decoration:none;padding:14px 22px;border-radius:999px">${escapeHtml(reply.buttonText)} &rarr;</a>
</td></tr>
<tr><td style="font:400 13px/1.5 ${FONT_STACK};color:${COLOR.muted}">${reply.note}</td></tr>`
    : '';

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${COLOR.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.cream}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:${COLOR.ground};border-radius:18px 18px 0 0;padding:22px 28px">
<div style="font:600 12px/1.4 ${FONT_STACK};letter-spacing:.14em;text-transform:uppercase;color:${COLOR.gold}">Contact form</div>
<div style="font:600 22px/1.3 ${FONT_STACK};color:${COLOR.cream};padding-top:6px">New message from <span dir="auto">${escapeHtml(displayName)}</span></div>
</td></tr>
<tr><td style="background:${COLOR.paper};border:1px solid ${COLOR.line};border-top:0;border-radius:0 0 18px 18px;padding:28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${fieldRow('Name', escapeHtml(name))}
${fieldRow(reply.label, `<span dir="ltr">${escapeHtml(reply.shown)}</span>`)}
<tr><td style="padding:0 0 22px">
<div style="font:600 11px/1.4 ${FONT_STACK};letter-spacing:.12em;text-transform:uppercase;color:${COLOR.muted};padding-bottom:8px">Message</div>
<div dir="auto" style="font:400 16px/1.65 ${FONT_STACK};color:${COLOR.ink};background:${COLOR.cream};border-left:3px solid ${COLOR.rustInk};border-radius:4px;padding:14px 16px">${messageHtml}</div>
</td></tr>
${button}
</table>
</td></tr>
<tr><td align="center" style="padding:18px 8px;font:400 12px/1.5 ${FONT_STACK};color:${COLOR.muted}">Sent from the contact form on <a href="https://${SITE_HOST}" style="color:${COLOR.rustInk}">${SITE_HOST}</a></td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, fromName, text, html };
}
