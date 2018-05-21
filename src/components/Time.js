import React, { Component } from 'react';


export default class extends Component {

    render() {
        return (
            <h1>Dette er tiden: { Date.now() }</h1>
        );
    }

}