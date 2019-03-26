import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Service Imports
import MiscService from '../../api/services/MiscService';

// Project components
import Navigation from '../../components/navigation/Navigation';
import LayoutGrid from './components/LayoutGrid';

const styles = {
    root: {
        minHeight: '70vh',
    },
};

class Landing extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        // Get grid items
        if (this.props.grid.length === 0) {
            this.setState({ isLoading: true });
            MiscService.getGridData((isError, data) => {
                this.setState({ isLoading: false });
            });
        }
    }

    render() {
        const { classes, grid } = this.props;
        return (
            <Navigation footer isLoading={this.state.isLoading} whitesmoke>
                {(this.state.isLoading) ? null :
                    <div className={classes.root}>
                        <LayoutGrid grid={grid} />
                    </div>
                }
            </Navigation>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object,
    setGridItems: PropTypes.func,
    grid: PropTypes.array,
    dispatch: PropTypes.func,
};

const stateValues = (state) => ({
    grid: state.grid.grid,
});

export default connect(stateValues)(withStyles(styles)(Landing));
