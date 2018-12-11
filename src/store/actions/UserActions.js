export const actions = {
    CLEAR_USER_DATA: 'UR_CLEAR_USER_DATA',
}

export const clearData = () =>
    dispatch =>
        dispatch({type: actions.CLEAR_USER_DATA});

// --- SELECTORS ---
const getUserState = (state) => state.user;

export const getUserData = (state) => ({...getUserState(state)});
