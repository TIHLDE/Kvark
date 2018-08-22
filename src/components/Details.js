import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {stringToDate} from '../utils'

import {Grid, Typography, Paper, Avatar,Button} from '@material-ui/core/';

//Importing icons
import Place from '@material-ui/icons/Place'
import EventNote from '@material-ui/icons/EventNote'


/*  This class shows the details over when and where the arrangements are. it will also show Who is in change and how to contact them*/
const styles = {
    root: {
        width:'auto',
        height: 'auto',
        justifyContent:'center',
        paddingBottom:'10px',

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
    info:{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        paddingLeft:'10px',
        paddingRight: '10px',
    },

};

const Information = withStyles(styles)((props) => {
    const {classes, data} = props;

    return (
        <Grid container className={classNames(classes.root, props.className)}>
            <Grid item style={{
                height:'auto'
            }}>
                <Avatar alt="Missing icon" >
                    {data.icon}
                </Avatar>
            </Grid>
            <Grid item className={classes.info}>
                    <Typography>{data.main}</Typography>
                    <Typography>{data.secondary}</Typography>
            </Grid>
        </Grid>
    )
});

class Details extends Component {

    render() {
        const {data, classes} = this.props;
        const date = stringToDate(data.date);
        const dateString = date.toDateString();
        const timeString = date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");

        return (
            <Paper className={classNames(classes.root, this.props.className)}>
                <Grid container className={classes.wrapper} alignContent='stretch' justify='space-between'
                      direction="row">
                    <Grid className={classes.item}>
                        <Information data={{
                            icon:<EventNote/>,
                            main: <strong>{dateString}</strong>,
                            secondary:timeString
                        }}
                        />
                    </Grid>
                    <Grid className={classes.item}>
                        <Information data={{
                            icon:<Place/>,
                            main: <strong>{data.where}</strong>,
                            secondary: data.what
                        }}
                        />
                    </Grid>
                    <Grid className={classes.item}>
                        <Button color='primary' fullWidth={true}>
                            Meld deg på!
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}
Text.propTypes={
    data: PropTypes.object,

};



export default withStyles(styles)(Details);
