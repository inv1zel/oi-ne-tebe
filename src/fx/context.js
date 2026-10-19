import { createContext, useContext } from 'react';

export const FxContext = createContext(null);

/** burst / burstAt / confetti / notify — общие эффекты для всех экранов */
export function useFx() {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error('useFx must be used inside <FxProvider>');
  return ctx;
}
