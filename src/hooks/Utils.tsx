import { EffectCallback, useEffect, useState, useRef, useCallback } from 'react';
import { useSnackbar } from 'hooks/Snackbar';
import { getCookie, setCookie } from 'api/cookie';
import { useMemo } from 'react';
import { SelectFormField, SelectFormFieldOption, TextFormField, User } from 'types';
import { GA_MEASUREMENT_ID } from 'constant';
import { FormFieldType } from 'types/Enums';

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

export const useDebounce = <Type extends unknown>(value: Type, delay: number) => {
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

export const removeIdsFromFields = (fields: Array<TextFormField | SelectFormField>) => {
  const newFields: Array<TextFormField | SelectFormField> = [];
  fields.forEach((field) => {
    const { id, ...restField } = field; // eslint-disable-line
    const newOptions: Array<SelectFormFieldOption> = [];
    if (field.type !== FormFieldType.TEXT_ANSWER) {
      field.options.forEach((option) => {
        const { id, ...restOption } = option; // eslint-disable-line
        newOptions.push(restOption as SelectFormFieldOption);
      });
    }
    newFields.push({ ...restField, options: newOptions } as TextFormField | SelectFormField);
  });
  return newFields;
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
export const usePersistedState = <T extends unknown>(key: string, defaultValue: T, duration = 3600 * 24000) => {
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

export const useGoogleAnalytics = () => {
  /**
   * Create an event for tracking behaviour on the site.
   * @param category - The object that was interacted with, eg 'Video'
   * @param action - The type of interaction, eg 'play'
   * @param label - Useful for categorizing events, eg 'Ny-student'
   */
  const event = useCallback((action: string, category: string, label: string) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }, []);

  /**
   * Hash a string stable. The same string will always return the same hash.
   * @param str The string to hash
   * @returns A hashed string.
   */
  const stableStringHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  };

  /**
   * Sets the user-id for Google Analytics, hashed. This improves the tracking since
   * GA can understand that a user is the same across different devices.
   * @param userId User_id of the user
   */
  const setUserId = useCallback((userId: User['user_id']) => {
    window.gtag('config', GA_MEASUREMENT_ID, { user_id: stableStringHash(userId) });
  }, []);

  return useMemo(() => {
    return { event, setUserId };
  }, [event]);
};
