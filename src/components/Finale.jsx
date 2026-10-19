import { useEffect, useRef, useState } from 'react';
import HeartButton from './ui/HeartButton.jsx';
import PopHeart from './decor/PopHeart.jsx';
import { useFx } from '../fx/context.js';
import { useTimers } from '../hooks/useTimers.js';
import { FINALE_INTRO } from '../data/content.js';
import './finale.css';

const INTRO_OUT_AT = 6500;
const CARD_AT = 6900;
const PRESS_COOLDOWN = 450;

/** «Неожиданный» финал: сначала признание в ошибке, потом карточка. */
export default function Finale({ onRestart }) {
  const { burstAt, confetti } = useFx();
  const timers = useTimers();
  const [shown, setShown] = useState(1);
  const [phase, setPhase] = useState('intro'); // intro | intro-out | card
  const [presses, setPresses] = useState(0);
  const lastPress = useRef(0);

  useEffect(() => {
    FINALE_INTRO.forEach((line, i) => i && timers.set(() => setShown(i + 1), line.at));
    timers.set(() => setPhase('intro-out'), INTRO_OUT_AT);
    timers.set(() => setPhase('card'), CARD_AT);
    return () => timers.clearAll();
  }, [timers]);

  const handleStrange = (e) => {
    const now = Date.now();
    if (now - lastPress.current < PRESS_COOLDOWN) return;
    lastPress.current = now;
    setPresses((n) => n + 1);
    burstAt(e, { count: 22, spread: 190, size: [12, 26] });
    if (presses === 0) confetti();
  };

  if (phase !== 'card') {
    return (
      <section className={`finale-intro ${phase === 'intro-out' ? 'is-leaving' : ''}`} aria-live="polite">
        {FINALE_INTRO.slice(0, shown).map((line, i) => (
          <p key={line.text} className={`finale-intro__line is-${line.kind} ${i === 0 ? 'is-first' : ''}`}>
            {line.kind === 'no' && (
              <span className="finale-intro__x" aria-hidden="true">
                ✕
              </span>
            )}
            {line.text}
          </p>
        ))}
      </section>
    );
  }

  return (
    <section className="finale">
      <article className="finale-card">
        <span className="finale-card__tape" aria-hidden="true" />
        <PopHeart className="finale-card__pop finale-card__pop--1" size={28} color="var(--pink)" />
        <PopHeart className="finale-card__pop finale-card__pop--2" size={22} color="var(--lav)" />

        <h1 className="finale-card__title reveal" style={{ '--i': 0 }}>
          ладно, признаюсь <span className="finale-card__heart">♡</span>
        </h1>
        <p className="finale-card__main reveal" style={{ '--i': 1 }}>
          я просто хотел отправить тебе что-то, что заставит тебя улыбнуться.
        </p>
        <p className="finale-card__next reveal" style={{ '--i': 2 }}>
          если ты сейчас хоть немного улыбнулась — значит, всё получилось :)
        </p>
        <p className="finale-card__sign reveal" style={{ '--i': 3 }}>
          конец расследования. пожалуйста, не суди разработчика строго.
        </p>

        <div className="finale-card__actions reveal" style={{ '--i': 4 }}>
          <HeartButton bounce={presses} onClick={handleStrange}>
            ну ты и странный ♡
          </HeartButton>

          <div className="finale-card__answer" aria-live="polite">
            {presses > 0 && (
              <>
                <p className="finale-card__accepted">принимается. главное, что ты улыбнулась ♡</p>
                <p className="finale-card__ps hand">p.s. насчёт названия сайта — мы соврали. это было тебе.</p>
              </>
            )}
          </div>
        </div>
      </article>

      <button type="button" className="link-btn finale__restart reveal" style={{ '--i': 5 }} onClick={onRestart}>
        пройти ещё раз
      </button>
    </section>
  );
}
