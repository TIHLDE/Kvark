import {IRequest} from './httphandler';

export default {
    createUser: (item) => {
        return new IRequest('POST', 'user/', item, false);
    },
    authenticate: (username, password) => {
        return new IRequest('POST', 'auth/login/', {user_id: username, password: password}, false);
    },
}