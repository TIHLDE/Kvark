import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Icons


const styles = {
    root: {
        height: 300,
        maxWidth: 250,
        padding: 16,

        '@media only screen and (max-width: 600px)': {

        },
    },
    wrapper:{
        display:'flex',
        flexDirection:'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    image:{
        maxHeight: 160,
        objectFit: 'contain',
        paddingBottom: 30
    }
};


const Icons = (props) => {
    const {classes, data} = props;
    const text = (data.title)? data.title : "mangler tittel";
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <img src={data.image} alt={data.alt} className={classes.image}/>
                <Typography variant={'headline'}>{text}</Typography>
            </div>
        </div>
    );
};

Icons.propTypes = {
    classes: PropTypes.object,

    data: PropTypes.object,
    onClick: PropTypes.func,
};

export default withStyles(styles)(Icons);
