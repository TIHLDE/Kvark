import { useCallback } from 'react';
import AUTH from 'api/auth';
import { getCookie, setCookie, removeCookie } from 'api/cookie';
import { ACCESS_TOKEN } from 'constant';
import { User } from 'types/Types';

export const useAuth = () => {
  const createUser = useCallback((data: User) => {
    return AUTH.createUser(data).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  const logIn = useCallback((username: string, password: string) => {
    return AUTH.authenticate(username, password).then((response) => {
      if (!response.isError) {
        setCookie(ACCESS_TOKEN, response.data.token);
        return Promise.resolve(response.data);
      } else {
        return Promise.reject(response.data);
      }
    });
  }, []);

  const forgotPassword = useCallback((email: string) => {
    return AUTH.forgotPassword(email).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

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
