import { useEffect, useRef, useState } from 'react';
import { Heart } from './decor/Shapes.jsx';
import { useTimers } from '../hooks/useTimers.js';
import { ANALYSIS_STEPS } from '../data/content.js';
import './analysis.css';

const STEP_MS = 1050;
const HOLD_LAST = 1500;

/** Экран «анализа»: строчки появляются по очереди, потом — результаты. */
export default function Analysis({ onDone }) {
  const timers = useTimers();
  const [step, setStep] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    for (let i = 1; i < ANALYSIS_STEPS.length; i += 1) {
      timers.set(() => setStep(i), i * STEP_MS);
    }
    timers.set(() => onDoneRef.current(), (ANALYSIS_STEPS.length - 1) * STEP_MS + HOLD_LAST);
    return () => timers.clearAll();
  }, [timers]);

  const current = ANALYSIS_STEPS[step];
  const confused = step >= 2;

  return (
    <section className="analysis">
      <div className="terminal">
        <div className="win__bar terminal__bar">
          <span className="win__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          милотомер_v0.0.1.exe
        </div>

        <div className="terminal__body">
          <div className={`meter ${confused ? 'is-confused' : ''}`} aria-hidden="true">
            <span className="meter__heart">
              <Heart />
              {confused && <span className="meter__q">?</span>}
            </span>
            <span key={current.meter} className="meter__value">
              {current.meter}
            </span>
          </div>

          <ul className="log" aria-live="polite">
            {ANALYSIS_STEPS.slice(0, step + 1).map((s, i) => (
              <li key={s.text} className={`log__line tone-${s.tone} ${i === step ? 'is-current' : ''}`}>
                <span className="log__prompt" aria-hidden="true">
                  ›
                </span>
                <span className="log__text">{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="analysis__hint">пожалуйста, не закрывайте вкладку. система волнуется.</p>
    </section>
  );
}
