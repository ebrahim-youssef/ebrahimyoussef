function revealOnView(selector: string): void {
  let pending = [...document.querySelectorAll(selector)];
  function check(): void {
    pending = pending.filter((item) => {
      const isVisible = item.getBoundingClientRect().top < innerHeight * 0.88;
      if (isVisible) item.classList.add('in');
      return !isVisible;
    });
    if (!pending.length) {
      removeEventListener('scroll', check);
      removeEventListener('resize', check);
    }
  }
  addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check);
  check();
}

revealOnView('.stats li, .clips .clip');

const chapters = [...document.querySelectorAll<HTMLElement>('.chapter')];
const pinChapters = (): void =>
  chapters.forEach((chapter, index) => {
    chapter.style.top = `${Math.min(index * 14, innerHeight - chapter.offsetHeight)}px`;
  });
addEventListener('resize', pinChapters);
addEventListener('load', pinChapters);
pinChapters();

const copyButton = document.getElementById('copy');
const mail = document.getElementById('mail');
if (copyButton instanceof HTMLButtonElement && mail instanceof HTMLAnchorElement) {
  copyButton.addEventListener('click', async () => {
    const email = mail.getAttribute('href')?.replace(/^mailto:/, '') ?? '';
    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = copyButton.dataset.copied ?? '';
    } catch {
      getSelection()?.selectAllChildren(mail);
      copyButton.textContent = copyButton.dataset.copyFallback ?? '';
    }
  });
}
