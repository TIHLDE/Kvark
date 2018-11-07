import { combineReducers } from 'redux';

// Project Reducers
import grid from './GridReducer';
import posts from './JobPostReducer';


export default combineReducers({
    grid,
    posts,
});

