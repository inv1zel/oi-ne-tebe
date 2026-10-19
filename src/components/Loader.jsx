import { useEffect, useRef, useState } from 'react';
import { Heart } from './decor/Shapes.jsx';
import { useTimers } from '../hooks/useTimers.js';
import { LOADING_MESSAGES } from '../data/content.js';
import './loader.css';

const STEP_AT = [0, 340, 680];
const DONE_AT = 1050;

/** Короткая загрузка при первом открытии (~1 секунда). */
export default function Loader({ onDone }) {
  const timers = useTimers();
  const [step, setStep] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    STEP_AT.forEach((at, i) => i && timers.set(() => setStep(i), at));
    timers.set(() => onDoneRef.current(), DONE_AT);
    return () => timers.clearAll();
  }, [timers]);

  return (
    <section className="loader" aria-live="polite">
      <div className="loader__heart">
        <Heart />
      </div>
      <p key={step} className="loader__text">
        {LOADING_MESSAGES[step]}
      </p>
      <div className="loader__track" aria-hidden="true">
        <span className="loader__fill" style={{ width: `${((step + 1) / LOADING_MESSAGES.length) * 100}%` }} />
      </div>
    </section>
  );
}
