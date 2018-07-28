import {get} from './http';
import {TOKEN} from './webauth';


export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
<<<<<<< HEAD
        return new IRequest('GET', 'items/', false);
    },
    getNewsItem: (id) => {
        return new IRequest('GET', 'news/'.concat(id, '/'), false);
=======
        return get('items/', {token: TOKEN.get()});
>>>>>>> 4363185ec6aac44376e32dff560ab4b80d3d71f4
    },
};
