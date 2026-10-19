import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import Welcome from './components/Welcome.jsx';
import QuizScreen from './components/quiz/QuizScreen.jsx';
import Analysis from './components/Analysis.jsx';
import Results from './components/Results.jsx';
import Finale from './components/Finale.jsx';
import BackgroundDecor from './components/decor/BackgroundDecor.jsx';
import FloatingHearts from './components/decor/FloatingHearts.jsx';
import { useTimers } from './hooks/useTimers.js';
import { QUESTIONS } from './data/content.js';

import './components/decor/decor.css';
import './components/ui/ui.css';

const LEAVE_MS = 300;

/** Сколько сердечек летает на фоне: хаос нарастает по ходу теста. */
function heartsLevel(stage, answered) {
  if (stage === 'quiz') return answered >= 3 ? 'high' : answered >= 2 ? 'low' : 'none';
  if (stage === 'results' || stage === 'finale') return 'low';
  return 'none';
}

/**
 * Экраны: loading → welcome → quiz → analysis → results → finale.
 * Переход один за раз (busy), поэтому двойные нажатия ничего не ломают.
 */
export default function App() {
  const [stage, setStage] = useState('loading');
  const [answers, setAnswers] = useState([]);
  const [run, setRun] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const busy = useRef(false);
  const timers = useTimers();

  const go = useCallback(
    (next, beforeSwitch) => {
      if (busy.current) return;
      busy.current = true;
      setLeaving(true);
      timers.set(() => {
        beforeSwitch?.();
        setStage(next);
        setLeaving(false);
        busy.current = false;
        window.scrollTo(0, 0);
      }, LEAVE_MS);
    },
    [timers],
  );

  const recordAnswer = useCallback((answerIndex) => {
    setAnswers((prev) => (prev.length < QUESTIONS.length ? [...prev, answerIndex] : prev));
  }, []);

  useEffect(() => {
    if (stage === 'quiz' && answers.length >= QUESTIONS.length) go('analysis');
  }, [stage, answers.length, go]);

  const restart = useCallback(() => {
    go('welcome', () => {
      setAnswers([]);
      setRun((r) => r + 1);
    });
  }, [go]);

  return (
    <div className={`app stage-${stage} ${stage === 'analysis' ? 'is-calm' : ''}`}>
      <BackgroundDecor />
      <FloatingHearts level={heartsLevel(stage, answers.length)} />

      {stage !== 'loading' && <Header whispersOn={stage !== 'analysis'} />}

      <main className="stage">
        <div key={`${stage}-${run}`} className={`screen ${leaving ? 'is-leaving' : ''}`}>
          {stage === 'loading' && <Loader onDone={() => go('welcome')} />}
          {stage === 'welcome' && <Welcome onStart={() => go('quiz')} />}
          {stage === 'quiz' && <QuizScreen answers={answers} onAnswer={recordAnswer} />}
          {stage === 'analysis' && <Analysis onDone={() => go('results')} />}
          {stage === 'results' && <Results onNext={() => go('finale')} onRestart={restart} />}
          {stage === 'finale' && <Finale onRestart={restart} />}
        </div>
      </main>
    </div>
  );
}
