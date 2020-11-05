import React, { useEffect, useRef } from 'react';

export const useInterval = (callback: React.EffectCallback, msDelay: number | null) => {
  const savedCallback = useRef<React.EffectCallback>();

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
