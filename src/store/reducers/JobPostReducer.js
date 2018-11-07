import {actions} from '../actions/JobPostActions';

const initialState = {
    posts: [],
};

export default function reducer(state = initialState, action) {
    const data = action.payload;
    if(!isPayloadValid(data)) {
        return state;
    }

    switch (action.type) {

        case actions.SET_JOB_POSTS: {
            return {...state, posts: action.payload};
        }

        default:
            return state;
    }
};


// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
    return (typeof(payload) !== undefined);
};
