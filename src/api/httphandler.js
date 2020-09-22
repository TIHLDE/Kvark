/* eslint-disable no-console */
import COOKIE from './cookie';
import { TOKEN_HEADER_NAME, TIHLDE_API, ACCESS_TOKEN } from '../settings';

export class IRequest {
  constructor(method, url, data = {}, withAuth = true, args = {}) {
    this.method = method;
    this.data = data;
    this.headers = { 'Content-Type': 'application/json' };
    this.url = TIHLDE_API.URL + url;
    this.args = args;

    if (withAuth) {
      this.headers[TOKEN_HEADER_NAME] = COOKIE.get(ACCESS_TOKEN);
    }

    for (const key in args) {
      this.headers[key] = args[key];
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
    this.response = response
      .then((data) => {
        if (!data) {
          data = {};
        }

        this.isError = !data.ok;
        this.status = data.status;

        if (data.json === undefined) {
          return data;
        }

        return data.json();
      })
      .catch((error) => {
        const data = {};
        data.isError = true;
        data.status = error.message;
        data.detail = 'Ukjent tjenerfeil';
        return data;
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
  }).catch((error) => console.log(error));
};

const getRequest = (method, url, headers, args) => {
  return fetch(url + argsToParams(args), {
    method: method,
    headers: headers,
  }).catch((error) => console.log(error));
};

const argsToParams = (data) => {
  let args = '?';
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const value in data[key]) {
        args += '&' + key + '=' + data[key][value];
      }
    } else {
      args += '&' + key + '=' + data[key];
    }
  }
  return args;
};
