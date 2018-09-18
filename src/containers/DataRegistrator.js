import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components

// Icons

// Project Components
import Navigation from '../components/Navigation';
// import NewsAdministrator from '../components/NewsComponents/NewsAdministrator';
import EventAdministrator from '../components/EventComponents/EventAdministrator';

const styles = {
    
};

class DataRegistrator extends Component {

    render() {
        return (
            <Navigation>
                <EventAdministrator />
            </Navigation>
        );
    }
}

DataRegistrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(DataRegistrator);
