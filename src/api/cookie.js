import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class Cookie {
  set(key, value, duration = 3600 * 24000 * 30) {
    cookies.set(key, value, {path: '/', expires: new Date(Date.now() + duration)});
  }

  get(key) {
    return cookies.get(key);
  }

  remove(key) {
    cookies.remove(key, {path: '/'});
  }
}
const COOKIE = new Cookie();
export default COOKIE;
