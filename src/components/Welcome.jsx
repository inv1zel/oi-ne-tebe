import { useState } from 'react';
import CuteCluster from './decor/CuteCluster.jsx';
import HeartButton from './ui/HeartButton.jsx';
import { useFx } from '../fx/context.js';
import './welcome.css';

/** Главный экран. */
export default function Welcome({ onStart }) {
  const { burstAt } = useFx();
  const [starting, setStarting] = useState(false);

  const handleStart = (e) => {
    if (starting) return;
    setStarting(true);
    burstAt(e, { count: 14, spread: 130 });
    onStart();
  };

  return (
    <section className="welcome">
      <div className="welcome__text">
        <p className="welcome__label">официально неодобренный тест № 001</p>
        <h1 className="welcome__title">
          привет, <span className="welcome__accent">подозрительный</span> человек <span className="welcome__heart">♡</span>
        </h1>
        <p className="welcome__sub">
          мы тут проверяем людей на милоту. это займёт 30 секунд. <span className="hand welcome__maybe">наверное.</span>
        </p>
      </div>

      <div className="welcome__art">
        <CuteCluster />
      </div>

      <div className="welcome__cta">
        <HeartButton onClick={handleStart} disabled={starting}>
          начать тест <span className="welcome__arrow">→</span>
        </HeartButton>
        <p className="welcome__fine">без регистрации, смс и строгих оценок</p>
      </div>
    </section>
  );
}
