const initialState = {
    grid: [],
    selectedItem: null, // Item that will be used on detailpages
};

export default function reducer(state = initialState, action) {
    const data = action.payload;
    if(!isPayloadValid(data)) {
        return state;
    }

    switch (action.type) {

        case "SET_GRID_ITEMS": {
            return {...state, grid: data}
        }

        case "SELECT_STORED_ITEM": {
            return {...state, selectedItem: state.grid.find(state.grid.findIndex(elem => elem.id === data))}
        }

        case "SET_SELECTED_ITEM": {
            return {...state, selectedItem: data}
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
