import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";

const styles = {
    root: {
        width: 'auto',
        height: 'auto',
        fontFamily:'arial',
    },
    wrapper:{
        position:'relative',
        height: '200px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '@media only screen and (max-width: 600px)': {
            height:'200px'
        },
    },
    textInPic:{
        position:'absolute',
        bottom:30,
        left:30
    },
    under:{
        height:'auto',
        margin:"30px 30px 30px 30px",
    }
};

class Head extends Component {
    render() {
        const { classes, data } = this.props;
        let image = data.image;

        return (
            <Paper className={classNames(classes.root, this.props.className)}>
                <div className={classes.wrapper} style={{backgroundImage:`url(${image})`}}>
                    <div className={classes.textInPic}>
                        <Typography variant='display1'>
                            {data.header}
                        </Typography>
                    </div>
                </div>
                <div className={classes.under}>
                    <Typography variant='subheading'>
                        {data.paragraph}
                    </Typography>
                </div>
            </Paper>
        );
    }
}

Head.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(Head);
