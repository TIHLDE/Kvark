import AUTH from '../auth';
import COOKIE from '../cookie';
import store from '../../store/store';
import * as UserActions from '../../store/actions/UserActions';
import UserService from './UserService';
import {ACCESS_TOKEN} from '../../settings';

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
        if (data && data.token) {
          COOKIE.set(ACCESS_TOKEN, data.token);
          UserService.getUserData();
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
      return typeof COOKIE.get(ACCESS_TOKEN) !== 'undefined';
    }

    static logOut() {
      // If not logged in, return
      if (!this.isAuthenticated()) {
        return;
      }

      // Log out
      COOKIE.remove(ACCESS_TOKEN);
      UserActions.clearData()(store.dispatch);
    }
}

export default AuthService;
