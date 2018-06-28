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
                <br/><br/>
                <div style={{margin: 'auto', maxWidth: '1200px'}}>
                    <h3>Nyheter</h3>
                    <hr/>
                </div>
            </Fragment>
        );
    }
}
