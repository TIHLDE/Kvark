import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Button, Paper} from '@material-ui/core/';

{/* This class shows the details over when and where the arrangements are. it will also show Who is in change and how to contact them*/}
const styles ={
    root:{
        width:550,
        height: 200,

    },
    wrapper:{
        width:'90%',
        height:'90%',
        margin:'auto',
        paddingTop:20
    },
    item:{
        width:'33%',
        textAlign:'center'

    }
};

class Details extends Component {

    render() {
        const {data, classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Grid container className={classes.wrapper} alignContent='stretch' justify='space-between'
                      direction='row'>
                    <Grid className={classes.item}>
                        <Typography>Når</Typography>
                        <br/>
                        <Typography>nå</Typography>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography>

                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}
Text.propTypes={
    data: PropTypes.any
};



export default withStyles(styles)(Details);
