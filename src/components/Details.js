import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Paper} from '@material-ui/core/';

import {Link} from 'react-router-dom';


{/*  This class shows the details over when and where the arrangements are. it will also show Who is in change and how to contact them*/}
const styles ={
    root:{
        width:'auto',
        height: 'auto',
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
        margin:'auto'
    },
    head:{
        fontWeight:'bold',
        paddingTop:10,
    },
    info:{
        paddingBottom:10,
    }
};

class Details extends Component {
    widthChecker = window.onload = window.onresize = () =>{
        if(window.screen.availWidth >= 500 ){
            return "row"
        }else{
            return "column"
        }
    };

    render() {
        const {data, classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Grid container className={classes.wrapper} alignContent='stretch' justify='space-between'
                      direction={this.widthChecker()}>
                    <Grid className={classes.item}>
                        <Typography className={classes.head} color='primary' variant='title'>Når:</Typography>
                        <Typography color='primary' variant ='subheading'>{data.date}</Typography>
                        <Typography color='primary' variant ='subheading' className={classes.info}> {data.clock}</Typography>
                        <Typography className={classes.head} color='primary' variant='title'> Hvor: </Typography>
                        <Typography color='primary' variant ='subheading' className={classes.info}>{data.where}</Typography>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography className={classes.head} color='primary' variant='title'> Forfatter: </Typography>
                        <Typography color='primary' variant ='subheading'>{data.name}</Typography>
                        <Typography color='primary' variant ='subheading' className={classes.info}>{data.study}</Typography>
                        <Typography className={classes.head} color='primary' variant='title'> Plasser: </Typography>
                        <Typography color='primary' variant ='subheading' className={classes.info}>{data.space}</Typography>
                    </Grid>
                    <Grid className={classes.item}>
                        <Typography className={classes.head} color='primary' variant='title'> Hva: </Typography>
                        <Typography color='primary' variant ='subheading' className={classes.info}>{data.what}</Typography>
                        <br/>
                        <a href={data.link} > <Typography color='primary' variant='title' >facebook</Typography></a>
                        <br/>
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
