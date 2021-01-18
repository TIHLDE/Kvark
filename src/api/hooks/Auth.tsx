import { useCallback } from 'react';
import API from 'api/api';
import { getCookie, setCookie, removeCookie } from 'api/cookie';
import { ACCESS_TOKEN } from 'constant';
import { UserCreate } from 'types/Types';

export const useAuth = () => {
  const createUser = useCallback((data: UserCreate) => API.createUser(data), []);

  const logIn = useCallback(
    (username: string, password: string) =>
      API.authenticate(username, password).then((data) => {
        setCookie(ACCESS_TOKEN, data.token);
        return data;
      }),
    [],
  );

  const forgotPassword = useCallback((email: string) => API.forgotPassword(email), []);

  const isAuthenticated = useCallback(() => {
    return typeof getCookie(ACCESS_TOKEN) !== 'undefined';
  }, []);

  const logOut = useCallback(() => {
    if (!isAuthenticated()) {
      return;
    }

    removeCookie(ACCESS_TOKEN);
  }, [isAuthenticated]);

  return { createUser, logIn, forgotPassword, isAuthenticated, logOut };
};
