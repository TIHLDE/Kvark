// Used for getting auth tokens from the WebAuth API
// for further use in the Tihlde API.
// We might want to create a proxy for the WebAuth API
// since it does not currently support CORS Headers
// (The dummy one used here does however)

import Cookies from 'universal-cookie';

import {get, post} from './http';

// The dummy WebAuth server
const WEB_AUTH_URL = 'https://tihlde-webauth.herokuapp.com/';
const WEB_AUTH_URL_BASE = WEB_AUTH_URL + 'api/v1/';

const TOKEN_COOKIE_ID = 'webauth_token';
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
export const TOKEN = new Token();


export default {
    // Returns a promise which resolves to the token
    auth(username, password) {
        return post('auth', {body: {username, password}, json: true}, WEB_AUTH_URL_BASE)
            .then((data) => data['token']);
    },

    // Returns a promise which resolves to the session data
    logout(token) {
        return post('logout', {token}, WEB_AUTH_URL_BASE);
    },

    // Returns a promise which resolves to the session data
    verify(token) {
        return get('verify', {token, json: true}, WEB_AUTH_URL_BASE);
    },

    // Returns a promise which resolves to {msg, token} on success and {msg} on
    // failure. The old token (param token) will be invalidated if successfull.
    setpw(token, oldpw, newpw) {
        const arg = {
            token, 'old-password': oldpw, 'new-password': newpw, json: true,
        };
        return get('setpw', arg, WEB_AUTH_URL_BASE);
    },
};
