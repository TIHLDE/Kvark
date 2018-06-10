import React, { Component, Fragment } from 'react';

import Time from '../components/Time'
import Image from '../assets/img/image.jpg'

import Redir from '../components/Redir';

export default class extends Component {

    render() {
        return (
            <Fragment>
                <Redir />
                <h1>Hello Students!</h1>
                <Time />
                <img src={ Image } style={{ width: '100vw' }} />
            </Fragment>
        );
    }

}
