import { getCookie, setCookie } from '~/api/cookie';
import posthogJs from 'posthog-js';
import { useCallback, useEffect, useMemo, useRef, useState, type EffectCallback } from 'react';
import { toast } from 'sonner';

export const useInterval = (callback: EffectCallback, msDelay: number | null) => {
  const savedCallback = useRef<EffectCallback>(() => {});

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

export const useDebounce = <Type extends unknown>(value: Type, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Trigger the Web Share API.
 * If the Web Share API isn't supported, it copies the content to clipboard.
 *
 * @param shareData Content to be shared
 * @param fallbackSnackbar Text to be displayed in a snackbar when copied to clipboard if the Web Share API isn't supported
 */
export const useShare = (shareData: globalThis.ShareData, fallbackSnackbar?: string, onShare?: () => void) => {
  const [hasShared, setShared] = useState<boolean>(false);

  useEffect(() => {
    if (hasShared) {
      const timeoutId = setTimeout(() => setShared(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasShared]);
  async function clip(link: string, noSnackbar = false) {
    await navigator.clipboard.writeText(link);
    if (fallbackSnackbar && !noSnackbar) {
      toast.success(fallbackSnackbar);
    }
  }

  /**
   * Triggers the Share functionality of your device if available.
   * Falls back to copying the content to the clipboard if not supported
   */
  const share = () => {
    const fallbackCopyText = shareData.url ?? shareData.text ?? shareData.title ?? '';
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => setShared(true))
        .catch(() => clip(fallbackCopyText, true));
    } else {
      clip(fallbackCopyText);
    }
    if (onShare) {
      onShare();
    }
  };

  return { share, hasShared };
};

/**
 * Persist state by using cookies
 * @param key Cookie-key
 * @param defaultValue Default value of state
 * @param duration How long the cookie should live, default 24h
 */
export const usePersistedState = <T extends unknown>(key: string, defaultValue: T, duration = 3600 * 24000) => {
  const COOKIE_KEY = `TIHLDE-${key}`;
  const [state, setState] = useState<T>(() => {
    try {
      if (getCookie(COOKIE_KEY)) {
        return JSON.parse(getCookie(COOKIE_KEY) as string) as unknown as T;
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    setCookie(COOKIE_KEY, JSON.stringify(state), duration);
  }, [COOKIE_KEY, state, duration]);

  return [state, setState] as const;
};

export const useAnalytics = () => {
  /**
   * Create an event for tracking behaviour on the site.
   * @param category - The object that was interacted with, eg 'Video'
   * @param action - The type of interaction, eg 'play'
   * @param label - Useful for categorizing events, eg 'Ny-student'
   */
  const event = useCallback(analyticsEvent, []);

  return useMemo(() => {
    return { event };
  }, [event]);
};

export function analyticsEvent(action: string, category: string, label: string) {
  posthogJs.capture(category, { action, label });
}
