import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import GridItem from '../components/GridItem';


const styles = {
    root: {
        'color': 'red',
        '@media screen (max-width < 600)': {

        },
    },
};


class Grid extends Component {

    mapToJSS(elements) {
        if (elements == null) return null;
        else return elements.map((element) => <GridItem key title={ element.title } text={ element.text } />);
    }


    render() {
        const elements = this.mapToJSS(this.props.elements) || <Paper><Typography variant='headline' component='h3'>No elements</Typography></Paper>;

        return (
            <div className={ this.props.classes.root }>
                { elements }
            </div>
        );
    }
}

Grid.propTypes = {
    elements: PropTypes.array,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Grid);
