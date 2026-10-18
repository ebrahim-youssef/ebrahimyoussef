const shareLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-share-link]')];

for (const link of shareLinks) {
  link.addEventListener('click', async (event) => {
    const url = link.href;
    const title = document.title;
    const copied = link.dataset.copied ?? link.textContent ?? '';
    const copyFallback = link.dataset.copyFallback ?? copied;

    if (typeof navigator.share === 'function') {
      event.preventDefault();
      try {
        await navigator.share({ title, url });
      } catch {
        // A cancelled native share is already an intentional end state.
      }
      return;
    }

    event.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      link.textContent = copied;
    } catch {
      getSelection()?.selectAllChildren(link);
      link.textContent = copyFallback;
    }
  });
}
