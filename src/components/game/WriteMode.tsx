import { useState } from 'react';
import type { Figure } from '../../data/figures';
import { matchesAnswer } from './arabic';

interface WriteModeProps {
  target: Figure;
  onAnswer: (correct: boolean) => void;
}

export default function WriteMode({ target, onAnswer }: WriteModeProps) {
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
          اكتب الاسم بالعربية
        </label>
        <input
          id="ar-answer"
          className="write-input"
          dir="rtl"
          lang="ar"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="…اكتب هنا"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="write-actions">
          <button className="btn btn-primary" type="submit">
            Check
          </button>
          <button type="button" className="btn btn-ghost" onClick={giveUp}>
            Show me
          </button>
        </div>
      </form>
    </div>
  );
}
