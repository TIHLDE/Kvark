import {get} from './http';
import {TOKEN} from './webauth';


export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return get('items/', {token: TOKEN.get()});
    },
};
