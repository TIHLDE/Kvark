import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridAutoRows: '300px',
        gridGap: '10px',
        justifyContent: 'center',
        marginBottom: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '1200px',

        '@media only screen and (max-width: 1200px)': {
            gridTemplateColumns: '1fr 1fr',
            width: '90%',
            gridColumn: '-1 !important',
        },

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '1fr !important',
            width: 'auto',
        },
    },
};


class Grid extends Component {

    render() {
        return (
            <div className={ this.props.classes.root }>
                { this.props.children }
            </div>
        );
    }
}

Grid.propTypes = {
    width2: PropTypes.bool,
    width3: PropTypes.bool,
    height2: PropTypes.bool,
};

export default withStyles(styles)(Grid);
