import { useCallback, useState } from "react";
import { useNextEffect } from "./useNextEffect";

interface Props<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (val: T, ...args: any[]) => void;
}

export const useControlState = <T>({ value, onChange, defaultValue }: Props<T> = {} as any) => {
  const [state, setState] = useState<T | undefined>(() => {
    if (value) {
      return value;
    }
    return defaultValue;
  });

  useNextEffect(() => {
    setState(value);
  }, [value]);

  const handleSetState = useCallback(
    (v: T, ...args: any[]) => {
      if (!value) {
        setState(v);
      }
      if (onChange) {
        onChange(v, ...args);
      }
    },
    [onChange],
  );

  return [value ? value : state, handleSetState] as const;
};
