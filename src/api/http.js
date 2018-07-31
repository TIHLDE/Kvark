// This file contains functions for using http requests/responses.
// It uses promises (as opposed to HttpHandler.js),
// All functions regarding HTTP returns a promise.

import {TIHLDE_API, TOKEN_HEADER_NAME} from '../settings';

// NOTE: Experimenting with various ways to simplify requests
export function fetchmethod(base, endpoint, method, data={}, body, bodyIsJson, token) {
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

    return fetch(base + endpoint, data)
        .then((response) => {
            if (response.json) {
                return response.json();
            }
            return response;
        });
}

export function get(endpoint, arg, base=TIHLDE_API.URL) {
    return fetchmethod(base, endpoint, 'GET', arg['data'], arg['body'],
                    arg['json'], arg['token']);
}

export function post(endpoint, arg, base=TIHLDE_API.URL) {
    return fetchmethod(base, endpoint, 'POST', arg['data'], arg['body'],
                    arg['json'], arg['token']);
}
