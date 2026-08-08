import { lazy, Suspense, useRef, useState } from 'react';
import './game.css';

const Game = lazy(() => import('./Game'));

export default function GameDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  function open() {
    setOpened(true);
    ref.current?.showModal();
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={open}>
        Play the game ✦
      </button>
      <dialog
        ref={ref}
        className="game-drawer"
        aria-label="Islamic figures game"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <button
          type="button"
          className="btn btn-ghost btn-icon drawer-close"
          onClick={() => ref.current?.close()}
          aria-label="Close game"
        >
          ×
        </button>
        {opened && (
          <Suspense fallback={<p className="drawer-loading">Loading…</p>}>
            <Game />
          </Suspense>
        )}
      </dialog>
    </>
  );
}
