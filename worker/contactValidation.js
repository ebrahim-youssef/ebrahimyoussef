// @ts-check

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
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);

  if (!/^\d{8,15}$/.test(digits) || digits.startsWith('0')) return null;
  return { kind: 'whatsapp', digits };
}
