import { useState } from 'react';
import { copyShareText, drawShareCard, headlineText, shareMessage } from './shareCard';

interface EndScreenProps {
  score: number;
  total: number;
  seconds: number;
  streak: number;
  best: number;
  onPlayAgain: () => void;
  onSwitchMode: () => void;
}

export default function EndScreen({
  score,
  total,
  seconds,
  streak,
  best,
  onPlayAgain,
  onSwitchMode,
}: EndScreenProps) {
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  async function handleShare() {
    setSharing(true);
    setShareError(null);
    const data = { score, total, seconds };
    try {
      const blob = await drawShareCard(data);
      const text = shareMessage(data);
      const file = blob ? new File([blob], 'ey-figures-game.png', { type: 'image/png' }) : null;
      const canShareFiles =
        !!file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

      if (canShareFiles && file && navigator.share) {
        try {
          await navigator.share({ files: [file], text });
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            setShareError("Couldn't share — the browser rejected the request.");
          }
        }
        return;
      }

      const copyResult = await copyShareText(navigator.clipboard, text);
      if (copyResult === 'copied') {
        setToast('Copied!');
        window.setTimeout(() => setToast(null), 2200);
      } else {
        setShareError("Couldn't share — clipboard access is unavailable in this browser.");
      }
    } catch {
      setShareError("Couldn't share — copy blocked by the browser.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="end-screen">
      <h2 className="end-headline">{headlineText({ score, total, seconds })}</h2>
      {streak >= 2 && <p className="streak-badge">🔥 {streak}-day streak</p>}
      <p className="end-best">
        Best: {best} of {total}
      </p>
      <div className="end-actions">
        <button type="button" className="btn btn-primary" onClick={handleShare} disabled={sharing}>
          {sharing ? 'Preparing…' : 'Share'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSwitchMode}>
          Switch mode
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
