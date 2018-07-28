import {createStore} from 'redux';
import rootReducer from './reducers/RootReducer';

const store = createStore(rootReducer);

store.subscribe(() => {
  console.log('[Subscription]', store.getState());
});

export default store;


