import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = {
    root: {
        backgroundColor: 'whitesmoke',
        width: '100%',
        minHeight: '200px',

        // Should be removed - just a demostration
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        height: 500,
        overflow: 'hidden',
        margin: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        marginBottom: '-100px',
        zIndex: 0,

        '@media only screen and (max-width: 600px)': {
            height: 300,
        },
    },
    image: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        zIndex: '0',

        '@media only screen and (max-width: 800px)': {
            position: 'relative',
            height: '100%',
            top: 0,
            transform: 'translateY(0)',
        },
    },
    textContainer: {
        zIndex: 2,

    },
    text: {
        color: 'white',
    },
    headerText: {
        '@media only screen and (max-width: 1000px)': {
            fontSize: 55,
        },
        '@media only screen and (max-width: 800px)': {
            fontSize: 45,
        },
    },
    subText: {
        '@media only screen and (max-width: 1000px)': {
            fontSize: 30,
        },
        '@media only screen and (max-width: 800px)': {
            fontSize: 25,
        },
    },
    none: {
        backgroundColor: 'whitesmoke',
    },
    actionButton: {
        margin: '0 auto',
        maxWidth: 200,
        textDecoration: 'none',
    },
};

class Poster extends Component {

    render() {
        const {classes, data} = this.props;
        const textColor = (data.color)? data.color : 'white';

        return (
            <div className={classNames(classes.root,(!data.image)? classes.none : '')}>
                {(!data.image)? null :
                    <img className={classes.image} src={data.image} alt='poster' />
                }
                <Grid className={classes.textContainer} container direction='column' wrap='nowrap'>
                    <Typography className={classNames(classes.text, classes.headerText)} variant='display4' align='center' style={{color: textColor}}>{data.header}</Typography>
                    <Typography className={classNames(classes.text, classes.subText)} variant='headline' align='center' style={{color: textColor}}>{data.subheader}</Typography>
                    {(!data.action)? null :
                        <Link to={data.action} className={classes.actionButton}>
                            <Button variant='raised' color='primary'>{data.actionText}</Button>
                        </Link>
                    }
                </Grid>
            </div>
        );
    }
}

Poster.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.object,
};

export default withStyles(styles)(Poster);
