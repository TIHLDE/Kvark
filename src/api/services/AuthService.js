import AUTH from '../auth';
import TOKEN from '../token';
import store from '../../store/store';
import * as UserActions from '../../store/actions/UserActions';

class AuthService {

    static logIn = (username, password) => {
        const response = AUTH.authenticate(username, password).response();
        return response.then((data) => {
            if(data && data.token) {
                TOKEN.set(data.token);
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
        const response = AUTH.logout().response();
        return response.then((data) => {
            TOKEN.remove();
            UserActions.clearData()(store.dispatch);
            return data;
        })
    }
}

export default AuthService;