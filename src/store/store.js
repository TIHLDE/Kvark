import {applyMiddleware, createStore} from 'redux';

import reducer from './reducers';

import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk);

const store = createStore(reducer, middleware);

if (process.env.NODE_ENV !== 'production') {
  store.subscribe(() => {
    // eslint-disable-next-line no-console
    console.log('[Subscription]', store.getState());
  });
}

export default store;

