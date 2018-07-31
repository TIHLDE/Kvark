import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';


const styles = {
    root: {
        gridColumn: 'span 1',
        gridRow: 'span 1',
    },
    width2: {
        gridColumn: 'span 2',

        '@media only screen and (max-width: 1000px)': {
            gridColumn: 'span 1 !important',
        },

        '@media only screen and (max-width: 800px)': {
            gridColumn: 'span 1 !important',
            margin: '0 !important',
        },
    },
    width3: {
        gridColumn: 'span 3',

        '@media only screen and (max-width: 1000px)': {
            gridColumn: 'span 2 !important',
        },

        '@media only screen and (max-width: 800px)': {
            gridColumn: 'span 1 !important',
            
        },
    },
    width4: {
        gridColumn: 'span 4',

        '@media only screen and (max-width: 1000px)': {
            gridColumn: 'span 2 !important',
        },

        '@media only screen and (max-width: 800px)': {
            gridColumn: 'span 1 !important',
            
        },
    },
    height2: {
        gridRow: 'span 2',

        '@media only screen and (max-width: 800px)': {
            gridRow: 'span 1 !important',
            
        },
    },
    height3: {
        gridRow: 'span 3',

        '@media only screen and (max-width: 800px)': {
            gridRow: 'span 1 !important',
            
        },
    },
    fullWidth: {
        height: 500,
        gridColumn: '1/5',

        '@media only screen and (max-width: 1000px)': {
            height: 400,
            gridColumn: 'span 2 !important',
        },

        '@media only screen and (max-width: 800px)': {
            gridColumn: 'span 1 !important',
            height: 400,
        },
    },
}

class GridItem extends Component {

    render() {
        const classes = [
            this.props.classes.root,
            this.props.colSpan === 2 ? this.props.classes.width2 : '',
            this.props.colSpan === 3 ? this.props.classes.width3 : '',
            this.props.colSpan === 4 ? this.props.classes.width4 : '',
            this.props.rowSpan === 2 ? this.props.classes.height2: '',
            this.props.rowSpan === 3 ? this.props.classes.height3 : '',
            this.props.fullWidth ? this.props.classes.fullWidth : '',
        ].join(' ');

        return (
            <div className={ classes } style={{zIndex: 10, order: this.props.order}}>
                { this.props.children }
            </div>
        );
    }
}

GridItem.defaultProps = {
    rowSpan: 1,
    colSpan: 1,
    order: 100,
};

GridItem.propTypes = {
    rowSpan: PropTypes.number,
    colSpan: PropTypes.number,
    order: PropTypes.number,

    children: PropTypes.node,
    classes: PropTypes.object,
    fullWidth: PropTypes.bool,
};

export default withStyles(styles)(GridItem);
