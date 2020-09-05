import { actions } from '../actions/EventActions';
import { keyBy } from 'lodash';

const initialState = {
  events: {},
};

export default function reducer(state = initialState, action) {
  const data = action.payload;
  if (!isPayloadValid(data)) {
    return state;
  }

  switch (action.type) {
    case actions.ADD_EVENTS: {
      return {
        ...state,
        events: {
          ...state.events,
          ...keyBy(action.payload, 'id'),
        },
      };
    }

    case actions.SET_EVENT_BY_ID: {
      return {
        ...state,
        events: {
          ...state.events,
          [action.id]: action.payload,
        },
      };
    }

    default:
      return state;
  }
}

// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
  return typeof payload !== undefined;
};
