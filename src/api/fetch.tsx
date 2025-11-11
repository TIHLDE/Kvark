import { getCookie } from '~/api/cookie';
import { ACCESS_TOKEN, TIHLDE_API_URL, TOKEN_HEADER_NAME } from '~/constant';
import { RequestErrorResponse, type RequestResponse } from '~/types';
import { argsToParams } from '~/utils';

type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

type FetchProps = {
  method: RequestMethodType;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, unknown | any>;
  withAuth?: boolean;
  file?: File | File[] | Blob;
};

export const IFetch = async <T extends unknown>({ method, url, data = {}, withAuth = true, file }: FetchProps): Promise<T> => {
  const urlAddress = TIHLDE_API_URL + url;
  const headers = new Headers();
  if (!file) {
    headers.append('Content-Type', 'application/json');
  }

  if (withAuth) {
    const token = await getCookie(ACCESS_TOKEN);
    if (token) {
      headers.append(TOKEN_HEADER_NAME, token);
    }
  }

  return fetch(request(method, urlAddress, headers, data, file)).then((response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json') || !response.ok || response.json === undefined) {
      if (response.json) {
        return response.json().then((responseData: RequestResponse) => {
          throw responseData;
        });
      } else {
        throw new RequestErrorResponse(response.statusText);
      }
    }
    return response.json().then((responseData: T) => responseData);
  });
};
const request = (method: RequestMethodType, url: string, headers: Headers, data: Record<string, unknown>, files?: File | File[] | Blob) => {
  const getBody = () => {
    if (files) {
      const data = new FormData();
      if (Array.isArray(files)) {
        files.forEach((file) => data.append('file', file));
      } else {
        data.append('file', files);
      }
      return data;
    } else {
      return method !== 'GET' ? JSON.stringify(data) : undefined;
    }
  };
  const requestUrl = method === 'GET' ? url + argsToParams(data) : url;
  return new Request(requestUrl, {
    method: method,
    headers: headers,
    body: getBody(),
  });
};
