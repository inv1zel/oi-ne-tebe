import { useState } from 'react';
import { Heart } from '../decor/Shapes.jsx';

/**
 * Кнопка с сердечками: на компьютере сердечки вылетают при наведении,
 * на телефоне — при нажатии. bounce меняется снаружи, чтобы кнопка подпрыгнула.
 */
export default function HeartButton({ children, variant = 'primary', className = '', bounce, onClick, ...rest }) {
  const [presses, setPresses] = useState(0);

  return (
    <button
      type="button"
      className={`btn btn--${variant} ${className}`}
      data-bounce={bounce ? bounce % 2 : undefined}
      onPointerDown={() => setPresses((n) => n + 1)}
      onClick={onClick}
      {...rest}
    >
      <span className="btn__label">{children}</span>
      <span key={presses} className={`btn__hearts ${presses ? 'is-burst' : ''}`} aria-hidden="true">
        <Heart />
        <Heart />
        <Heart />
        <Heart />
      </span>
    </button>
  );
}
