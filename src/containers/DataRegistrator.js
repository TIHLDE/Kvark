import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components

// Icons

// Project Components
import Navigation from '../components/Navigation';
import NewsRegistrator from '../components/NewsComponents/NewsRegistrator';

const styles = {

};

class DataRegistrator extends Component {

    render() {
        return (
            <Navigation>
                <NewsRegistrator />
            </Navigation>
        );
    }
}

DataRegistrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(DataRegistrator);
