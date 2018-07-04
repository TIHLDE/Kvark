import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';


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
            this.props.width2 ? this.props.classes.width2 : '',
            this.props.width3 ? this.props.classes.width3 : '',
            this.props.height2 ? this.props.classes.height2: '',
        ].join(' ');
            

        return (
            <Paper className={ classes } elevation0>
                { this.props.children }
            </Paper>
        );
    }
}

export default withStyles(styles)(GridItem);