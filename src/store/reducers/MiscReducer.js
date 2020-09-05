import { actions } from '../actions/MiscActions';

const initialState = {
  snackHasDisplayed: false, // A control bool for controlling of the snackbar has displayed or not
  logInRedirectURL: null,
};

export default function reducer(state = initialState, action) {
  const data = action.payload;
  if (!isPayloadValid(data)) {
    return state;
  }

  switch (action.type) {
    case actions.SET_LOGIN_REDIRECT_URL: {
      return { ...state, logInRedirectURL: data };
    }

    case actions.SET_SNACK_DISPLAYED: {
      return { ...state, snackHasDisplayed: data };
    }

    default:
      return state;
  }
}

// SELECTORS

const getGridState = (state) => state.grid;

export const getEventById = (state) => (id) => getGridState(state).grid.find((e) => e.type === 'event' && e.id === id);

// Helper functions

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
  return typeof payload !== undefined;
};
