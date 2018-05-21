import React, { Component, Fragment } from 'react';

import Time from '../components/Time'
import Image from '../assets/img/image.jpg'
export default class extends Component {

    render() {
        return (
            <Fragment> 
                <h1>Hello Students!</h1>
                <Time /> 
                <img src={ Image } style={{ width: '100vw' }} />
            </Fragment>
        );
    }

}