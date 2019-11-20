import AUTH from '../auth';
import TOKEN from '../token';
import store from '../../store/store';
import * as UserActions from '../../store/actions/UserActions';
import UserService from './UserService';

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
            if(data && data.token) {
                TOKEN.set(data.token);
                UserService.getUserData();
                return data;
            }
            return null;
        });
    };

    static isAuthenticated () {
        return typeof TOKEN.get() !== 'undefined'
    }

    static logOut() {
        // If not logged in, return
        if(!this.isAuthenticated()) {
            return;
        }

        // Log out
        TOKEN.remove();
        UserActions.clearData()(store.dispatch);
        return;
    }
}

export default AuthService;