import {IRequest} from './httphandler';

export default {
    authenticate: (username, password) => {
        return new IRequest('POST', 'auth/', {username: username, password: password}, false, {}, true);
    },
}