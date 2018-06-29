import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Project Components
import EventList from './EventList';

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '65% 32%',
        gridGap: '30px',
        justifyContent: 'center',
        marginBottom: 30,

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '100%',
        },
    },
};

class GridContainer extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <EventList/>
                <EventList/>
                <EventList/>
                <EventList/>
            </div>
        );
    }
};

GridContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(GridContainer);
