import { EffectCallback, useEffect, useState, useRef } from 'react';

export const useInterval = (callback: EffectCallback, msDelay: number | null) => {
  const savedCallback = useRef<EffectCallback>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (msDelay) {
      const id = setInterval(tick, msDelay);
      return () => clearInterval(id);
    }
  }, [msDelay]);
};

// eslint-disable-next-line comma-spacing
export const useDebounce = <Type,>(value: Type, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
