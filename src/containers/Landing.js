import React, {Component, Fragment} from 'react';

// Project components
import Carousel from '../components/Carousel/Carousel';
import Navbar from '../components/Navbar';

export default class Landing extends Component {
    render() {
        return (
            <Fragment>
                <Navbar/>
                <Carousel/>
            </Fragment>
        );
    }
}
