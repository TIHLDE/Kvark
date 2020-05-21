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
    static getUsers = async (filters = null) =>{
      if (AuthService.isAuthenticated()) {
        return API.getUsers(filters).response()
            .then((data)=>{
              return data;
            });
      }
    }

    static isGroupMember = async () => {
      let isHS = false; let isPromo = false; let isNok = false; let isDevkom = false;
      if (AuthService.isAuthenticated()) {
        await UserService.getUserData().then((userData) => {
          if (userData.groups) {
            const groups = userData.groups;
            isHS = groups.includes('HS');
            isPromo = groups.includes('Promo');
            isNok = groups.includes('NoK');
            isDevkom = groups.includes('DevKom');
          }
        });
      }
      return {'isHS': isHS, 'isPromo': isPromo, 'isNok': isNok, 'isDevkom': isDevkom};
    }

    static updateUserData = async (userName, userData, callback=null) => {
      const response = API.updateUserData(userName, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return data;
      });
    }

    static updateUserEvents = async (events, callback=null) => {
      return UserActions.updateUserEvents(events);
    }
}

export default UserService;
