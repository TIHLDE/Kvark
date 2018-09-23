import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material UI Components
import Paper from '@material-ui/core/Paper';

const styles = {
    root: {
        width: 'auto',
        height: 'auto',
        fontFamily:'arial',
    },
    wrapper:{
        height: '400px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
};

class Head extends Component {
    render() {
        const { classes, data } = this.props;
        let image = data.image;

        return (
            <Paper className={classNames(classes.root, this.props.className)}>
                <div className={classes.wrapper} style={{backgroundImage:`url(${image})`}}/>
            </Paper>
        );
    }
}

Head.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(Head);
