import {IRequest} from './httphandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', undefined);
    },

    // Events
    getEventItem: (id) => {
        return new IRequest('GET', 'events/'.concat(id, '/'), undefined);
    },
    getEventItems: (filters) => {
        return new IRequest('GET', 'events/', filters || {});
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
    putEventItem: (id, item) => {
        return new IRequest('PUT', 'events/'.concat(id, '/'), item, true);
    },
    deleteEventItem: (id) => {
        return new IRequest('DELETE', 'events/'.concat(id, '/'), undefined, true);
    },
    getEventParticipants: (id) => {
        return new IRequest('GET', 'events/'.concat(id,'/users/'), undefined, true);
    },
    putUserOnEventList: (id, item) => {
        return new IRequest('POST', 'events/'.concat(id,'/users/'), item, true);
    },
    deleteUserFromEventList: (id, item) => {
        return new IRequest('DELETE', 'events/'.concat(id,'/users/', item.user_id, '/'), undefined, true);
    },
    updateUserEvent: (id, item) => {
      return new IRequest('PUT', 'events/'.concat(id,'/users/', item.user_id), item, true);
    },
    getUserEventObject: (id, item) => {
      return new IRequest('GET', 'events/'.concat(id, '/users/', item.user_id, '/'), undefined, true);
    },

    // Job posts
    getJobPosts: (data) => {
        return new IRequest('GET', 'jobpost/', (data)? data : {newest: true});
    },
    getJobPost: (id) => {
        return new IRequest('GET', 'jobpost/'.concat(id, '/'), undefined);
    },
    getExpiredJobPosts: () => {
      return new IRequest('GET', 'jobpost/', {expired: true});
    },
    createJobPost: (item) => {
        return new IRequest('POST', 'jobpost/', item, true);
    },
    putJobPost: (id, item) => {
        return new IRequest('PUT', 'jobpost/'.concat(id, '/'), item , true);
    },
    deleteJobPost: (id) => {
        return new IRequest('DELETE', 'jobpost/'.concat(id, '/'), undefined, true);
    },

    // User
    getUserData: () => {
        return new IRequest('GET', 'user/', undefined, true);
    },
    updateUserData: (userName, item) => {
        return new IRequest('PUT', 'user/'.concat(userName, '/'), item, true);
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
