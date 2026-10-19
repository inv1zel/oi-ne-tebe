import { Sparkle } from './Shapes.jsx';

// Мягкий фон: пастельные пятна, точечная сетка и пара блёсток по углам.
export default function BackgroundDecor() {
  return (
    <div className="bg decor" aria-hidden="true">
      <span className="bg__blob bg__blob--pink" />
      <span className="bg__blob bg__blob--lav" />
      <span className="bg__blob bg__blob--peach" />
      <span className="bg__grid" />
      <Sparkle className="bg__spark bg__spark--1" />
      <Sparkle className="bg__spark bg__spark--2" />
      <Sparkle className="bg__spark bg__spark--3" />
    </div>
  );
}
