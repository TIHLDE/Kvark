import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// Material UI Components


// Project components
import Navigation from '../components/Navigation';
import EventHeader from '../components/EventHeader';
import GridContainer from '../components/GridContainer';
import EventList from '../components/EventList';
import GridItem from '../components/GridItem';
import Jodel from "../components/Jodel";

const styles = {
    grid: {
        height: 'auto',
        width: '100%',
        maxWidth: 1250,
        margin: 'auto',
        position: 'relative',
        top: -100,
        overflow: 'hidden',

        // Should be removed - just for demostration
       /*  backgroundColor: 'white',
        boxShadow: '3px 3px 8px 0px rgba(0,0,0,0.4)', */
    },
};

class Landing extends Component {
    render() {
        const {classes} = this.props;

        return (
            <Navigation>
                <EventHeader/>
                <div className={classes.grid}>
                    <GridContainer>
                        <GridItem width2>
                            <EventList />
                        </GridItem>
                        <EventList />
                        <EventList />
                        <EventList />
                        <EventList />
                        <div>
                            <Jodel/>
                        </div>
                    </GridContainer>
                </div>
            </Navigation>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(Landing);
