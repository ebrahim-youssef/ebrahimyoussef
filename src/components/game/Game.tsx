import { useMemo, useRef, useState } from 'react';
import { figures } from '../../data/figures';
import type { Figure } from '../../data/figures';
import { gameReducer, initGame, pickOptions, pickSession } from './reducer';
import type { GameAction, GameState, Mode } from './reducer';
import { loadStreak, recordSession } from './streak';
import TapMode from './TapMode';
import WriteMode from './WriteMode';
import FigureCard from './FigureCard';
import EndScreen from './EndScreen';
import type { Locale } from '../../data/locale';
import { formatGameString, gameStrings } from './strings';

function ModeSelectScreen({ onSelect, strings }: { onSelect: (mode: Mode) => void; strings: (typeof gameStrings)[Locale] }) {
  const { streak } = loadStreak();
  return (
    <div className="mode-select">
      <h2 className="game-title">{strings.title}</h2>
      <p className="game-intro">{strings.intro}</p>
      {streak >= 1 && <p className="streak-badge">{formatGameString(strings.streak, { streak })}</p>}
      <div className="mode-buttons">
        <button type="button" className="game-button game-button-primary mode-btn" onClick={() => onSelect('tap')}>
          {strings.tapAnswer}
        </button>
        <button type="button" className="game-button game-button-secondary mode-btn" onClick={() => onSelect('write')}>
          {strings.writeAnswer}
        </button>
      </div>
    </div>
  );
}

interface GameProps {
  locale: Locale;
}

export default function Game({ locale }: GameProps) {
  const strings = gameStrings[locale];
  const [state, setState] = useState<GameState | null>(null);
  const [result, setResult] = useState<{ streak: number; best: number } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(0);
  const finishedRef = useRef(false);

  const current: Figure | null = state
    ? (figures.find((f) => f.id === state.ids[state.roundIx]) ?? null)
    : null;

  const options = useMemo(() => {
    if (!state || !current || state.mode !== 'tap' || state.phase !== 'question') return [];
    return pickOptions(current, figures);
  }, [state?.roundIx, state?.mode, state?.phase, current]);

  function dispatch(action: GameAction) {
    setState((s) => (s ? gameReducer(s, action) : s));
  }

  function startSession(mode: Mode) {
    const picked = pickSession(figures);
    finishedRef.current = false;
    startTimeRef.current = Date.now();
    setResult(null);
    setState(initGame(mode, picked.map((f) => f.id)));
  }

  function handleAnswer(correct: boolean) {
    dispatch({ type: 'answer', correct });
  }

  function handleNext() {
    if (!state || state.phase !== 'reveal') return;
    const isLastRound = state.roundIx + 1 >= state.ids.length;
    const next = gameReducer(state, { type: 'next' });
    setState(next);
    if (isLastRound && !finishedRef.current) {
      finishedRef.current = true;
      const seconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      setElapsedSeconds(seconds);
      setResult(recordSession(next.score));
    }
  }

  function handleSwitchMode() {
    setState(null);
    setResult(null);
  }

  return (
    <div className="game" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <div className="game-body">
        {!state && <ModeSelectScreen onSelect={startSession} strings={strings} />}

        {state && state.phase !== 'done' && current && (
          <div className="game-round">
            <p className="game-progress">{formatGameString(strings.progress, { round: state.roundIx + 1, total: state.ids.length, score: state.score })}</p>
            {state.phase === 'question' && state.mode === 'tap' && (
              <TapMode key={current.id} target={current} options={options} onAnswer={handleAnswer} strings={strings} />
            )}
            {state.phase === 'question' && state.mode === 'write' && (
              <WriteMode key={current.id} target={current} onAnswer={handleAnswer} strings={strings} />
            )}
            {state.phase === 'reveal' && (
              <FigureCard
                key={`${current.id}-reveal`}
                figure={current}
                correct={state.lastCorrect}
                onNext={handleNext}
                strings={strings}
              />
            )}
          </div>
        )}

        {state && state.phase === 'done' && result && (
          <EndScreen
            score={state.score}
            total={state.ids.length}
            seconds={elapsedSeconds}
            streak={result.streak}
            best={result.best}
            onPlayAgain={() => startSession(state.mode)}
            onSwitchMode={handleSwitchMode}
            locale={locale}
            strings={strings}
          />
        )}
      </div>
      <footer className="game-footer">
        <p className="proof-caption">{strings.footer}</p>
      </footer>
    </div>
  );
}
