import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initial: T, max = 50) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);
  const skip = useRef(false);

  const push = useCallback(
    (next: T) => {
      if (skip.current) {
        skip.current = false;
        setPresent(next);
        return;
      }
      setPast((p) => [...p.slice(-(max - 1)), present]);
      setPresent(next);
      setFuture([]);
    },
    [present, max],
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f]);
    skip.current = true;
    setPresent(prev);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    skip.current = true;
    setPresent(next);
  }, [future, present]);

  /** 히스토리를 건너뛰고 덮어쓰기 (드래그 도중 등) */
  const silentSet = useCallback((next: T) => {
    skip.current = true;
    setPresent(next);
  }, []);

  return {
    state: present,
    push,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    silentSet,
    reset: (v: T) => { setPast([]); setFuture([]); setPresent(v); },
  };
}
