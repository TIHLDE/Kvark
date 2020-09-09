import { actions } from '../actions/JobPostActions';
import { keyBy } from 'lodash';

const initialState = {
  posts: {},
};

export default function reducer(state, action) {
  const data = action.payload;
  if (!isPayloadValid(data)) {
    return initialState;
  }

  switch (action.type) {
    case actions.ADD_JOB_POSTS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          ...keyBy(action.payload, 'id'),
        },
      };
    }

    case actions.SET_JOB_POST_BY_ID: {
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.id]: action.payload,
        },
      };
    }

    default:
      return initialState;
  }
}

// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
  return typeof payload !== undefined;
};
