import API from '../api';
import store from '../../store/store';
import * as GridActions from '../../store/actions/GridActions';
import * as GridSelectors from '../../store/reducers/GridReducer';

class EventService {

    // Fetches events
    static getEvents = async (filters=null, orderBy=null, callback=null) => {

        // Fetch events
        const response = API.getEventItems(filters).response();
        return response.then((data) => {
            data = data || [];

            // If orderby is provided, sort the data
            if(orderBy) {
                for(const key in orderBy) {
                    data = data.sort((a, b) => (a[key] === b[key])? 0 : a[key] ? 1 : -1)
                }
            }
            !callback || callback(response.isError === true, data);
            return Promise.resolve(data);
        });
    }

    // Get event by id
    static getEventById = async (id, callback=null) => {
        // Does event already exists?
        const event = GridSelectors.getEventById(store.getState())(id);
        if(event) {
            return Promise.resolve(event);
        }
        // Event does not exist, fetch from server
        else {
            const response = API.getEventItem(id).response();
            return response.then((data) => {
                !callback || callback(response.isError === true, data);
                if (response.isError === false) {
                    GridActions.setSelectedItem(data)(store.dispatch);
                    return Promise.resolve(data);
                } else {
                    return Promise.resolve(null);
                }
            });
        }
    }

    static createNewEvent = async (eventData, callback=null) => {
        // Create new Event Item
        const response = API.createEventItem(eventData).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    static putEvent = async (id, eventData, callback=null) => {
        const response = API.putEventItem(id, eventData).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    // Deleting an event by given id
    static deleteEvent = async (id, callback=null) => {
        const response = API.deleteEventItem(id).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    static getEventLists = async (callback=null) => {
        // Get all eventlists
        const response = API.getEventLists().response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    static getCategories = async (callback=null) => {

        // Fetching categories
        const response = API.getCategories().response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            if(response.isError === false) {
                return Promise.resolve(data);
            } else {
                return Promise.resolve([]);
            }
        });
    }

    static getExpiredData = async (callback=null) => {
        const response = API.getExpiredEvents().response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default EventService;