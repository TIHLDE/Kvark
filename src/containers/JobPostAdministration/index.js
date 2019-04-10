import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Navigation from '../../components/navigation/Navigation';
import JobPostAdministrator from './components/JobPostAdministrator';

const styles = {

};

class DataRegistrator extends Component {

    render() {
        return (
            <Navigation>
                <JobPostAdministrator />
            </Navigation>
        );
    }
}

DataRegistrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(DataRegistrator);
