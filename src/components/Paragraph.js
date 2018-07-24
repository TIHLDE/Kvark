import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Paper} from '@material-ui/core/';

const styles ={
    root:{
        minHeight:420,
        height:'auto',
        width: 'auto',
        position:'relative',
        '@media only screen and (max-width: 600px)': {
            width: '100%',
        }
    },
    button:{
        position:'absolute',
        bottom:20,
        right:20
    }

};

class Paragraph extends Component {
    // The metod will return either 1. join! in green. this means that the user can join the event. Que number which shows the user what place in the que he or she is. and lastly joined which means that the user has joined the event and can attend.

    render() {
        const {join, data, classes} = this.props;

        return(
        <Paper className={classes.root}>
            <Grid container direction='column' justify='space-around' alignItems='stretch' >
                <Grid item>
                    <Typography>
                        {data.subheader}
                    </Typography>
                    <br/>
                    <Typography>
                        {data.text}
                    </Typography>
                </Grid>
                <Grid item >
                    <div className={classes.button}>
                        {join}
                    </div>
                </Grid>
            </Grid>
        </Paper>
    )}
}

Text.propTypes={
    data: PropTypes.any
};

Paragraph.defaultProps={
    text: 'No paragraph',
    joined: true,
    subheader: 'no subheader',
    waiting: -1,
};


export default withStyles(styles)(Paragraph);
