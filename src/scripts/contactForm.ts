type ContactField = 'name' | 'contact' | 'message';
type ContactOutcome = 'sent' | 'field' | 'failed';
type ContactResponse = { ok?: boolean; field?: ContactField };

const CONTACT_FIELDS: ContactField[] = ['name', 'contact', 'message'];
const CONTACT_TIMEOUT_MS = 15000;

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

export function validateContactForm(form: HTMLFormElement): boolean {
  let isValid = true;

  for (const name of CONTACT_FIELDS) {
    const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
    const isEmpty = !input.value.trim();
    input.setAttribute('aria-invalid', String(isEmpty));
    const error = form.querySelector(`#e-${name}`);
    if (error) error.textContent = isEmpty ? fieldError(form, name) : '';
    if (isEmpty && isValid) {
      input.focus();
      isValid = false;
    }
  }

  return isValid;
}

function hasContactField(body: unknown): body is { field: ContactField } {
  if (typeof body !== 'object' || body === null || !('field' in body)) return false;
  const field = body.field;
  return typeof field === 'string' && CONTACT_FIELDS.includes(field as ContactField);
}

export function outcomeFor(status: number, body: unknown): ContactOutcome {
  if (status >= 200 && status < 300 && typeof body === 'object' && body !== null && 'ok' in body && body.ok === true) {
    return 'sent';
  }
  if (status === 400 && hasContactField(body)) return 'field';
  return 'failed';
}

function fieldError(form: HTMLFormElement, field: ContactField): string {
  return form.dataset[`error${field[0].toUpperCase()}${field.slice(1)}`] ?? '';
}

function markFieldInvalid(form: HTMLFormElement, field: ContactField): void {
  const input = form.elements.namedItem(field);
  if (!(input instanceof HTMLInputElement) && !(input instanceof HTMLTextAreaElement)) return;
  input.setAttribute('aria-invalid', 'true');
  const error = form.querySelector(`#e-${field}`);
  if (error) error.textContent = fieldError(form, field);
  input.focus();
}

async function submitContactForm(form: HTMLFormElement): Promise<void> {
  if (!validateContactForm(form)) return;

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('#status');
  if (!button || !status) return;

  const originalLabel = form.dataset.send ?? button.textContent ?? '';
  const formData = new FormData(form);
  const requestBody = {
    name: String(formData.get('name') ?? ''),
    contact: String(formData.get('contact') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? ''),
    token: String(formData.get('cf-turnstile-response') ?? ''),
  };

  button.disabled = true;
  button.textContent = form.dataset.sending ?? '';
  status.classList.remove('ok', 'fail');
  status.textContent = form.dataset.sending ?? '';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(CONTACT_TIMEOUT_MS),
    });
    let body: ContactResponse | null = null;
    try {
      body = (await response.json()) as ContactResponse;
    } catch {
      body = null;
    }

    const outcome = outcomeFor(response.status, body);
    if (outcome === 'sent') {
      status.classList.add('ok');
      status.textContent = form.dataset.sent ?? '';
      form.reset();
    } else if (outcome === 'field' && body && hasContactField(body)) {
      status.textContent = '';
      markFieldInvalid(form, body.field);
    } else {
      status.classList.add('fail');
      status.textContent = form.dataset.failed ?? '';
    }
  } catch {
    status.classList.add('fail');
    status.textContent = form.dataset.failed ?? '';
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
    if (window.turnstile) window.turnstile.reset();
  }
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('form');
  if (form instanceof HTMLFormElement) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void submitContactForm(form);
    });
  }
}
