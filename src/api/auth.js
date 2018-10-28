import {IRequest} from './httphandler';

export default {
    authenticate: (password) => {
        return new IRequest('POST', 'authenticate/', {password: password}, false);
    },
}