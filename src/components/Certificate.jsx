import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Sparkle } from './decor/Shapes.jsx';
import './certificate.css';

// во встроенных просмотрщиках (iframe) печать обычно заблокирована — там кнопку не показываем
const canPrint = () => {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
};

const today = () =>
  new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

function Stamp() {
  return (
    <svg className="cert__stamp" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="stamp-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
      <text fontSize="11.5" fontWeight="700" letterSpacing="2.2" fill="currentColor">
        <textPath href="#stamp-circle">ОДОБРЕНО • МИЛО • ОДОБРЕНО • МИЛО •</textPath>
      </text>
      <path
        d="M60 79s-17-10.3-20-21c-2-7.5 2.9-14.3 10-14.3 4.2 0 7.3 2.3 10 5.8 2.7-3.5 5.8-5.8 10-5.8 7.1 0 12 6.8 10 14.3C77 68.7 60 79 60 79z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Модальное окно с сертификатом. Можно сохранить скриншотом или распечатать. */
export default function Certificate({ onClose }) {
  const closeRef = useRef(null);
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    // сертификат всегда открывается с начала, даже если кнопка «готово» ниже экрана
    const raf = requestAnimationFrame(() => modalRef.current?.scrollTo(0, 0));
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // портал: модалка не должна зависеть от transform'ов родительского экрана
  return createPortal(
    <div
      ref={modalRef}
      className="cert-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cert-modal__inner">
        <article className="certificate">
          <div className="cert__frame">
            <Sparkle className="cert__corner cert__corner--tl" />
            <Heart className="cert__corner cert__corner--tr" />
            <Heart className="cert__corner cert__corner--bl" />
            <Sparkle className="cert__corner cert__corner--br" />

            <p className="cert__series">№ 001 · серия ♡♡♡</p>
            <h2 id="cert-title" className="cert__title">
              сертификат
              <span>официальной милоты</span>
            </h2>

            <div className="cert__divider" aria-hidden="true">
              <i />
              <Heart />
              <i />
            </div>

            <p className="cert__small">настоящим подтверждается, что обладательница</p>
            <p className="cert__name">ты</p>
            <p className="cert__small cert__note">(несмотря на название сайта)</p>

            <p className="cert__text">
              Выдана за подозрительно хорошее настроение и потенциальное нарушение чужого спокойствия.
            </p>

            <p className="cert__result">
              уровень милоты: <strong>подозрительно высокий</strong>
            </p>

            <div className="cert__footer">
              <div className="cert__sign">
                <span className="cert__sign-value">{today()}</span>
                <span className="cert__sign-label">дата выдачи</span>
              </div>
              <Stamp />
              <div className="cert__sign">
                <span className="cert__sign-value cert__sign-value--hand">комиссия ♡</span>
                <span className="cert__sign-label">подпись</span>
              </div>
            </div>
          </div>
        </article>

        <p className="cert-modal__hint hand">можно сделать скриншот — мы не обидимся</p>

        <div className="cert-modal__actions">
          {canPrint() && (
            <button type="button" className="btn btn--soft" onClick={() => window.print()}>
              <span className="btn__label">распечатать / pdf</span>
            </button>
          )}
          <button ref={closeRef} type="button" className="btn btn--primary cert-modal__done" onClick={onClose}>
            <span className="btn__label">готово ♡</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
