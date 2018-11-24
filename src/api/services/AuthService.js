import AUTH from '../auth';
import TOKEN from '../token';
/* import store from '../../store/store'; */

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
        return typeof TOKEN.get() !== undefined
    }
}

export default AuthService;