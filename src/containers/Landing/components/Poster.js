import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

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
        position: 'relative', left: 0, right: 0,
        overflow: 'hidden',
    },
    static: {
        position: 'static',
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
            fontSize: 20,
        },
    },
    none: {
        backgroundColor: 'whitesmoke',
    },
    actionButton: {
        margin: '12px auto',
        maxWidth: 200,
        textDecoration: 'none',
    },
};

class Poster extends Component {

    goTo = (action) => {
        if (action && action.startsWith('http')) {
            window.location = action;
        } else {
            this.props.history.push(action);
        }
    }

    render() {
        const { classes } = this.props;
        const data = this.props.data || {};
        const textColor = (data.color) ? data.color : 'white';
        const image = (data.image) ? data.image : null;
        const height = (data.desktopHeight) ? data.desktopHeight : DEFAULT_HEIGHT;

        return (
            <div className={classNames(classes.root, this.props.className, (this.props.static) ? classes.static : '')}>
                {image &&
                    <img className={classNames(classes.image, (this.props.static) ? classes.static : '', this.props.imageClass)} src={image} alt='poster' height={height} />
                }

                <Grid className={classes.content} container direction='column' wrap='nowrap' alignItems='center' justify='center'>
                    <Typography className={classNames(classes.text, classes.headerText)} variant='h5' align='center' style={{ color: textColor }}>{data.header}</Typography>
                    <Typography className={classNames(classes.text, classes.subText)} variant='h5' align='center' style={{ color: textColor }}>{data.subheader}</Typography>
                    {(!data.action) ? null :
                        <Button className={classes.actionButton} onClick={() => this.goTo(data.action)} variant='raised' color='primary'>{data.action_text}</Button>
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

export default withStyles(styles)(withRouter(Poster));
