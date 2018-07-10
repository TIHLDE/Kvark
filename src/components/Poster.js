import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        width: '100%',
        margin: 'auto',

        // Should be removed - just a demostration
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        height: 500,
        overflow: 'hidden',
        margin: 0,
        position: 'relative',

        '@media only screen and (max-width: 600px)': {
            height: '100%',
        }
    },
    
    background: {
        position:'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        zIndex: '-1',
    },
    text: {
        color: 'white',
    },
    none: {
        backgroundColor: 'whitesmoke',
    }
};

class Poster extends Component {

    render() {
        const {classes, data} = this.props;

        return (
            <div className={classNames(classes.root,(!data.image)? classes.none : '')}>
                {(!data.image)? null :
                    <img className={classes.background} src={data.image} alt='image' />
                }
                <Typography className={classes.text} variant='display4' align='center'>{data.header}</Typography>
                <Typography className={classes.text} variant='headline' align='center'>{data.subheader}</Typography>
            </div>
        );
    }
}

Poster.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Poster);
