import { applyMiddleware, createStore } from 'redux';

import reducer from './reducers';

import thunk from 'redux-thunk';


const middleware = applyMiddleware(thunk);

const store = createStore(reducer, middleware);

store.subscribe(() => {
  console.log('[Subscription]', store.getState());
});

export default store;


