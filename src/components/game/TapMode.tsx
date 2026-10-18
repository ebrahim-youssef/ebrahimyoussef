import type { Figure } from '../../data/figures';
import type { Locale } from '../../data/locale';
import type { GameStrings } from './strings';

interface TapModeProps {
  target: Figure;
  options: Figure[];
  onAnswer: (correct: boolean) => void;
  strings: GameStrings;
  locale: Locale;
}

export default function TapMode({ target, options, onAnswer, strings, locale }: TapModeProps) {
  return (
    <div className="tap-mode">
      <p className="game-hint" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {locale === 'ar' ? target.hintAr : target.hintEn}
      </p>
      <div className="tap-options" role="group" aria-label={strings.chooseFigure}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="tap-option"
            onClick={() => onAnswer(option.id === target.id)}
          >
            <span className="tap-option-ar" dir="rtl" lang="ar">
              {option.nameAr}
            </span>
            <span className="tap-option-en">{option.nameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
