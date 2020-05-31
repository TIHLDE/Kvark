/* eslint-disable prefer-promise-reject-errors */
import API from '../api';

class NewsService {

    // Fetches news
    static getNews = async (filters = null, callback = null) => {
      const response = API.getNewsItems(filters).response();
      return response.then((data) => {
        data = data || {};
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    };

    // Get news by id
    static getNewsById = async (id, callback = null) => {
      const response = API.getNewsItem(id).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        if (response.isError === false) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(null);
        }
      });
    };

    // Create new news
    static createNewNews = async (newsData, callback = null) => {
      const response = API.createNewsItem(newsData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    };

    // Update news
    static putNews = async (id, newsData, callback = null) => {
      const response = API.putNewsItem(id, newsData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    };

    // Deleting a news by given id
    static deleteNews = async (id, callback = null) => {
      const response = API.deleteNewsItem(id).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    };
}

export default NewsService;
