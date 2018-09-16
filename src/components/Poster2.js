import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const DEFAULT_HEIGHT = 300;
const DEFAULT_MOBILE_HEIGHT = 240;
const OFFSET = 40;

const styles = {
    root: {
        height: DEFAULT_HEIGHT,
        position: 'absolute', left: 0, right: 0,
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        top: 0,
        width: '100%',
        objectFit: 'cover',
        height: DEFAULT_HEIGHT + OFFSET,

        '@media only screen and (max-width: 600px)': {
            height: DEFAULT_MOBILE_HEIGHT + OFFSET,
        },
    },
    content: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
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
        const image = (data.image)? data.image : null;
        const height = (data.desktopHeight)? data.desktopHeight : DEFAULT_HEIGHT;

        return (
            <div className={classes.root}>
                <img className={classes.image} src={image} alt='poster' height={height}/>

                <Grid className={classes.content} container direction='column' wrap='nowrap' alignItems='center' justify='center'>
                    <Typography className={classNames(classes.text, classes.headerText)} variant='display4' align='center' style={{color: textColor}}>{data.header}</Typography>
                    <Typography className={classNames(classes.text, classes.subText)} variant='headline' align='center' style={{color: textColor}}>{data.subheader}</Typography>
                    {(!data.action)? null :
                        <Link to={data.action} className={classes.actionButton}>
                            <Button variant='raised' color='primary'>{data.action_text}</Button>
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
