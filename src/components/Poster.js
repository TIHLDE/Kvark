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


        height: 400,
        overflow: 'hidden',
        margin: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        // marginBottom: '-100px',
        zIndex: 0,

        '@media only screen and (max-width: 600px)': {
            position: 'static',
            height: 'auto',
            marginBottom: 0,
        },
    },
    imageContainer: {
        position: 'relative',
        top: 0, bottom: 0,
    },
    image: {
        position: 'absolute',
        top: 0,
        width: '100%',
      
        
    },
    textContainer: {
        zIndex: 2,
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,

        '@media only screen and(max-width: 600px)': {
            position: 'relative',
            top: 0, bottom: 200,
        },
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
            <div className={classNames(classes.root, (!data.image)? classes.none : '')}>
                {(!data.image)? null :
                    <div className={classes.imageContainer}>
                        <img className={classes.image} src={data.image} alt={data.altImage} />
                    </div>
                }
                <Grid className={classes.textContainer} container direction='column' wrap='nowrap' alignItems='center' justify='center'>
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
