import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';


export default class GridItem extends Component {

    render() {
        const styles = {
        };
        return (
            <Paper style={ styles }>
                <Typography variant='headline' component='h3'>{ this.props.title }</Typography>
                <Typography component="p">{ this.props.text }</Typography>
            </Paper>
        );
    }
}

GridItem.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
};
