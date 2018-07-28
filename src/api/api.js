import {IRequest} from './HttpHandler';

export default {
    // Returns a set of items/widgets to display in the LandingPage grid
    getGridItems: () => {
        return new IRequest('GET', 'items/', undefined, false);
    }
}
