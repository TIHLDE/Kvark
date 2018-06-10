import React, { Component, Fragment } from 'react';

import Redir from '../components/Redir';


export default class extends Component {

    render() {
        return (
            <Fragment>
                <h1>Siden ble ikke funnet</h1>
                <Redir />
            </Fragment>
        )
    }
}
