// Базовые SVG-фигурки. Цвет берут из currentColor.

export function Heart({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 22" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 21.2S2.3 15.3.6 9.2C-.6 4.9 2.2 1 6.3 1c2.4 0 4.2 1.3 5.7 3.3C13.5 2.3 15.3 1 17.7 1c4.1 0 6.9 3.9 5.7 8.2C21.7 15.3 12 21.2 12 21.2z"
      />
    </svg>
  );
}

export function Sparkle({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 0c.9 6.2 5.8 11.1 12 12-6.2.9-11.1 5.8-12 12-.9-6.2-5.8-11.1-12-12C6.2 11.1 11.1 6.2 12 0z" />
    </svg>
  );
}

export function Star({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        stroke="#2a2530"
        strokeWidth="1.6"
        strokeLinejoin="round"
        d="M12 1.8l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.7l-6.1 3.5 1.5-6.8-5.2-4.6 6.9-.7z"
      />
    </svg>
  );
}
