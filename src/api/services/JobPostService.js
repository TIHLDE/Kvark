import API from '../api';
import store from '../../store/store';
import * as JobPostActions from '../../store/actions/JobPostActions';

class JobPostService {


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