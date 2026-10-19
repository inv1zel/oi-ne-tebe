import { Star } from '../decor/Shapes.jsx';

// Стикеры по бокам карточки на широких экранах. Чем дальше тест, тем их больше.
const STICKERS = [
  { text: 'всё нормально', min: 0, cls: 'l1' },
  { text: 'честно-честно', min: 1, cls: 'r1', star: true },
  { text: 'не баг', min: 2, cls: 'l2' },
  { text: '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', min: 3, cls: 'r2' },
  { text: 'помогите', min: 4, cls: 'l3' },
  { text: 'ой', min: 4, cls: 'r3' },
];

export default function QuizStickers({ chaos }) {
  return (
    <div className="quiz-stickers decor" aria-hidden="true">
      {STICKERS.filter((s) => chaos >= s.min).map((s) => (
        <span key={s.cls} className={`sticker quiz-sticker quiz-sticker--${s.cls}`}>
          {s.star && <Star className="sticker__star" />}
          {s.text}
        </span>
      ))}
    </div>
  );
}
