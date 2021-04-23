import { useEffect, useRef } from "react";

/**
 * sub when next effect
 * @param effect
 * @param deps
 */
export const useNextEffect: typeof useEffect = (effect, deps) => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
    } else {
      return effect();
    }
  }, deps);
};
