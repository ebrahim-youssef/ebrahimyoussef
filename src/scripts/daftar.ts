export {};

function revealOnView(selector: string): void {
  let pending = [...document.querySelectorAll(selector)];
  function check(): void {
    pending = pending.filter((item) => {
      if (item.getBoundingClientRect().top < innerHeight * 0.88) item.classList.add('in');
      return !item.classList.contains('in');
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

function sidewaysFilm(film: HTMLElement, track: HTMLElement, onProgress: (progress: number) => void): { jumpTo: (index: number, behavior?: ScrollBehavior) => void } {
  const isWide = matchMedia('(min-width: 761px) and (min-height: 701px) and (prefers-reduced-motion: no-preference)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const direction = document.dir === 'rtl' ? 1 : -1;
  const count = track.children.length;
  const progressForScroll = (): number => {
    const scrollable = film.offsetHeight - innerHeight;
    return scrollable > 0 ? Math.min(Math.max((scrollY - film.offsetTop) / scrollable, 0), 1) : 0;
  };
  function update(): void {
    if (!isWide.matches) {
      track.style.transform = '';
      return;
    }
    const progress = progressForScroll();
    track.style.transform = `translateX(${direction * progress * (count - 1) * 100}vw)`;
    onProgress(progress);
  }
  function layout(): void {
    film.style.height = isWide.matches ? `${count * 100}vh` : '';
    update();
  }
  track.addEventListener('scroll', () => {
    if (isWide.matches) return;
    const max = track.scrollWidth - track.clientWidth;
    onProgress(max ? Math.min(Math.abs(track.scrollLeft) / max, 1) : 0);
  }, { passive: true });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', layout);
  layout();
  return {
    jumpTo(index: number, requestedBehavior?: ScrollBehavior): void {
      const behavior: ScrollBehavior = requestedBehavior ?? (reduceMotion.matches ? 'auto' : 'smooth');
      if (isWide.matches) {
        scrollTo({ top: film.offsetTop + (film.offsetHeight - innerHeight) * (index / (count - 1)), behavior });
      } else {
        track.children[index]?.scrollIntoView({ behavior, inline: 'start', block: 'nearest' });
      }
    },
  };
}

revealOnView('.reveal');

const filmElement = document.getElementById('film');
const trackElement = document.getElementById('track');
const rail = document.getElementById('rail');
const dot = document.getElementById('dot');
const swipeBar = document.getElementById('swipe-bar');
if (filmElement instanceof HTMLElement && trackElement instanceof HTMLElement && rail && dot && swipeBar) {
  const wallCount = trackElement.children.length;
  const film = sidewaysFilm(filmElement, trackElement, (progress) => {
    dot.style.insetInlineStart = `${progress * 100}%`;
    swipeBar.style.width = `${((1 + progress * (wallCount - 1)) / wallCount) * 100}%`;
  });
  rail.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('[data-wall]');
    if (button) film.jumpTo(Number(button.dataset.wall));
  });
  const initialWallIndex = [...trackElement.children].findIndex((wall) => wall.id === window.location.hash.slice(1));
  if (initialWallIndex >= 0) {
    setTimeout(() => {
      film.jumpTo(initialWallIndex, 'auto');
      if (matchMedia('(min-width: 761px) and (min-height: 701px) and (prefers-reduced-motion: no-preference)').matches) {
        const progress = initialWallIndex / (wallCount - 1);
        const direction = document.dir === 'rtl' ? 1 : -1;
        trackElement.style.transform = `translateX(${direction * progress * (wallCount - 1) * 100}vw)`;
      } else {
        window.scrollTo({ top: filmElement.offsetTop, behavior: 'auto' });
        trackElement.children[initialWallIndex]?.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'nearest' });
      }
    }, 600);
  }
}
