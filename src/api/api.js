import {IRequest} from './httphandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', undefined);
    },
    
    // News
    getNewsItem: (id) => {
        return new IRequest('GET', 'news/'.concat(id, '/'), undefined);
    },
    createNewsItem: (item) => {
        return new IRequest('POST', 'news/', item, true);
    },

    // Events
    getEventItem: (id) => {
        return new IRequest('GET', 'events/'.concat(id, '/'), undefined);
    },
    getEventItems: (data) => {
        return new IRequest('GET', 'events/', (data)? data : {newest: true});
    },
    getExpiredEvents: () => {
        return new IRequest('GET', 'events/', {expired: true});
    },
    getEventLists: () => {
        return new IRequest('GET', 'eventlist/', undefined);
    },
    createEventItem: (item) => {
        return new IRequest('POST', 'events/', item, true);
    },
    editEventItem: (id, item) => {
        return new IRequest('PUT', 'events/'.concat(id, '/'), item, true);
    },
    deleteEventItem: (id) => {
        return new IRequest('DELETE', 'events/'.concat(id, '/'), undefined, true);
    },

    // Job posts
    getJobPosts: (data) => {
        return new IRequest('GET', 'jobpost/', (data)? data : {newest: true});
    },
    getJobPost: (id) => {
        return new IRequest('GET', 'jobpost/'.concat(id, '/'), undefined);
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
