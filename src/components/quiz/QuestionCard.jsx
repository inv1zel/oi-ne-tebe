import { Heart } from '../decor/Shapes.jsx';

const LETTERS = ['а', 'б', 'в'];
const TILTS = ['-1.4deg', '1.1deg', '-0.8deg', '1.5deg', '-1deg'];

/** Карточка одного вопроса. phase: idle | reacting | leaving */
export default function QuestionCard({ question, index, picked, phase, onPick }) {
  const locked = phase !== 'idle';

  return (
    <article
      className={`qcard ${phase === 'leaving' ? 'is-leaving' : ''}`}
      style={{ '--tilt': TILTS[index % TILTS.length] }}
      aria-labelledby={`q-${index}`}
    >
      <div className="qcard__meta">
        <span className="qcard__num">вопрос {String(index + 1).padStart(2, '0')}</span>
        <span className="qcard__tag hand">{question.tag}</span>
      </div>

      <h2 id={`q-${index}`} className="qcard__q">
        {question.text}
      </h2>

      <div className="qcard__answers" role="group" aria-label="варианты ответа">
        {question.answers.map((answer, i) => {
          const state = picked === i ? 'is-picked' : picked !== null ? 'is-dimmed' : '';
          return (
            <button
              key={answer.text}
              type="button"
              className={`answer ${state}`}
              style={{ '--i': i }}
              onClick={(e) => onPick(i, e)}
              disabled={locked}
              aria-pressed={picked === i}
            >
              <span className="answer__letter">{LETTERS[i]}</span>
              <span className="answer__text">{answer.text}</span>
              <Heart className="answer__check" />
            </button>
          );
        })}
      </div>

      <div className="qcard__reaction" aria-live="polite">
        {picked !== null && (
          <p className="reaction">
            <span className="reaction__who">система:</span> {question.answers[picked].reaction}
          </p>
        )}
      </div>
    </article>
  );
}
