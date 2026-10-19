import { useRef, useState } from 'react';
import Whisper from './Whisper.jsx';
import { Heart } from './decor/Shapes.jsx';
import { useFx } from '../fx/context.js';
import { SECRET_TITLE_MESSAGE } from '../data/content.js';
import './header.css';

const TAP_WINDOW = 1200;

/** Шапка: название сайта (секрет — три быстрых нажатия) и шепотки в углу. */
export default function Header({ whispersOn }) {
  const { notify, burstAt } = useFx();
  const taps = useRef([]);
  const [wiggle, setWiggle] = useState(0);

  const handleTap = (e) => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < TAP_WINDOW), now];
    setWiggle((w) => w + 1);
    if (taps.current.length >= 3) {
      taps.current = [];
      notify(SECRET_TITLE_MESSAGE, { variant: 'secret', icon: '🤫', duration: 5400 });
      burstAt(e, { count: 14, spread: 90 });
    }
  };

  return (
    <header className="site-header">
      <button type="button" className="site-title" onClick={handleTap}>
        <span key={wiggle} className={wiggle ? 'site-title__inner is-wiggle' : 'site-title__inner'}>
          <Heart className="site-title__heart" />
          ой. это вообще не тебе.
        </span>
      </button>
      <Whisper active={whispersOn} />
    </header>
  );
}
