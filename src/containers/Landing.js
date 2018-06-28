import React, {Component, Fragment} from 'react';

// Material UI Components


// Project components
import Navigation from '../components/Navigation';
import EventHeader from '../components/EventHeader';

export default class Landing extends Component {
    render() {
        return (
            <Fragment>
                <Navigation/>
                <main>
                    <EventHeader/>
                </main>
            </Fragment>
        );
    }
}
