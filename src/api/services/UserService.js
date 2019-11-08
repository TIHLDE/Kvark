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
            if(user.first_name !== undefined) {
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
    static getUserDataForce = async () => {
        // Check if the user is logged in
        if (AuthService.isAuthenticated()) {
            // Fetch
            return API.getUserData().response()
            .then((data) => {
                UserActions.setUserData(data)(store.dispatch);
                return UserActions.getUserData(store.getState()).userData;
            });
        } else {
            return null;
        }
    }

    static isGroupMember = async () => {
        let isHS = false; let isPromo = false; let isNok = false; let isDevkom = false;
        if (AuthService.isAuthenticated()) {
            return await UserService.getUserData().then((userData) => {
                const groups = userData.groups;
                groups.forEach(element => {
                    switch (element) {
                        case "HS": isHS = true; break;
                        case "Promo": isPromo = true; break;
                        case "NoK": isNok = true; break;
                        case "DevKom": isDevkom = true; break;
                        default: break;
                    }
                });
                return {"isHS":isHS,"isPromo":isPromo,"isNok":isNok,"isDevkom":isDevkom};
            });
        } else {
            return{"isHS":isHS,"isPromo":isPromo,"isNok":isNok,"isDevkom":isDevkom};
        }
    }

    static updateUserData = async (userName, userData, callback=null) => {
        const response = API.updateUserData(userName, userData).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default UserService;
