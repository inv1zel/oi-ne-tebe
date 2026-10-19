import { useRef, useState } from 'react';
import { Sparkle, Star } from './Shapes.jsx';
import PopHeart from './PopHeart.jsx';
import { useFx } from '../../fx/context.js';
import { useTimers } from '../../hooks/useTimers.js';

const RING = [
  { a: 0, size: 18, color: 'var(--pink)' },
  { a: 52, size: 12, color: 'var(--lav)' },
  { a: 110, size: 20, color: 'var(--butter)' },
  { a: 170, size: 13, color: 'var(--pink)' },
  { a: 230, size: 17, color: 'var(--lav)' },
  { a: 290, size: 11, color: 'var(--red)' },
];

/** Центральная композиция главного экрана: сердечко с лицом, орбита звёздочек, стикеры. */
export default function CuteCluster() {
  const { burstAt, notify } = useFx();
  const timers = useTimers();
  const [shy, setShy] = useState(false);
  const [bounce, setBounce] = useState(0);
  const taps = useRef(0);

  const pokeHeart = (e) => {
    taps.current += 1;
    setBounce((b) => b + 1);
    setShy(true);
    burstAt(e, { count: 12, spread: 120 });
    timers.clearAll();
    timers.set(() => setShy(false), 1300);
    if (taps.current === 5) {
      notify('ладно-ладно. сердечко смущено, можно больше не тыкать ♡', { icon: '😳' });
    }
  };

  return (
    <div className="cluster decor">
      <span className="cluster__glow" aria-hidden="true" />
      <span className="cluster__disc" aria-hidden="true" />

      <div className="cluster__ring" aria-hidden="true">
        {RING.map((s, i) => (
          <span key={i} className="cluster__orbit" style={{ '--a': `${s.a}deg` }}>
            <Sparkle className="cluster__spark" style={{ width: s.size, height: s.size, color: s.color, '--i': i }} />
          </span>
        ))}
      </div>

      <button
        type="button"
        className={`big-heart ${shy ? 'is-shy' : ''}`}
        data-bounce={bounce ? bounce % 2 : undefined}
        onClick={pokeHeart}
        aria-label="большое сердечко. можно нажать"
      >
        <svg viewBox="0 0 200 182" aria-hidden="true">
          <defs>
            <linearGradient id="bh-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff9cc2" />
              <stop offset="0.5" stopColor="#ff3d8b" />
              <stop offset="1" stopColor="#ff6b6b" />
            </linearGradient>
          </defs>
          <path
            className="big-heart__body"
            d="M100 172C62 146 8 112 8 60 8 28 32 8 60 8c18 0 32 10 40 24 8-14 22-24 40-24 28 0 52 20 52 52 0 52-54 86-92 112z"
            fill="url(#bh-fill)"
            stroke="#2a2530"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <ellipse cx="54" cy="44" rx="20" ry="11" fill="#fff" opacity="0.55" transform="rotate(-28 54 44)" />
          <circle cx="40" cy="64" r="4" fill="#fff" opacity="0.7" />
          <g className="big-heart__blush">
            <ellipse cx="56" cy="104" rx="14" ry="8" fill="#ffd2e2" />
            <ellipse cx="144" cy="104" rx="14" ry="8" fill="#ffd2e2" />
          </g>
          <g className="big-heart__eyes big-heart__eyes--open">
            <ellipse cx="74" cy="84" rx="7" ry="9" fill="#2a2530" />
            <ellipse cx="126" cy="84" rx="7" ry="9" fill="#2a2530" />
            <circle cx="76.5" cy="80.5" r="2.4" fill="#fff" />
            <circle cx="128.5" cy="80.5" r="2.4" fill="#fff" />
          </g>
          <g className="big-heart__eyes big-heart__eyes--shy" fill="none" stroke="#2a2530" strokeWidth="5" strokeLinecap="round">
            <path d="M64 88q10-12 20 0" />
            <path d="M116 88q10-12 20 0" />
          </g>
          <path d="M88 104q6 7 12 0q6 7 12 0" fill="none" stroke="#2a2530" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <span className="sticker sticker--bubble" aria-hidden="true">тык?</span>
      <span className="sticker sticker--tag" aria-hidden="true">
        <Star className="sticker__star" /> 100% милота
      </span>
      <span className="sticker sticker--beta" aria-hidden="true">beta</span>

      <PopHeart className="cluster__pop cluster__pop--1" size={24} color="var(--lav)" />
      <PopHeart className="cluster__pop cluster__pop--2" size={30} color="var(--red)" />
      <PopHeart className="cluster__pop cluster__pop--3" size={20} color="var(--pink)" />
    </div>
  );
}
