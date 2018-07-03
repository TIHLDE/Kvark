import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Project Components
import EventList from './EventList';
import NewsItem from './NewsItem';

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '65% 32%',
        gridGap: '30px',
        justifyContent: 'center',
        marginBottom: 30,

        '@media only screen and (max-width: 1000px)': {
            gridTemplateColumns: '47% 47%',
        },

        '@media only screen and (max-width: 700px)': {
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
                <NewsItem/>
                <EventList/>
                <NewsItem/>
            </div>
        );
    }
};

GridContainer.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(GridContainer);
