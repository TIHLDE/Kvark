import API from '../api';
import store from '../../store/store';
import * as GridActions from '../../store/actions/GridActions';
import * as GridSelectors from '../../store/reducers/GridReducer';

class EventService {

    // Fetches events
    static getEvents = async (filters=null, orderBy=null) => {

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
            return Promise.resolve(data);
        });
    }

    // Get event by id
    static getEventById = async (id) => {
        // Does event already exists?
        const event = GridSelectors.getEventById(store.getState())(id);
        console.log(event);
        if(event) {
            return Promise.resolve(event);
        }
        // Event does not exist, fetch from server
        else {
            const response = API.getEventItem(id).response();
            return response.then((data) => {
                if (response.isError === false) {
                    GridActions.setSelectedItem(data)(store.dispatch);
                    return Promise.resolve(data);
                } else {
                    return Promise.resolve(null);
                }
            });
        }
    }

    static getCategories = async () => {

        // Fetching categories
        const response = API.getCategories().response();
        return response.then((data) => {
            if(response.isError === false) {
                return Promise.resolve(data);
            } else {
                return Promise.resolve([]);
            }
        });
    }
}

export default EventService;