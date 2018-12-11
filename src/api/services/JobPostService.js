import API from '../api';
import store from '../../store/store';
import * as JobPostActions from '../../store/actions/JobPostActions';

class JobPostService {

    // Fetches job posts
    static getJobPosts = async (filters=null, orderBy=null) => {

        // Fetch job posts
        const response = API.getJobPosts(filters).response();
        return response.then((data) => {
            data = data || [];

            // If orderby is provided, sort the data
            if(orderBy) {
                for(const key in orderBy) {
                    data = data.sort((a, b) => (a[key] === b[key])? 0 : a[key] ? 1 : -1)
                }
            }
            JobPostActions.setJobPosts(data)(store.dispatch); // Send data to store
            return Promise.resolve(data);
        });
    }

    static getPostById = async (id) => {
        // Check store
        const post = JobPostActions.getJobPostById(id)(store.getState());
        if(post) {
            return Promise.resolve(post)
        } else {
            // Fetch
            return API.getJobPost(id).response()
                .then((data) => {
                    JobPostActions.setJobPostById(id, data)(store.dispatch);
                    return JobPostActions.getJobPostById(id)(store.getState());
                });
        }
    };
}

export default JobPostService;