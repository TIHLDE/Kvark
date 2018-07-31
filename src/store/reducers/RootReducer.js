import {combineReducers} from 'redux';

// Project Reducers
import GeneralReducer from './GeneralReducer';

const rootReducer = combineReducers({
    general: GeneralReducer,
});

export default rootReducer;
