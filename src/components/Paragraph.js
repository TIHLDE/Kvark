import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Paper} from '@material-ui/core/';

{/* If you want to implement grid then go ahead!
La oss gøre denne om til en SLC,
Kan gjøre hvis man hoverer over så vil knappen bli rød og man kan forlate.

*/}

const styles ={
    root:{
        minHeight:400,
        height:'auto',
        width: 'auto',
        position:'relative',
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
