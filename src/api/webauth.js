// Used for getting auth tokens from the WebAuth API
// for further use in the Tihlde API.
// We might want to create a proxy for the WebAuth API
// since it does not currently support CORS Headers
// (The dummy one used here does however)

// The dummy WebAuth server
const WEB_AUTH_URL = 'https://tihlde-webauth.herokuapp.com';
const WEB_AUTH_URL_BASE = WEB_AUTH_URL + '/api/v1/';
export const TOKEN_HEADER_NAME = 'X-CSRF-Token';

// NOTE: Experimenting with various ways to simplify requests
function fetchmethod(endpoint, method, data={}, body, bodyIsJson, token) {
    data['method'] = method; // override

    let headers = data['headers'] || {};
    if (bodyIsJson && body) {
        headers['Content-Type'] = 'application/json';
        data['body'] = JSON.stringify(body);
    } else if (body) {
        data['body'] = body;
    }

    if (token) {
        headers[TOKEN_HEADER_NAME] = token;
    }
    data['headers'] = headers;

    return fetch(WEB_AUTH_URL_BASE + endpoint, data)
        .then((response) => {
            if (response.json) {
                return response.json();
            }
            return response;
        });
}

function get(endpoint, arg) {
    return fetchmethod(endpoint, 'GET', arg['data'], arg['body'],
                    arg['json'], arg['token']);
}

function post(endpoint, arg) {
    return fetchmethod(endpoint, 'POST', arg['data'], arg['body'],
                    arg['json'], arg['token']);
}

export default {
    // Returns a promise which resolves to the token
    auth(username, password) {
        return post('auth', {body: {username, password}, json: true})
            .then((data) => data['token']);
    },

    // Returns a promise which resolves to the session data
    logout(token) {
        return post('logout', {token});
    },

    // Returns a promise which resolves to the session data
    verify(token) {
        return get('verify', {token, json: true});
    },

    // Returns a promise which resolves to {msg, token} on success and {msg} on
    // failure. The old token (param token) will be invalidated if successfull.
    setpw(token, oldpw, newpw) {
        const arg = {
            token, 'old-password': oldpw, 'new-password': newpw, json: true,
        };
        return get('setpw', arg);
    },
};
