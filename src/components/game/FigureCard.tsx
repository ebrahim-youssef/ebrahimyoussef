import type { Figure } from '../../data/figures';

interface FigureCardProps {
  figure: Figure;
  correct: boolean;
  onNext: () => void;
}

export default function FigureCard({ figure, correct, onNext }: FigureCardProps) {
  return (
    <div className={`figure-card ${correct ? 'is-correct' : 'is-incorrect'}`}>
      <p className="figure-card-status">{correct ? 'Correct' : "Not quite — here's the answer"}</p>
      <p className="figure-card-name" dir="rtl" lang="ar">
        {figure.nameAr} <span className="figure-card-honorific">{figure.honorific}</span>
      </p>
      <p className="figure-card-name-en">{figure.nameEn}</p>
      <p className="figure-card-fact">{figure.factEn}</p>
      <p className="figure-card-fact-ar" dir="rtl" lang="ar">
        {figure.factAr}
      </p>
      <button type="button" className="btn btn-primary figure-card-next" onClick={onNext} autoFocus>
        Next →
      </button>
    </div>
  );
}
