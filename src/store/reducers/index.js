import { combineReducers } from 'redux';

// Project Reducers
import grid from './GridReducer';
import posts from './JobPostReducer';
import user from './UserReducer';

export default combineReducers({
    grid,
    posts,
    user,
});

