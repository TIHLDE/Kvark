import React, { Component, Fragment } from 'react';

import Navigation from '../components/Navigation';
import GridContainer from '../components/Grid/GridContainer';
import EventList from '../components/EventList';
import GridItem from '../components/Grid/GridItem';

export default class GridShowcase extends Component {

    render() {
        return (
            <Fragment>
                <Navigation />
                <GridContainer>
                    <GridItem width3>
                        <EventList/>
                    </GridItem>
                    <GridItem height2 width2>
                        <EventList />
                    </GridItem>
                    <GridItem height2>
                        <EventList />
                    </GridItem>
                    <EventList />
                    <EventList />
                    <EventList />
                    <EventList />
                    <EventList />
                    <EventList />
                    <EventList />
                </GridContainer>
            </Fragment>
        );
    }
}
