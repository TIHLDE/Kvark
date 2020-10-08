/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRequest } from 'api/httphandler';
import { RequestMethodType } from 'types/Enums';

export default {
  createUser: (item: any) => {
    return new IRequest(RequestMethodType.POST, 'user/', item, false);
  },
  authenticate: (username: string, password: string) => {
    return new IRequest(RequestMethodType.POST, 'auth/login/', { user_id: username, password: password }, false);
  },
  forgotPassword: (email: string) => {
    return new IRequest(RequestMethodType.POST, 'auth/rest-auth/password/reset/', { email: email }, false);
  },
};
