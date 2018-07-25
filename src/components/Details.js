import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Avatar, Paper} from '@material-ui/core/';

import Facebook from '../assets/img/facebook_icon.ico'

{/* This class shows the details over when and where the arrangements are. it will also show Who is in change and how to contact them*/}
const styles ={
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
        const {data, classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Grid container className={classes.wrapper} alignContent='stretch' justify='space-between'
                      direction='row'>
                    <Grid className={classes.item}>
                        <Typography color='primary' variant='title'>Når :</Typography>
                        <Typography color='primary' variant ='subheading'>21. juni</Typography>
                        <Typography color='primary' variant ='subheading'> 18:00</Typography>
                        <br/>
                        <Typography color='primary' variant='title'> Hvor: </Typography>
                        <Typography color='primary' variant ='subheading'>steinberg 21</Typography>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography color='primary' variant='title'> Hva: </Typography>
                        <Typography color='primary' variant ='subheading'>Bedriftpresentasjon</Typography>
                        <br/>
                        <a href='https://www.facebook.com'><Avatar alt='facebook_Image' src={Facebook} className={{ margin:101}} /></a>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography color='primary' variant='title'> Forfatter: </Typography>
                        <Typography color='primary' variant ='subheading'>Chetan Bhagat</Typography>
                        <Typography color='primary' variant ='subheading'>dataingeniør</Typography>
                        <br/>
                        <Typography color='primary' variant='title'> Plasser: </Typography>
                        <Typography color='primary' variant ='subheading' l>0/200</Typography>
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
