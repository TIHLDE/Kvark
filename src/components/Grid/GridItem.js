import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';


const styles = {
    root: {
        backgroundColor: 'beige',
        margin: '-20px',
    },
    width2: {
        gridColumn: 'span 2',

        '@media only screen and (max-width: 1200px)': {
            gridColumn: 'span 2 !important',
        },

        '@media only screen and (max-width: 600px)': {
            gridColumn: 'span 1 !important',
            margin: '0 !important',
        },
    },
    width3: {
        gridColumn: 'span 3',

        '@media only screen and (max-width: 1200px)': {
            gridColumn: 'span 2 !important',
        },

        '@media only screen and (max-width: 600px)': {
            gridColumn: 'span 1 !important',
            margin: '0 !important',
        },
    },
    height2: {
        gridRow: 'span 2',
    },
}

class GridItem extends Component {

    render() {
        const classes = [
            this.props.colSpan === 2 ? this.props.classes.width2 : '',
            this.props.colSpan === 3 ? this.props.classes.width3 : '',
            this.props.rowSpan === 2 ? this.props.classes.height2: '',
        ].join(' ');

        return (
            <div className={ classes }>
                { this.props.children }
            </div>
        );
    }
}

GridItem.defaultProps = {
    rowSpan: 1,
    colSpan: 1,
}

export default withStyles(styles)(GridItem);