import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

const styles = {
    root: {
        padding: 40,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        maxWidth: 160,
        maxHeight: 160,
    },
    margin: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 30,
    },
};

const InfoCard = (props) => {
    const {classes} = props;

    return (
        <Paper className={classes.root}>
            <div className={classes.wrapper}>
                <div className={classes.margin}>
                    <img className={classes.image} src={props.src} alt={props.alt}/>
                </div>
                <Grid container direction='column' nowrap='nowrap'>
                    <Typography variant='title'>{props.header}</Typography>
                    <Typography variant='body2' component='p'>{props.text}</Typography>
                </Grid>
            </div>
        </Paper>
    );
};

InfoCard.propTypes = {
    classes: PropTypes.object,
    header: PropTypes.string,
    text: PropTypes.string,
    src: PropTypes.any,
    alt: PropTypes.string,
};

export default withStyles(styles)(InfoCard);
