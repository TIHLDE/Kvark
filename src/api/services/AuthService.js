import AUTH from '../auth';
import { getCookie, setCookie, removeCookie } from '../cookie';
import { ACCESS_TOKEN } from '../../settings';

class AuthService {
  static createUser = (data) => {
    const response = AUTH.createUser(data).response();
    return response.then((data) => {
      if (data) {
        return data;
      }
      return null;
    });
  };

  static logIn = (username, password) => {
    const response = AUTH.authenticate(username, password).response();
    return response.then((data) => {
      if (response.isError) {
        throw data;
      }
      if (data && data.token) {
        setCookie(ACCESS_TOKEN, data.token);
        return data;
      }
      return null;
    });
  };

  static forgotPassword = (email) => {
    const response = AUTH.forgotPassword(email).response();
    return response.then((data) => {
      if (data && data.detail) {
        return data;
      }
      return null;
    });
  };

  static isAuthenticated() {
    return typeof getCookie(ACCESS_TOKEN) !== 'undefined';
  }

  static logOut() {
    // If not logged in, return
    if (!this.isAuthenticated()) {
      return;
    }

    // Log out
    removeCookie(ACCESS_TOKEN);
  }
}

export default AuthService;
