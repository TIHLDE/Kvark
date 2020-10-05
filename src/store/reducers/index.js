import { combineReducers } from 'redux';

// Project Reducers
import posts from './JobPostReducer';
import events from './EventReducer';

export default combineReducers({
  posts,
  events,
});
