import Cookies from 'universal-cookie';

const TOKEN_COOKIE_ID = 'access_token';
const cookies = new Cookies();

export class Token {
    set(token) {
        cookies.set(TOKEN_COOKIE_ID, token, {path: '/'});
    }

    get() {
        return cookies.get(TOKEN_COOKIE_ID);
    }

    remove() {
        cookies.remove(TOKEN_COOKIE_ID, {path: '/'});
    }
}
const TOKEN = new Token();
export default TOKEN;