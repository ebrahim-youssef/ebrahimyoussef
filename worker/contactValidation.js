// @ts-check

const EGYPT_COUNTRY_CODE = '20';
const EGYPT_LOCAL_MOBILE = /^01[0125]\d{8}$/;

/**
 * @typedef {{ kind: 'email', address: string } | { kind: 'whatsapp', digits: string }} ContactClassification
 */

/** @param {string} value @returns {ContactClassification | null} */
export function classifyContact(value) {
  const trimmed = value.trim();
  if (/^[^\s,<>@]+@[^\s,<>@]+\.[^\s,<>@]{2,}$/.test(trimmed)) {
    return { kind: 'email', address: trimmed };
  }

  let digits = trimmed.replace(/[\s.()-]/g, '');
  // Most visitors are in Egypt and write mobiles locally (010…), so add the +20 for them.
  if (EGYPT_LOCAL_MOBILE.test(digits)) return { kind: 'whatsapp', digits: `${EGYPT_COUNTRY_CODE}${digits.slice(1)}` };
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);

  if (!/^\d{8,15}$/.test(digits) || digits.startsWith('0')) return null;
  return { kind: 'whatsapp', digits };
}
