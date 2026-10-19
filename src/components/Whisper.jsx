import { useEffect, useRef, useState } from 'react';
import { useTimers } from '../hooks/useTimers.js';
import { WHISPERS } from '../data/content.js';
import { rand } from '../utils/random.js';

const SHOW_FOR = 3800;

/** Случайные подписи «в углу», которые время от времени появляются и исчезают. */
export default function Whisper({ active }) {
  const timers = useTimers();
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const last = useRef(-1);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }

    const schedule = (delay) => {
      timers.set(() => {
        let i;
        do i = Math.floor(Math.random() * WHISPERS.length);
        while (i === last.current);
        last.current = i;
        setText(WHISPERS[i]);
        setVisible(true);
        timers.set(() => {
          setVisible(false);
          schedule(rand(7000, 12000));
        }, SHOW_FOR);
      }, delay);
    };

    schedule(5000);
    return () => timers.clearAll();
  }, [active, timers]);

  return (
    <p className={`whisper ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="whisper__dot" />
      {text}
    </p>
  );
}
