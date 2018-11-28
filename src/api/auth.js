import {IRequest} from './httphandler';

export default {
    authenticate: (username, password) => {
        return new IRequest('POST', 'auth/token/', {username: username, password: password}, false);
    },
    logout: () => {
        return new IRequest('POST', 'auth/logout/', {}, true);
    },
}