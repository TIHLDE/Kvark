import React, { Component, Fragment } from 'react';

import Navigation from '../components/Navigation';
import CMS from '../components/CMS';
import Grid from '../components/Grid';

export default class GridShowcase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: this.getElements(),
        };
    }

    getElements() {
        return [
            {Title: 'Tihlde på tur!', Text: 'Dette går geili, sier noen', Height: 2, Width: -1},
            {Title: 'Enda en eksamen??', Text: 'Hvordan skal dette gå?', Width: 2},
        ];
    }

    render() {
        return (
            <Fragment>
                <Navigation />
                <CMS elements={ this.state.elements } />
                <Grid xl='4' elements={ this.state.elements }/>
            </Fragment>
        );
    }
}
