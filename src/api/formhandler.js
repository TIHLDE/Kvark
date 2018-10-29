import {IRequest} from './httphandler';

export default {
    formhandler: (data) => {
        return new IRequest('POST', 'accept-form/', {
            ...data
        }, false);
    },
}