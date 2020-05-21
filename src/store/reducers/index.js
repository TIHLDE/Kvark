import {combineReducers} from 'redux';

// Project Reducers
import misc from './MiscReducer';
import posts from './JobPostReducer';
import events from './EventReducer';
import user from './UserReducer';

export default combineReducers({
  misc,
  posts,
  events,
  user,
});

