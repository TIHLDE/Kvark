import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import ExamplePoster from '../assets/img/ExamplePoster.png';

// Material UI Components
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        width: '100%',
        maxHeight: '600px',
    },
    image: {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'cover',
    },
};

class Poster extends Component {

    render() {
        const {classes, data} = this.props;

        const image = (data && data.image)? data.image : ExamplePoster;

        return (
            <div className={classes.root}>
               <img className={classes.image} src={image} alt='poster'/>
            </div>
        );
    }
}

Poster.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Poster);