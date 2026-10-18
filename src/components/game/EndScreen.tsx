import { useState } from 'react';
import { copyShareText, drawShareCard, headlineText, shareMessage } from './shareCard';
import type { Locale } from '../../data/locale';
import { formatGameString, type GameStrings } from './strings';

interface EndScreenProps {
  score: number;
  total: number;
  seconds: number;
  streak: number;
  best: number;
  onPlayAgain: () => void;
  onSwitchMode: () => void;
  locale: Locale;
  strings: GameStrings;
}

export default function EndScreen({
  score,
  total,
  seconds,
  streak,
  best,
  onPlayAgain,
  onSwitchMode,
  locale,
  strings,
}: EndScreenProps) {
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  async function handleShare() {
    setSharing(true);
    setShareError(null);
    const data = { score, total, seconds };
    try {
      const blob = await drawShareCard(data, locale);
      const text = shareMessage(data, locale);
      const file = blob ? new File([blob], 'ey-figures-game.png', { type: 'image/png' }) : null;
      const canShareFiles =
        !!file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

      if (canShareFiles && file && navigator.share) {
        try {
          await navigator.share({ files: [file], text });
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            setShareError(strings.shareRejected);
          }
        }
        return;
      }

      const copyResult = await copyShareText(navigator.clipboard, text);
      if (copyResult === 'copied') {
        setToast(strings.copied);
        window.setTimeout(() => setToast(null), 2200);
      } else {
        setShareError(strings.shareUnavailable);
      }
    } catch {
      setShareError(strings.copyBlocked);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="end-screen">
      <h2 className="end-headline">{headlineText({ score, total, seconds }, locale)}</h2>
      {streak >= 2 && <p className="streak-badge">{formatGameString(strings.streak, { streak })}</p>}
      <p className="end-best">{formatGameString(strings.best, { best, total })}</p>
      <div className="end-actions">
        <button type="button" className="game-button game-button-primary" onClick={handleShare} disabled={sharing}>
          {sharing ? strings.preparing : strings.share}
        </button>
        <button type="button" className="game-button game-button-secondary" onClick={onPlayAgain}>
          {strings.playAgain}
        </button>
        <button type="button" className="game-button game-button-ghost" onClick={onSwitchMode}>
          {strings.switchMode}
        </button>
      </div>
      {toast && (
        <p className="toast" role="status">
          {toast}
        </p>
      )}
      {shareError && (
        <p className="share-error" role="status">
          {shareError}
        </p>
      )}
    </div>
  );
}
