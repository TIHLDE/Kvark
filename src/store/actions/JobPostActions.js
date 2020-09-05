export const actions = {
  ADD_JOB_POSTS: 'JB_ADD_JOB_POSTS',
  SET_JOB_POST_BY_ID: 'JB_SET_JOB_POST_BY_ID',
};

// This is where the data from backend get sent to!
export const addJobPosts = (data, filters) => (dispatch) => {
  if (data.results instanceof Array) {
    dispatch({
      type: actions.ADD_JOB_POSTS,
      filters: filters,
      payload: data.results.map(createJobPost),
    });
  } else if (data instanceof Array) {
    // Used for backward compabillity
    dispatch({ type: actions.ADD_JOB_POSTS, filters: filters, payload: data.map(createJobPost) });
  }
};

export const setJobPostById = (id, data) => (dispatch) => dispatch({ type: actions.SET_JOB_POST_BY_ID, payload: createJobPost(data), id: id });

// --- SELECTORS ---
const getJobPostState = (state) => state.posts;

export const getJobPosts = (state) => Object.values(getJobPostState(state).posts);

export const getJobPostById = (id) => (state) => getJobPostState(state).posts[id];

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
  expired: job.expired,
});
