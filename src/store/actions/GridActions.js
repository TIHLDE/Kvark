// All redux actions will be put in this file

export function setGridItems(data) {
    return dispatch => {
        if (data instanceof Array) {

            const newGridItems = data.map(createGridItem);

            dispatch({ type: "SET_GRID_ITEMS", payload: newGridItems });
        }
    }
}

export function selectItem(id) {
    return dispatch => {
        dispatch({ type: "SELECT_STORES_ITEM", payload: id});
    }
}

export function setSelectedItem(object) {
    return dispatch => {
        if (object instanceof Object) {
            dispatch({ type: "SET_SELECTED_ITEM", payload: object});
        }
    }
}

export function setSnackDispalyed(boolean) {
    return dispatch => {
        dispatch({type: 'SET_SNACK_DISPLAYED', payload: boolean});
    }
}

// --- SELECTORS ---
const getGridActionState = (state) => state.grid;

export const getHasSnackDisplayed = (state) => getGridActionState(state).snackHasDisplayed;


// --- Helper Methods ---
const createGridItem = (data) => {
    return {
        ...data,
        id: data.id,
        width: data.width ? data.width : 1,
        height: data.height ? data.height : 1,
        order: data.order,
        type: data.type ? data.type : 'news',
        data: data.data,
        fullWidth: isFullWidth(data),
        hideOnMobile: data.hide_on_mobile,
    };
};


// Checks if an item needs full grid-width
const isFullWidth = (data) => {
    return (data.type === 'poster');
};
