import {actions} from '../actions/JobPostActions';
import {keyBy} from 'lodash';

const initialState = {
    posts: {
    },
};

export default function reducer(state, action) {
    const data = action.payload;
    if(!isPayloadValid(data)) {
        return initialState;
    }

    switch (action.type) {

        case actions.SET_JOB_POSTS: {
            const jobPosts = keyBy(action.payload, 'id')

            // Actions to do if we want to append stuff
            if (action.filters && action.filters.page && action.filters.page !== 1) {
              // Add each existing post to the new posts
              for (let index in state.posts){
                jobPosts[index] = state.posts[index]
              }
            }

            return {...state, posts: jobPosts};
        }

        case actions.SET_JOB_POST_BY_ID: {
            return {...state, posts: {
                ...state.posts,
                [action.id]: action.payload,
            }}
        }

        default:
            return initialState;
    }
};


// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
    return (typeof(payload) !== undefined);
};
