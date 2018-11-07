export const actions = {
    SET_JOB_POSTS: 'JB_SET_JOB_POSTS',
}

export function setJobPosts(data) {
    return dispatch => {
        if (data instanceof Array) {
            dispatch({type: actions.SET_JOB_POSTS, payload: data.map(createJobPost)});
        }
    }
}

// --- SELECTORS ---
const getJobPostState = (state) => state.posts;

export const getJobPosts = (state) => getJobPostState(state).posts;


// --- Helper Methods ---
const createJobPost = (job) => ({
    ...job,
    id: job.id,
    title: job.title,
    ingress: job.ingress,
    body: job.body,
    location: job.location,
    deadline: job.deadline,
    company: job.company,
    email: job.email,
    link: job.link,
    logo: job.image,
    logoAlt: job.image_alt,
});
