import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
    root: {
        width: '100%',
        margin: 'auto',
        minHeight: '200px',

        // Should be removed - just a demostration
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        height: 500,
        overflow: 'hidden',
        margin: 0,
        position: 'relative',

        '@media only screen and (max-width: 600px)': {
            height: 'auto',
        }
    },
    
    image: {
        position:'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        zIndex: '-1',

        '@media only screen and (max-width: 800px)': {
            position: 'relative',
            height: '100%',
            top: 0,
            transform: 'translateY(0)',
        }
    },
    textContainer: {
        '@media only screen and (max-width: 800px)': {
            position: 'absolute',
            top: '25%',
        }
    },
    text: {
        color: 'white',
    },
    headerText: {
        '@media only screen and (max-width: 800px)': {
            fontSize: 45,
        }
    },
    subText: {
        '@media only screen and (max-width: 800px)': {
            fontSize: 25,
        }
    },
    none: {
        backgroundColor: 'whitesmoke',
    }
};

class Poster extends Component {

    render() {
        const {classes, data} = this.props;
        const textColor = (data.color)? data.color : 'white';

        return (
            <div className={classNames(classes.root,(!data.image)? classes.none : '')}>
                {(!data.image)? null :
                    <img className={classes.image} src={data.image} alt='image' />
                }
                <Grid className={classes.textContainer} container direction='column' wrap='nowrap'>
                    <Typography className={classNames(classes.text, classes.headerText)} variant='display4' align='center' style={{color: textColor}}>{data.header}</Typography>
                    <Typography className={classNames(classes.text, classes.subText)} variant='headline' align='center' style={{color: textColor}}>{data.subheader}</Typography>
                </Grid>
            </div>
        );
    }
}

Poster.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Poster);
