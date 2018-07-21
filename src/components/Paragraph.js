import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Button, Paper} from '@material-ui/core/';

{/* If you want to implement grid then go ahead!
La oss gøre denne om til en SLC,
Kan gjøre hvis man hoverer over så vil knappen bli rød og man kan forlate.

*/}

const styles ={
    root:{
      height:650,
      width: 450,
      position:'relative',
    },
    wrapper:{
        paddingLeft:10,
        paddingBottom:10,
        paddingTop:20,
        paddingRight:10
    },

    button:{
        bottom:10,
        right:10,
        position:'absolute'
    }
};

class Paragraph extends Component {
    // The metod will return either 1. join! in green. this means that the user can join the event. Que number which shows the user what place in the que he or she is. and lastly joined which means that the user has joined the event and can attend.

    render() {
        const {join, data, classes} = this.props;

        return(
        <Paper className={classes.root}>
            <div className={classes.wrapper}>
            <Grid container direction='column' wrap='nowrap' justify='center'>
                <Typography color='inherit' variant='title'>
                    <strong>
                        {data.subheader}
                    </strong>
                </Typography>
                <br/>
                <Typography color='inherit'>
                    {data.text}
                </Typography>
            </Grid>
            <Grid className={classes.button}>
                {join}
            </Grid>
            </div>
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
