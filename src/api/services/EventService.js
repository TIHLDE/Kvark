/* eslint-disable prefer-promise-reject-errors */
import API from '../api';
import store from '../../store/store';
import * as EventActions from '../../store/actions/EventActions';

class EventService {

    // Fetches events
    static getEvents = async (filters = null, orderBy = null, callback = null) => {
      // Fetch events
      const response = API.getEventItems(filters).response();
      return response.then((data) => {
        data = data || {};
        let results = data.results || [];

        // If orderby is provided, sort the data
        if (orderBy && !response.isError) {
          for (const key in orderBy) {
            results = results.sort((a, b) => (a[key] === b[key]) ? 0 : a[key] ? 1 : -1);
          }
          if (data.results) {
            data.results = results;
          }
        }
        if (!response.isError) {
          EventActions.addEvents(data)(store.dispatch);
        }
        !callback || callback(response.isError === true, data);
        return !response.isError ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    // Get event by id
    static getEventById = async (id, callback = null) => {
      // Does event already exists?
      const event = EventActions.getEventById(id)(store.getState());
      if (event) {
        return Promise.resolve(event);
      } else {
        // Event does not exist, fetch from server
        const response = API.getEventItem(id).response();
        return response.then((data) => {
          !callback || callback(response.isError === true, data);
          if (!response.isError) {
            EventActions.setEventById(id, data)(store.dispatch); // Save in store
            return Promise.resolve(data);
          } else {
            return Promise.reject(null);
          }
        });
      }
    }

    static createNewEvent = async (eventData, callback = null) => {
      // Create new Event Item
      const response = API.createEventItem(eventData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return !response.isError ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    static putEvent = async (id, eventData, callback = null) => {
      const response = API.putEventItem(id, eventData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return !response.isError ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    // Deleting an event by given id
    static deleteEvent = async (id, callback = null) => {
      const response = API.deleteEventItem(id).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return !response.isError ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    static getEventLists = async (callback = null) => {
      // Get all eventlists
      const response = API.getEventLists().response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return data;
      });
    }

    static getCategories = async (callback = null) => {
      // Fetching categories
      const response = API.getCategories().response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject([]);
        }
      });
    }

    static getExpiredData = async (callback = null) => {
      const response = API.getExpiredEvents().response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject();
        }
      });
    }

    static putAttended = async (eventId, item, username, callback = null) => {
      const response = API.putAttended(eventId, item, username).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return !response.isError ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    static getEventParticipants = (id, callback = null) => {
      const response = API.getEventParticipants(id).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, response.status);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(data);
        }
      });
    }

    static putUserOnEventList = (id, userData, optionalFieldsAnswers, callback = null) => {
      userData = {user_id: userData.user_id, event: id, optional_fields_answers: optionalFieldsAnswers};
      const response = API.putUserOnEventList(id, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, response.status);
        if (!response.isError) {
          return Promise.resolve(response.status);
        } else {
          return Promise.reject(response.status);
        }
      });
    }

    static deleteUserFromEventList = (id, userData, callback = null) => {
      userData = {user_id: userData.user_id, event: id};
      const response = API.deleteUserFromEventList(id, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, response.status);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(data);
        }
      });
    }

    static updateUserEvent = (id, userData, callback = null) => {
      userData = {...userData, event: id};
      const response = API.updateUserEvent(id, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, response.status);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(data.detail);
        }
      });
    }

    static getUserEventObject = (id, userData, callback = null) => {
      userData = {...userData, event: id};
      const response = API.getUserEventObject(id, userData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, response.status);
        if (!response.isError) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(data.detail);
        }
      });
    }
}

export default EventService;
