import { createPortal } from 'react-dom';

/** Всплывающее окошко после 4-го вопроса. state: ask | nvm | closing */
export default function DevPopup({ state }) {
  const isAsk = state === 'ask';

  return createPortal(
    <div className={`devpop ${state === 'closing' ? 'is-closing' : ''}`} role="status" aria-live="assertive">
      <div className="devpop__win">
        <div className="win__bar devpop__bar">
          <span className="win__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          вопрос_разработчику.txt
        </div>
        <div className="devpop__body">
          <span className="devpop__icon" aria-hidden="true">
            {isAsk ? '🤔' : '🙈'}
          </span>
          <p key={isAsk ? 'ask' : 'nvm'} className={`devpop__text ${isAsk ? '' : 'is-nvm'}`}>
            {isAsk ? 'у нас тут вопрос к разработчику...' : 'ладно, неважно.'}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
