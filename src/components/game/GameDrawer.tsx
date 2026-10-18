import { lazy, Suspense, useRef, useState } from 'react';
import { daftar } from '../../data/daftar';
import type { Locale } from '../../data/locale';
import { gameStrings } from './strings';
import './game.css';

const Game = lazy(() => import('./Game'));

interface GameDrawerProps {
  locale: Locale;
}

export default function GameDrawer({ locale }: GameDrawerProps) {
  const strings = gameStrings[locale];
  const ref = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  function open() {
    setOpened(true);
    ref.current?.showModal();
  }

  return (
    <>
      <button type="button" className="button game-launch" onClick={open}>
        {daftar[locale].walls.play.start}
      </button>
      <dialog
        ref={ref}
        className="game-drawer"
        aria-label={strings.dialogLabel}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        lang={locale}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <button
          type="button"
          className="game-button game-button-ghost drawer-close"
          onClick={() => ref.current?.close()}
          aria-label={strings.closeLabel}
        >
          ×
        </button>
        {opened && (
          <Suspense fallback={<p className="drawer-loading">{strings.loading}</p>}>
            <Game locale={locale} />
          </Suspense>
        )}
      </dialog>
    </>
  );
}
