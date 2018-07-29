import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Avatar, Paper} from '@material-ui/core/';

import Facebook from '../assets/img/facebook_icon.ico'

/* This class shows the details over when and where the arrangements are. it will also show Who is in change and how to contact them*/
const styles = {
    root:{
        width:'auto',
        height: 200,
        backgroundColor:'lightblue',
        justifyContent:'center',
    },
    wrapper:{
        width:'90%',
        height:'90%',
        margin:'auto',
        paddingTop:20
    },
    item: {
        width: '33%',
        textAlign: 'center',
        backgroundColor:'red'
    }
};

class Details extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Grid container className={classes.wrapper} alignContent='stretch' justify='space-between'
                      direction='row'>
                    <Grid className={classes.item}>
                        <Typography color='primary' variant='title'>Når :</Typography>
                        <br/>
                        <br/>
                        <Typography color='primary' variant='title'> Hvor: </Typography>
                    </Grid>
                    <Grid className={classes.item}>

                        <Avatar alt='facebook_Image' src={Facebook}/>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography color='primary' variant='title'> Forfatter: </Typography>
                        <br/>
                        <br/>
                        <Typography color='primary' variant='title'> Plasser: </Typography>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}
Details.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.any,
};

export default withStyles(styles)(Details);
