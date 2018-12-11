import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components

// Icons

// Project Components
import Navigation from '../../components/navigation/Navigation';
import EventAdministrator from './components/EventAdministrator';

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
