import { useState } from 'react';
import { Heart } from './Shapes.jsx';
import { useFx } from '../../fx/context.js';
import { useTimers } from '../../hooks/useTimers.js';

/** Маленькое декоративное сердечко: по нажатию лопается на частицы и потом вырастает обратно. */
export default function PopHeart({ className = '', size = 26, color = 'var(--pink)', style }) {
  const { burstAt } = useFx();
  const timers = useTimers();
  const [popped, setPopped] = useState(false);

  const handleClick = (e) => {
    if (popped) return;
    burstAt(e, { count: 9, spread: 70, size: [9, 17] });
    setPopped(true);
    timers.set(() => setPopped(false), 1500);
  };

  return (
    <button
      type="button"
      className={`pop-heart ${popped ? 'is-popped' : ''} ${className}`}
      style={{ '--size': `${size}px`, color, ...style }}
      onClick={handleClick}
      aria-label="декоративное сердечко"
    >
      <Heart className="pop-heart__shape" />
    </button>
  );
}
