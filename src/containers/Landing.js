import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

// API Imports
import API from '../api/api';

import {GeneralActions} from '../store/actions/MainActions'

// Project components
import Navigation from '../components/Navigation';
import LayoutGrid from '../components/Grid/LayoutGrid';
import Arrangements from './Arrangement'

const styles = {
};

class Landing extends Component {
    componentDidMount() {
        // Get grid items
        const response = API.getGridItems().response();
        response.then((data) => {
            this.props.setGridItems(data);
        });
    }

    render() {
        console.log()
        return (
            <Navigation footer>
                <LayoutGrid grid={this.props.grid} />
            </Navigation>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object,
};

const stateValues = (state) => {
    return {
        grid: state.general.grid
    }
}

const dispatchers = (dispatch) => {
    return {
        setGridItems: (data) => {
            dispatch({
                type: GeneralActions.SET_GRID_ITEMS,
                payload: data,
            })
        }
    }
}

export default connect(stateValues, dispatchers)(withStyles(styles)(Landing));
