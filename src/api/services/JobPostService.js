import API from '../api';
import store from '../../store/store';
import * as JobPostActions from '../../store/actions/JobPostActions';

class JobPostService {

    // Fetches job posts
    static getJobPosts = async (filters = null, orderBy = null) => {
      // Fetch job posts
      const response = API.getJobPosts(filters).response();
      return response.then((data) => {
        data = data || {};
        let results = data.results || data;

        // If orderby is provided, sort the data
        if (orderBy) {
          for (const key in orderBy) {
            results = results.sort((a, b) => (a[key] === b[key]) ? 0 : a[key] ? 1 : -1);
          }
          if (data.results) {
            data.results = results;
          }
        }
        JobPostActions.addJobPosts(results)(store.dispatch); // Send data to store
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    static getPostById = async (id) => {
      // Check store
      const post = JobPostActions.getJobPostById(id)(store.getState());
      if (post) {
        return Promise.resolve(post);
      } else {
        // Fetch
        return API.getJobPost(id).response()
            .then((data) => {
              JobPostActions.setJobPostById(id, data)(store.dispatch);
              return JobPostActions.getJobPostById(id)(store.getState());
            });
      }
    };

    static createJobPost = async (postData, callback = null) => {
      // Create new JobPost Item
      const response = API.createJobPost(postData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    // Edit job post
    static putJobPost = async (id, postData, callback = null) => {
      const response = API.putJobPost(id, postData).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    // Deleting a jobpost by given id
    static deleteJobPost = async (id, callback = null) => {
      const response = API.deleteJobPost(id).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    }

    static getExpiredData = async (callback = null) => {
      const response = API.getExpiredJobPosts().response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return response.isError === false ? Promise.resolve(data) : Promise.reject(data);
      });
    }
}

export default JobPostService;
