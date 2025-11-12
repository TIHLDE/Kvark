import { createIsomorphicFn } from '@tanstack/react-start';
import { deleteCookie as tsr_deleteCookie, getCookie as tsr_getCookie, setCookie as tsr_setCookie } from '@tanstack/react-start/server';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DEFAULT_DURATION = 3600 * 1000 * 24 * 30;
const cookieOptions = (duration: number) => ({ path: '/', expires: new Date(Date.now() + duration) });

export const getCookie: (key: string) => string | undefined = createIsomorphicFn()
  .client((key: string) => cookies.get(key))
  .server((key: string) => tsr_getCookie(key));

export const setCookie: (key: string, value: string, duration?: number) => void = createIsomorphicFn()
  .client((key: string, value: string, duration = DEFAULT_DURATION) => cookies.set(key, value, cookieOptions(duration)))
  .server((key: string, value: string, duration = DEFAULT_DURATION) => tsr_setCookie(key, value, cookieOptions(duration)));

export const removeCookie: (key: string) => void = createIsomorphicFn()
  .client((key: string) => cookies.remove(key))
  .server((key: string) => tsr_deleteCookie(key));
