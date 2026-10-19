import { Sparkle } from './Shapes.jsx';

// Звёздочки вокруг карточки вопроса (появляются после третьего вопроса).
const SPOTS = [
  { top: '-14px', left: '8%', size: 18, color: 'var(--pink)', d: 0 },
  { top: '-20px', right: '22%', size: 13, color: 'var(--lav)', d: 0.4 },
  { top: '18%', right: '-9px', size: 16, color: 'var(--butter)', d: 0.9 },
  { bottom: '30%', right: '-11px', size: 12, color: 'var(--pink)', d: 1.3 },
  { bottom: '-16px', right: '12%', size: 19, color: 'var(--lav)', d: 0.2 },
  { bottom: '-12px', left: '30%', size: 12, color: 'var(--red)', d: 1.1 },
  { bottom: '22%', left: '-10px', size: 15, color: 'var(--butter)', d: 0.6 },
  { top: '30%', left: '-8px', size: 11, color: 'var(--pink)', d: 1.6 },
];

export default function SparkleRing() {
  return (
    <div className="sparkle-ring decor" aria-hidden="true">
      {SPOTS.map(({ size, color, d, ...pos }, i) => (
        <Sparkle
          key={i}
          className="sparkle-ring__item"
          style={{ ...pos, width: size, height: size, color, '--d': `${d}s`, '--i': i }}
        />
      ))}
    </div>
  );
}
