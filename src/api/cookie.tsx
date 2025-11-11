import Cookies from 'universal-cookie';

const cookies = new Cookies();

export async function getCookie(key: string): Promise<string | undefined> {
  if (import.meta.env.SSR) {
    const { getCookie: tsr_getCookie } = await import('@tanstack/react-start/server');
    return tsr_getCookie(key);
  }

  return cookies.get(key);
}

export async function setCookie(key: string, value: string, duration = 3600 * 24000 * 30) {
  const cookieOptions = {
    path: '/',
    expires: new Date(Date.now() + duration),
  } as const;

  if (import.meta.env.SSR) {
    const { setCookie: tsr_setCookie } = await import('@tanstack/react-start/server');
    return tsr_setCookie(key, value, cookieOptions);
  }

  cookies.set(key, value, cookieOptions);
}

export async function removeCookie(key: string) {
  if (import.meta.env.SSR) {
    const { setCookie: tsr_setCookie } = await import('@tanstack/react-start/server');
    return tsr_setCookie(key, '', { path: '/', expires: new Date(0) });
  }
  cookies.remove(key, { path: '/' });
}
