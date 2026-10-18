import { useState } from 'react';
import type { Figure } from '../../data/figures';
import { matchesAnswer } from './arabic';
import type { GameStrings } from './strings';

interface WriteModeProps {
  target: Figure;
  onAnswer: (correct: boolean) => void;
  strings: GameStrings;
}

export default function WriteMode({ target, onAnswer, strings }: WriteModeProps) {
  const [value, setValue] = useState('');

  function giveUp() {
    onAnswer(false);
  }

  return (
    <div className="write-mode">
      <p className="game-hint">{target.hintEn}</p>
      <form
        className="write-form"
        onSubmit={(e) => {
          e.preventDefault();
          onAnswer(matchesAnswer(value, target));
        }}
      >
        <label htmlFor="ar-answer" dir="rtl" lang="ar">
          {strings.writeLabel}
        </label>
        <input
          id="ar-answer"
          className="write-input"
          dir="rtl"
          lang="ar"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={strings.writePlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="write-actions">
          <button className="game-button game-button-primary" type="submit">
            {strings.check}
          </button>
          <button type="button" className="game-button game-button-ghost" onClick={giveUp}>
            {strings.showMe}
          </button>
        </div>
      </form>
    </div>
  );
}
