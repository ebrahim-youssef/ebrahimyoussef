export type ShareFallbackAction = 'cancel' | 'copy';

export function chooseShareFallback(error: unknown): ShareFallbackAction {
  const errorName = error && typeof error === 'object' && 'name' in error && typeof error.name === 'string'
    ? error.name
    : undefined;
  return errorName === 'AbortError' ? 'cancel' : 'copy';
}

export type CopyFallbackAction = 'copied' | 'reveal-url';

export function chooseCopyFallback(result: 'copied' | 'unavailable'): CopyFallbackAction {
  return result === 'copied' ? 'copied' : 'reveal-url';
}

async function copyPostUrl(url: string): Promise<'copied' | 'unavailable'> {
  const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
  if (!clipboard || typeof clipboard.writeText !== 'function') return 'unavailable';

  try {
    await clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'unavailable';
  }
}

function revealUrlField(link: HTMLAnchorElement, url: string) {
  const fallback = link.parentElement?.querySelector<HTMLElement>('[data-share-fallback]');
  const input = fallback?.querySelector<HTMLInputElement>('input');
  if (!fallback || !input) return;

  input.value = url;
  fallback.hidden = false;
  input.focus();
  input.select();
}

function initializePostShare() {
  if (typeof document === 'undefined') return;

  const shareLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-share-link]')];
  for (const link of shareLinks) {
    link.addEventListener('click', async (event) => {
      const url = link.href;
      const title = document.title;
      const copied = link.dataset.copied ?? link.textContent ?? '';

      if (typeof navigator.share === 'function') {
        event.preventDefault();
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if (chooseShareFallback(error) === 'cancel') return;
        }
      } else {
        event.preventDefault();
      }

      const copyResult = await copyPostUrl(url);
      if (chooseCopyFallback(copyResult) === 'copied') {
        link.textContent = copied;
      } else {
        revealUrlField(link, url);
      }
    });
  }
}

initializePostShare();
