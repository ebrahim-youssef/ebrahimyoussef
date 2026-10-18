import type { Figure } from '../../data/figures';
import type { GameStrings } from './strings';

interface FigureCardProps {
  figure: Figure;
  correct: boolean;
  onNext: () => void;
  strings: GameStrings;
}

export default function FigureCard({ figure, correct, onNext, strings }: FigureCardProps) {
  return (
    <div className={`figure-card ${correct ? 'is-correct' : 'is-incorrect'}`}>
      <p className="figure-card-status">{correct ? strings.correct : strings.incorrect}</p>
      <p className="figure-card-name" dir="rtl" lang="ar">
        {figure.nameAr} <span className="figure-card-honorific">{figure.honorific}</span>
      </p>
      <p className="figure-card-name-en">{figure.nameEn}</p>
      <p className="figure-card-fact">{figure.factEn}</p>
      <p className="figure-card-fact-ar" dir="rtl" lang="ar">
        {figure.factAr}
      </p>
      <button type="button" className="game-button game-button-primary figure-card-next" onClick={onNext} autoFocus>
        {strings.next}
      </button>
    </div>
  );
}
