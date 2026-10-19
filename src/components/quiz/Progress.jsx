import { Heart } from '../decor/Shapes.jsx';

/** «вопрос N из 5» + полоса прогресса с сердечком на конце. */
export default function Progress({ current, total, filled }) {
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="progress">
      <div className="progress__row">
        <span className="progress__label">
          вопрос {current} из {total}
        </span>
        <span className="progress__pct">{pct}%</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label="прогресс теста"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={filled}
      >
        <span className="progress__fill" style={{ width: `${pct}%` }} />
        <span className="progress__thumb" style={{ left: `${pct}%` }}>
          <Heart />
        </span>
      </div>
    </div>
  );
}
