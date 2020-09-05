// All redux actions will be put in this file
export const actions = {
  SET_SNACK_DISPLAYED: 'MISC_SET_SNACK_DISPLAYED',
  SET_LOGIN_REDIRECT_URL: 'MISC_SET_LOGIN_REDIRECT_URL',
};

export function setSnackDispalyed(boolean) {
  return (dispatch) => {
    dispatch({ type: actions.SET_SNACK_DISPLAYED, payload: boolean });
  };
}

export const setLogInRedirectURL = (redirectURL) => {
  return (dispatch) => {
    dispatch({ type: actions.SET_LOGIN_REDIRECT_URL, payload: redirectURL });
  };
};

// --- SELECTORS ---
const getMiscState = (state) => state.misc;

export const getHasSnackDisplayed = (state) => getMiscState(state).snackHasDisplayed;

export const getLogInRedirectURL = (state) => getMiscState(state).logInRedirectURL;
