import { useRef, useState } from 'react';
import Certificate from './Certificate.jsx';
import HeartButton from './ui/HeartButton.jsx';
import PopHeart from './decor/PopHeart.jsx';
import { useFx } from '../fx/context.js';
import { useTimers } from '../hooks/useTimers.js';
import { METRICS } from '../data/content.js';
import './results.css';

function MetricViz({ metric }) {
  if (metric.kind === 'bar') {
    return (
      <span className="viz viz--bar">
        <span className="viz__fill" style={{ '--w': `${metric.fill}%` }} />
      </span>
    );
  }
  if (metric.kind === 'unknown') {
    return (
      <span className="viz viz--unknown">
        <span>? ? ?</span>
      </span>
    );
  }
  if (metric.kind === 'critical') {
    return (
      <span className="viz viz--critical">
        <span className="viz__fill" style={{ '--w': '100%' }} />
        <span className="viz__alarm">!!</span>
      </span>
    );
  }
  return <span className="viz viz--shy">(⁄ ⁄•⁄ω⁄•⁄ ⁄)</span>;
}

/** Результаты + кнопка сертификата. Дальше к финалу можно перейти только после сертификата. */
export default function Results({ onNext, onRestart }) {
  const { notify, confetti } = useFx();
  const timers = useTimers();
  const [certOpen, setCertOpen] = useState(false);
  const [certSeen, setCertSeen] = useState(false);
  const opener = useRef(null);

  const openCert = () => {
    setCertOpen(true);
    if (!certSeen) confetti();
  };

  const closeCert = () => {
    setCertOpen(false);
    opener.current?.focus();
    if (!certSeen) {
      setCertSeen(true);
      timers.set(() => notify('хм. кажется, в системе что-то пошло не так...', { icon: '👀' }), 500);
    }
  };

  return (
    <section className="results">
      <header className="results__head">
        <p className="results__kicker">отчёт № 001 · строго конфиденциально</p>
        <h1 className="results__title">
          результаты готовы <span className="results__heart">♡</span>
        </h1>
        <PopHeart className="results__pop" size={26} color="var(--lav)" />
      </header>

      <div className="hero-result">
        <span className="sticker hero-result__sticker">шкала закончилась</span>
        <p className="hero-result__label">главный результат</p>
        <p className="hero-result__main">
          уровень милоты: <strong>подозрительно высокий</strong>
        </p>
        <div className="hero-meter" aria-hidden="true">
          <span className="hero-meter__fill" />
          <span className="hero-meter__marks">
            <i>0</i>
            <i>50</i>
            <i>100</i>
          </span>
        </div>
      </div>

      <ul className="metrics">
        {METRICS.map((m, i) => (
          <li key={m.label} className="metric" style={{ '--i': i }}>
            <span className="metric__label">{m.label}</span>
            <span className="metric__value">{m.value}</span>
            <MetricViz metric={m} />
          </li>
        ))}
      </ul>

      <p className="results__disclaimer">
        * шуточные показатели. настоящая психологическая оценка сюда не влезла.
      </p>

      <div className="results__actions">
        <HeartButton ref={opener} onClick={openCert} aria-haspopup="dialog">
          забрать сертификат ♡
        </HeartButton>

        {certSeen && (
          <button type="button" className="btn btn--ghost results__next" onClick={onNext}>
            <span className="btn__label">
              подожди... тут что-то не так <span aria-hidden="true">→</span>
            </span>
          </button>
        )}

        <button type="button" className="link-btn" onClick={onRestart}>
          пройти ещё раз
        </button>
      </div>

      {certOpen && <Certificate onClose={closeCert} />}
    </section>
  );
}
