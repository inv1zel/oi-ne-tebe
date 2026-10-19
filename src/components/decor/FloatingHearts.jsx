import { useMemo } from 'react';
import { Heart, Sparkle } from './Shapes.jsx';
import { PALETTE, pick, rand } from '../../utils/random.js';

const COUNT = { none: 0, low: 7, high: 14 };
const POOL = 14;

/** Плавающие сердечки на заднем плане. level: none | low | high */
export default function FloatingHearts({ level = 'none' }) {
  const active = COUNT[level] ?? 0;

  const items = useMemo(
    () =>
      Array.from({ length: POOL }, (_, i) => ({
        left: (i / POOL) * 100 + rand(0, 100 / POOL),
        size: rand(14, 32),
        dur: rand(12, 20),
        delay: -rand(0, 20),
        sway: rand(10, 26),
        color: pick(PALETTE),
        opacity: rand(0.35, 0.75),
        sparkle: i % 5 === 3,
      })),
    [],
  );

  return (
    <div className={`floaters decor ${active ? 'is-on' : ''}`} aria-hidden="true">
      {items.map((h, i) => {
        // половина «тихого» режима берётся через одного, чтобы сердечки шли по всей ширине
        const on = level === 'high' ? true : level === 'low' ? i % 2 === 0 : false;
        const Shape = h.sparkle ? Sparkle : Heart;
        return (
          <span
            key={i}
            className={`floater ${on ? 'is-active' : ''}`}
            style={{
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              color: h.color,
              '--o': h.opacity,
              '--sway': `${h.sway}px`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
            }}
          >
            <Shape className="floater__shape" />
          </span>
        );
      })}
    </div>
  );
}
