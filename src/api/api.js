/* import {get} from './http';
import {TOKEN} from './webauth';
 */

import {IRequest} from './httphandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', undefined, false);
    },
    getNewsItem: (id) => {
        return new IRequest('GET', 'news/'.concat(id, '/'), undefined, false);
    },
    getEventItem: (id) => {
        return new IRequest('GET', 'events/'.concat(id, '/'), undefined, false);
    },
};
