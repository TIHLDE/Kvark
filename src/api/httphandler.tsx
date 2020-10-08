/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { getCookie } from 'api/cookie';
import { TOKEN_HEADER_NAME, TIHLDE_API, ACCESS_TOKEN } from 'settings';
import { RequestMethodType } from 'types/Enums';

export class IRequest {
  method: RequestMethodType;
  url: string;
  data: Record<string, unknown>;
  args?: Record<string, string>;
  headers: Record<string, string>;
  constructor(method: RequestMethodType, url: string, data?: Record<string, unknown>, withAuth = true, args?: Record<string, string>) {
    this.method = method;
    this.data = data || {};
    this.headers = { 'Content-Type': 'application/json' };
    this.url = TIHLDE_API.URL + url;
    this.args = args;

    if (withAuth) {
      this.headers[TOKEN_HEADER_NAME] = getCookie(ACCESS_TOKEN) as string;
    }

    for (const key in args) {
      this.headers[key] = args[key] as string;
    }
  }

  response() {
    if (this.method === RequestMethodType.GET) {
      return new IResponse(getRequest(this.method, this.url, this.headers, this.data));
    } else {
      return new IResponse(request(this.method, this.url, this.headers, this.data));
    }
  }
}

class IResponse {
  response: Promise<any>;
  isError = false;
  status = 200;
  constructor(response: Promise<Response>) {
    this.response = response
      .then((data) => {
        this.isError = !data.ok;
        this.status = data.status;

        if (data.json === undefined) {
          return data;
        }

        return data.json();
      })
      .catch((error) => {
        return {
          isError: true,
          status: error.message,
          detail: 'Ukjent tjenerfeil',
        };
      });
  }
  then(method: any) {
    return this.response.then(method);
  }
}

const request = (method: RequestMethodType, url: string, headers: Record<string, string>, data: Record<string, unknown>): Promise<Response> => {
  return fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(data),
  });
};

const getRequest = (method: RequestMethodType, url: string, headers: Record<string, string>, args: Record<string, unknown>): Promise<Response> => {
  return fetch(url + argsToParams(args), {
    method: method,
    headers: headers,
  });
};

const argsToParams = (data: Record<string, any>) => {
  let args = '?';
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const value in data[key] as any) {
        args += '&' + key + '=' + data[key][value];
      }
    } else {
      args += '&' + key + '=' + data[key];
    }
  }
  return args;
};
