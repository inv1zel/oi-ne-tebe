import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Набор setTimeout'ов, которые автоматически очищаются при размонтировании.
 * set(fn, ms) — запланировать, clearAll() — отменить всё запланированное.
 */
export function useTimers() {
  const ids = useRef(new Set());

  const set = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    ids.current.forEach(clearTimeout);
    ids.current.clear();
  }, []);

  useEffect(() => clearAll, [clearAll]);

  return useMemo(() => ({ set, clearAll }), [set, clearAll]);
}
