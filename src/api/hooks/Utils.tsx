import { EffectCallback, useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'api/hooks/Snackbar';
import { getCookie, setCookie } from 'api/cookie';

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

/**
 * Trigger the Web Share API.
 * If the Web Share API isn't supported, it copies the content to clipboard.
 *
 * @param shareData Content to be shared
 * @param fallbackSnackbar Text to be displayed in a snackbar when copied to clipboard if the Web Share API isn't supported
 */
export const useShare = (shareData: globalThis.ShareData, fallbackSnackbar?: string, onShare?: () => void) => {
  const showSnackbar = useSnackbar();
  const [hasShared, setShared] = useState(false);

  useEffect(() => {
    if (hasShared) {
      const timeoutId = setTimeout(() => setShared(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [hasShared]);

  /**
   * Copies text to the clipboard
   * @param text Text which should be copied to clipboard
   * @param noSnackbar If the snackbar not should be shown even if snackbar text is given
   */
  const copyToClipboard = async (text: string, noSnackbar = false) => {
    const { default: copyToClipboard } = await import('copy-to-clipboard');
    const hasCopied = copyToClipboard(text);
    setShared(hasCopied);
    if (fallbackSnackbar && !noSnackbar) {
      showSnackbar(fallbackSnackbar, 'info');
    }
  };

  /**
   * Triggers the Share functionality of your device if available.
   * Falls back to copying the content to the clipboard if not supported
   */
  const share = () => {
    const fallbackCopyText = shareData.url || shareData.text || shareData.title || '';
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => setShared(true))
        .catch(() => copyToClipboard(fallbackCopyText, true));
    } else {
      showSnackbar('else', 'error');
      copyToClipboard(fallbackCopyText);
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
// eslint-disable-next-line comma-spacing
export const usePersistedState = <T,>(key: string, defaultValue: T, duration = 3600 * 24000) => {
  const COOKIE_KEY = `TIHLDE-${key}`;
  const [state, setState] = useState<T>(() => {
    try {
      if (getCookie(COOKIE_KEY)) {
        return JSON.parse(getCookie(COOKIE_KEY) as string) as unknown as T;
      }
      return defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    setCookie(COOKIE_KEY, JSON.stringify(state), duration);
  }, [COOKIE_KEY, state, duration]);

  return [state, setState] as const;
};
