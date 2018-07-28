import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Paper} from '@material-ui/core/';

const styles ={
    root:{
        height:'auto',
        width: 'auto',
    },
    wrapper:{
        width:'90%',
        margin:'auto',
        paddingTop:10
    },
    boxes1:{
        height:'auto',
        width: '100%',
    },
    button:{
        paddingTop:15,
        float:'right',
        paddingBottom:15,
    }

};

class Paragraph extends Component {
    render() {
        const {join, data, classes} = this.props;

        return(
        <Paper className={classes.root}>
            <Grid container className={classes.wrapper} direction='row' justify='space-around' alignItems='stretch' >
                <Grid item className={classes.boxes}>
                    <Typography>
                        {data.subheader}
                    </Typography>
                    <br/>
                    <Typography>
                        {data.text}
                    </Typography>
                </Grid>
                <Grid item  className={classes.boxes1} >
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
