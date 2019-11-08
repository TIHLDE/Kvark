import store from '../store';

export const actions = {
    CLEAR_USER_DATA: 'UR_CLEAR_USER_DATA',
    SET_USER_DATA: 'SET_USER_DATA',
}

export const clearData = () =>
    dispatch => dispatch({type: actions.CLEAR_USER_DATA});

export const setUserData = (data) =>
    dispatch => dispatch({type: actions.SET_USER_DATA, payload: createUser(data[0])});

export const updateUserEvents = (data) =>
    dispatch => {
        store.getState().user.userData.events = data[0].events;
        dispatch({type: actions.SET_USER_DATA, payload: createUser((store.getState().user.userData))});
    }



// --- SELECTORS ---
const getUserState = (state) => state.user;

export const getUserData = (state) => ({...getUserState(state)});

// --- Helper Methods ---
const createUser = (user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    cell: user.cell,
    em_nr: user.em_nr,
    gender: user.gender,
    user_class: user.user_class,
    user_study: user.user_study,
    groups: user.groups,
    allergy: user.allergy,
    tool: user.tool,
    events: user.events,
});
