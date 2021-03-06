import { getCookie } from 'api/cookie';
import { TOKEN_HEADER_NAME, TIHLDE_API, ACCESS_TOKEN } from 'constant';
import { RequestResponse } from 'types/Types';

type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

type FetchProps = {
  method: RequestMethodType;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, unknown | any>;
  withAuth?: boolean;
  file?: File;
};

// eslint-disable-next-line comma-spacing
export const IFetch = <T,>({ method, url, data = {}, withAuth = true, file }: FetchProps): Promise<T> => {
  const urlAddress = TIHLDE_API.URL + url;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (withAuth) {
    headers.append(TOKEN_HEADER_NAME, getCookie(ACCESS_TOKEN) as string);
  }

  return fetch(request(method, urlAddress, headers, data, file)).then((response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json') || !response.ok || response.json === undefined) {
      if (response.json) {
        return response.json().then((responseData: RequestResponse) => {
          throw responseData;
        });
      } else {
        throw { detail: response.statusText } as RequestResponse;
      }
    }
    return response.json().then((responseData: T) => responseData);
  });
};

const request = (method: RequestMethodType, url: string, headers: Headers, data: Record<string, unknown>, file?: File) => {
  if (file) {
    const data = new FormData();
    data.append('image', file);
    return new Request('https://api.imgbb.com/1/upload?key=909df01fa93bd63405c9a36d662523f3', {
      method: method,
      body: data,
    });
  } else {
    return new Request(method === 'GET' ? url + argsToParams(data) : url, {
      method: method,
      headers: headers,
      ...(method !== 'GET' && { body: JSON.stringify(data) }),
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const argsToParams = (data: Record<string, any>) => {
  let args = '?';
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const value in data[key] as any) {
        args += `&${key}=${data[key][value]}`;
      }
    } else {
      args += `&${key}=${data[key]}`;
    }
  }
  return args;
};
