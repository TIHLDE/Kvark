import { IFetch } from 'api/fetch';
import { RequestMethodType } from 'types/Enums';
import { User, RequestResponse, LoginRequestResponse } from 'types/Types';

export default {
  createUser: (item: User) => {
    return IFetch<RequestResponse>(RequestMethodType.POST, 'user/', item, false);
  },
  authenticate: (username: string, password: string) => {
    return IFetch<LoginRequestResponse>(RequestMethodType.POST, 'auth/login/', { user_id: username, password: password }, false);
  },
  forgotPassword: (email: string) => {
    return IFetch<RequestResponse>(RequestMethodType.POST, 'auth/rest-auth/password/reset/', { email: email }, false);
  },
};
