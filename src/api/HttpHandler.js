import Cookies from 'universal-cookie';

import {TOKEN_HEADER_NAME} from './webauth';

const TOKEN_IDENTIFICATION = 'webauth_token';
const cookies = new Cookies();

class Token {
    set(token) {
        cookies.set(TOKEN_IDENTIFICATION, token, {path: '/'});
    }

    get() {
        return cookies.get(TOKEN_IDENTIFICATION);
    }

    remove() {
        cookies.remove(TOKEN_IDENTIFICATION, {path: '/'});
    }
}
export const TOKEN = new Token();

const URL = 'http://api-tihlde.herokuapp.com'; // 'http://127.0.0.1:8080'
const BASE = URL + '/v1/';

export class IRequest {
    constructor(method, url, data={}, withAuth=true, args={}) {
        this.method = method;
        this.data = data;
        this.headers = {'Content-Type': 'application/json'};
        this.url = BASE + url;

        if (withAuth) {
            this.headers[TOKEN_HEADER_NAME] = TOKEN.get();
        }
    }

    response() {
        if (this.method === 'GET') {
            return new IResponse(getRequest(this.method, this.url, this.headers, this.data));
        } else {
            return new IResponse(request(this.method, this.url, this.headers, this.data));
        }
    }
}

class IResponse {
    constructor(response) {
        this.response = response.then((data) => {
            if (!data) {
                data = {};
            }

            this.isError = !data.ok;
            this.status = data.status;
            
            return (data.json)? data.json() : data;
        });
    }

    then(method) {
        return this.response.then(method);
    }
}

const request = (method, url, headers, data) => {
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
    })
    .catch((error) => console.log(error));
}

const getRequest = (method, url, headers) => {
    return fetch(url, {
        method: method,
        headers: headers,
    })
    .catch((error) => console.log(error));
};

