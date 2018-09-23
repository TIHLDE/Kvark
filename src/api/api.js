/* import {get} from './http';
import {TOKEN} from './webauth';
 */

import {IRequest} from './httphandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', undefined, false);
    },
    
    // News
    getNewsItem: (id) => {
        return new IRequest('GET', 'news/'.concat(id, '/'), undefined, false);
    },
    createNewsItem: (item) => {
        return new IRequest('POST', 'news/', item, true);
    },

    // Events
    getEventItem: (id) => {
        return new IRequest('GET', 'events/'.concat(id, '/'), undefined, false);
    },
    getEventItems: () => {
        return new IRequest('GET', 'events/', undefined, false);
    },
    getEventLists: () => {
        return new IRequest('GET', 'eventlist/', undefined, false);
    },
    createEventItem: (item) => {
        return new IRequest('POST', 'events/', item, false);
    },
    editEventItem: (id, item) => {
        return new IRequest('PUT', 'events/'.concat(id, '/'), item, false);
    },
    deleteEventItem: (id) => {
        return new IRequest('DELETE', 'events/'.concat(id, '/'), undefined, false);
    },

    // Warning
    getWarning: () => {
        return new IRequest('GET', 'warning/');
    },
};
