import {actions} from '../actions/UserActions';

const initialState = {
  username: null,
  email: null,
  userData: {},
};

export default function reducer(state = initialState, action) {
  const data = action.payload;
  if (!isPayloadValid(data)) {
    return state;
  }

  switch (action.type) {
    case actions.CLEAR_USER_DATA: {
      return {...state, username: null, email: null, userData: {}};
    }

    case actions.SET_USER_DATA: {
      return {...state, userData: data};
    }

    default:
      return state;
  }
}

// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
  return (typeof(payload) !== undefined);
};
