import { useRef, useState } from 'react';
import Progress from './Progress.jsx';
import QuestionCard from './QuestionCard.jsx';
import DevPopup from './DevPopup.jsx';
import QuizStickers from './QuizStickers.jsx';
import SparkleRing from '../decor/SparkleRing.jsx';
import { useFx } from '../../fx/context.js';
import { useTimers } from '../../hooks/useTimers.js';
import { QUESTIONS } from '../../data/content.js';
import './quiz.css';

const TOTAL = QUESTIONS.length;
const REACT_FOR = 1250; // сколько показываем реакцию системы
const LEAVE_FOR = 300; // анимация ухода карточки
const POPUP_EXTRA = 1900; // после 4-го вопроса ждём, пока отыграет попап

/**
 * Тест. Номер текущего вопроса = количество сохранённых ответов,
 * поэтому прогресс не теряется и не может «перескочить».
 */
export default function QuizScreen({ answers, onAnswer }) {
  const { notify, burstAt } = useFx();
  const timers = useTimers();
  const locked = useRef(false);

  const [picked, setPicked] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [popup, setPopup] = useState(null);

  const index = Math.min(answers.length, TOTAL - 1);
  const chaos = answers.length; // сколько вопросов уже позади
  const question = QUESTIONS[index];

  const handlePick = (answerIndex, e) => {
    if (locked.current || answers.length >= TOTAL) return;
    locked.current = true;

    const isLast = index === TOTAL - 1;
    const withPopup = index === 3;
    const extra = withPopup ? POPUP_EXTRA : 0;

    setPicked(answerIndex);
    setPhase('reacting');
    burstAt(e, { count: 7, spread: 70, size: [10, 18] });

    if (withPopup) {
      timers.set(() => setPopup('ask'), 650);
      timers.set(() => setPopup('nvm'), 1650);
      timers.set(() => setPopup('closing'), 2750);
      timers.set(() => setPopup(null), 3050);
    }

    timers.set(() => setPhase('leaving'), REACT_FOR + extra);
    timers.set(() => {
      onAnswer(answerIndex);
      if (isLast) return; // дальше App сам переключит на экран анализа; карточка остаётся скрытой
      setPicked(null);
      setPhase('idle');
      locked.current = false;
      if (index === 2) {
        notify('система заметила подозрительно милое поведение', { variant: 'warn', icon: '⚠', duration: 4200 });
      }
    }, REACT_FOR + extra + LEAVE_FOR);
  };

  const filled = answers.length + (phase !== 'idle' ? 1 : 0);

  return (
    <section className={`quiz chaos-${Math.min(chaos, 4)}`}>
      <div className="quiz__top">
        <Progress current={index + 1} total={TOTAL} filled={Math.min(filled, TOTAL)} />
        <div className="quiz__caption-slot">
          {chaos >= 2 && <p className="quiz__caption hand">всё идёт по плану. вроде.</p>}
        </div>
      </div>

      <div className={`quiz__card-wrap ${chaos >= 3 ? 'is-wobbly' : ''}`}>
        {chaos >= 3 && <SparkleRing />}
        <QuestionCard
          key={index}
          question={question}
          index={index}
          picked={picked}
          phase={phase}
          onPick={handlePick}
        />
      </div>

      <QuizStickers chaos={chaos} />
      {popup && <DevPopup state={popup} />}
    </section>
  );
}
