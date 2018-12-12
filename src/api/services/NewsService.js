import API from '../api';
import store from '../../store/store';
import * as GridActions from '../../store/actions/GridActions';

class NewsService {

    // Fetches news item by id
    static getNewsById = async (id, callback=null) => {

        // TODO: Check if news item exists in store before fetching it

        // Fetch news item
        const response = API.getNewsItem(id).response();
        return response.then((data) => {
            // If successful, store news item in the store
            if (response.isError === false) {
                GridActions.setSelectedItem(data)(store.dispatch);
            }
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    // Create news item
    static createNewsItem = async (newsData, callback=null) => {
        const response = API.createNewsItem(newsData).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default NewsService;