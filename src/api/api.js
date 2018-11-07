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
    getEventItems: (data) => {
        return new IRequest('GET', 'events/', (data)? data : {newest: true}, false);
    },
    getExpiredEvents: () => {
        return new IRequest('GET', 'events/', {expired: true}, false);
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

    // Job posts
    getJobPosts: (data) => {
        return new IRequest('GET', 'jobpost/', (data)? data : {newest: true}, false);
    },
    getJobPost: (id) => {
        return new IRequest('GET', 'jobpost/'.concat(id, '/'), undefined, false);
    },

    // Warning
    getWarning: () => {
        return new IRequest('GET', 'warning/');
    },
    getCategories: () => {
        return new IRequest('GET', 'category/');
    },

    // Company form
    emailForm: (data) => {
        return new IRequest('POST', 'accept-form/', {
            ...data
        }, false);
    },
};
