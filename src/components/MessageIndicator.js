import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

const styles = {
    root: {
        padding: '15px 5px',
        height: '100%',

    },
};


const MessageIndicator = (props) => {
    const {classes} = props;
    return (
        <Grid className={classes.root} container direction='column' wrap='nowrap' justify='center'>
            <Typography variant='title' align='center' gutterBottom>{props.header}</Typography>
            <Typography variant='subheading' align='center'>{props.subheader}</Typography>
        </Grid>
    );
};

MessageIndicator.propTypes = {
    classes: PropTypes.object,

    header: PropTypes.string,
    subheader: PropTypes.string,
};

export default withStyles(styles)(MessageIndicator);
