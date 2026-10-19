import { useCallback, useMemo, useRef, useState } from 'react';
import { FxContext } from './context.js';
import { useTimers } from '../hooks/useTimers.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { Heart, Sparkle } from '../components/decor/Shapes.jsx';
import { PALETTE, pick, rand } from '../utils/random.js';
import './fx.css';

const MAX_PARTICLES = 160;
const MAX_TOASTS = 3;
let uid = 0;

/** Точка, откуда вылетают частицы: координаты клика или центр элемента (для клавиатуры). */
function pointFrom(source) {
  if (!source) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  if (typeof source.clientX === 'number' && (source.clientX || source.clientY)) {
    return { x: source.clientX, y: source.clientY };
  }
  const el = source.currentTarget ?? source;
  if (el?.getBoundingClientRect) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export default function FxProvider({ children }) {
  const [particles, setParticles] = useState([]);
  const [toasts, setToasts] = useState([]);
  const timers = useTimers();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const spawn = useCallback(
    (list, life) => {
      const ids = new Set(list.map((p) => p.id));
      setParticles((prev) => [...prev, ...list].slice(-MAX_PARTICLES));
      timers.set(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), life);
    },
    [timers],
  );

  const burst = useCallback(
    (x, y, { count = 10, spread = 110, kinds = ['heart', 'heart', 'sparkle'], size = [12, 24] } = {}) => {
      const isReduced = reducedRef.current;
      const n = isReduced ? Math.min(4, count) : count;
      const list = Array.from({ length: n }, (_, i) => {
        const angle = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
        const dist = spread * rand(0.45, 1.1) * (isReduced ? 0.25 : 1);
        return {
          id: ++uid,
          type: pick(kinds),
          x,
          y,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 18,
          rot: rand(-110, 110),
          size: rand(size[0], size[1]),
          color: pick(PALETTE),
          dur: rand(750, 1150),
          delay: rand(0, 90),
        };
      });
      spawn(list, 1400);
    },
    [spawn],
  );

  const burstAt = useCallback((source, opts) => {
    const { x, y } = pointFrom(source);
    burst(x, y, opts);
  }, [burst]);

  const confetti = useCallback(() => {
    if (reducedRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const n = w < 520 ? 44 : 76;
    const list = Array.from({ length: n }, () => {
      const type = Math.random() < 0.25 ? 'heart' : 'confetti';
      return {
        id: ++uid,
        type,
        fall: true,
        x: rand(0, w),
        y: -24,
        dx: rand(-70, 70),
        dy: h + 60,
        rot: rand(-600, 600),
        size: type === 'heart' ? rand(12, 20) : rand(8, 13),
        color: pick(PALETTE),
        dur: rand(1900, 3100),
        delay: rand(0, 550),
      };
    });
    spawn(list, 3900);
  }, [spawn]);

  const notify = useCallback(
    (text, { icon = '✦', variant = 'default', duration = 3600 } = {}) => {
      const id = ++uid;
      setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), { id, text, icon, variant, leaving: false }]);
      timers.set(() => setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))), duration - 380);
      timers.set(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    },
    [timers],
  );

  const value = useMemo(() => ({ burst, burstAt, confetti, notify }), [burst, burstAt, confetti, notify]);

  return (
    <FxContext.Provider value={value}>
      {children}

      <div className="particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`particle particle--${p.type}${p.fall ? ' is-fall' : ''}`}
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.type === 'confetti' ? p.size * 0.5 : p.size,
              color: p.color,
              background: p.type === 'confetti' ? p.color : undefined,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
              animationDuration: `${p.dur}ms`,
              animationDelay: `${p.delay}ms`,
            }}
          >
            {p.type === 'heart' && <Heart />}
            {p.type === 'sparkle' && <Sparkle />}
          </span>
        ))}
      </div>

      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant} ${t.leaving ? 'is-leaving' : ''}`}>
            <span className="toast__icon" aria-hidden="true">{t.icon}</span>
            <span className="toast__text">{t.text}</span>
          </div>
        ))}
      </div>
    </FxContext.Provider>
  );
}
