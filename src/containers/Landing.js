import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Project components
import Navigation from '../components/Navigation';
import LayoutGrid from '../components/Grid/LayoutGrid';

const styles = {
    root: {
        minHeight: '70vh',
    },
};

class Landing extends Component {
    componentDidMount() {
        // Get grid items
        const response = API.getGridItems().response();
        response.then((data) => {
            if (!response.isError) {
                this.props.setGridItems(data);
            }
        });
    }

    render() {
        const {classes, grid} = this.props;

        return (
          <Navigation footer>
              <div className={classes.root}>
              <LayoutGrid grid={grid}/>
              </div>
          </Navigation>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object,
    setGridItems: PropTypes.func,
    grid: PropTypes.array,
};

const stateValues = (state) => {
    return {
        grid: state.general.grid,
    };
};

const dispatchers = (dispatch) => {
    return {
        setGridItems: (data) => dispatch({type: GeneralActions.SET_GRID_ITEMS, payload: data}),
    };
};


export default connect(stateValues, dispatchers)(withStyles(styles)(Landing));
