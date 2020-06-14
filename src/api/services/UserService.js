import API from '../api';
import store from '../../store/store';
import * as UserActions from '../../store/actions/UserActions';
import AuthService from '../../api/services/AuthService';

class UserService {

    static getUserData = async () => {
      // Check if the user is logged in
      if (AuthService.isAuthenticated()) {
        // Check store
        const user = store.getState().user.userData;
        if (user.first_name !== undefined) {
          return Promise.resolve(user);
        } else {
          // Fetch
          return API.getUserData().response()
              .then((data) => {
                UserActions.setUserData(data)(store.dispatch);
                return UserActions.getUserData(store.getState()).userData;
              });
        }
      } else {
        return null;
      }
    }
    static getUsers = async (filters = null) => {
      if (AuthService.isAuthenticated()) {
        const response = API.getUsers(filters).response();
        return response.then((data) => {
          return !response.isError ? Promise.resolve(data) : Promise.reject(data);
        });
      }
    }

    static updateUserData = async (userName, userData, callback = null) => {
      const response = API.updateUserData(userName, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return data;
      });
    }

    static updateUserEvents = async (events, callback = null) => {
      return UserActions.updateUserEvents(events);
    }
}

export default UserService;
