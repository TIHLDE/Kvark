import {GeneralActions} from '../actions/MainActions';

const initialState = {
    grid: [],
    selectedItem: null, // Item that will be used on detailpages
};

const reducer = (state = initialState, action) => {
    const data = action.payload;
    if(!isPayloadValid(data)) {
        return state;
    }

    switch (action.type) {
        case GeneralActions.SET_GRID_ITEMS:
            
            // Check if data is an array
            if(!(data instanceof Array)) {
                return state;
            }

            // Create new grid items
            const newGridItems = [];
            data.map((value) => {
                return newGridItems.push(createGridItem(value));
            });

            return {
                ...state,
                grid: newGridItems,
            }
        
        case GeneralActions.SELECT_STORED_ITEM:
            // Check if index by id exists
            const gridItems = Object.assign([], state.grid);
            const itemIndex = gridItems.findIndex((elem) => elem.id == data);
            let selectedItem = null;

            // If it exists, make it to the selected item
            if(itemIndex !== -1) {
                selectedItem = gridItems[itemIndex];
            }

            return {
                ...state,
                selectedItem: selectedItem,
            }

        case GeneralActions.SET_SELECTED_ITEM:
            // Check if item is an object
            if(!(data instanceof Object)) {
                return state;
            }

            // Set selected item
            return {
                ...state,
                selectedItem: data,
            }

        default:
            return state;
    }
};

export default reducer;

// --- Helper Methods ---
const createGridItem = (data) => {
    const item = {
        ...data,
        id: data.id,
        width: data.width ? data.width : 1,
        height: data.height ? data.height : 1,
        order: data.order,
        type: data.type ? data.type : 'news',
        data: data.data,
        fullWidth: isFullWidth(data),
    }
    return item;
}

// Checks if action.payload data is not null or undefined
const isPayloadValid = (payload) => {
    return (typeof(payload) !== undefined);
};

// Checks if an item needs full grid-width
const isFullWidth = (data) => {
    return (data.type === 'poster');
};
