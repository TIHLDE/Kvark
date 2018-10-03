import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment'

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';

// Icons
import TIHLDE from '../assets/img/tihlde_image.png';
import Time from '@material-ui/icons/AccessTime';
import Calendar from '@material-ui/icons/CalendarToday';
import Location from '@material-ui/icons/LocationOn';


const DESKTOP_HEIGHT = 112;
const DESKTOP_WIDTH = DESKTOP_HEIGHT +70;

const styles = {
    root: {
        width: 'auto',
        height: DESKTOP_HEIGHT,
        fontFamily:'arial',
        cursor: 'pointer',

        '@media only screen and (max-width: 800px)': {
            height: 'auto',
        }
    },
    image:{
        height: DESKTOP_HEIGHT,
        width: DESKTOP_WIDTH,
        maxWidth: DESKTOP_WIDTH,
        objectFit: 'cover',
        '@media only screen and (max-width: 800px)': {
            width: '100%',
            maxWidth: 'none',
            height: 'auto',
            maxHeight: 300,
        }
    },
    imageContainer:{
        paddingRight: 10,
        minWidth: DESKTOP_WIDTH,
        '@media only screen and (max-width: 800px)': {
            maxWidth: '100%',
            minWidth: '100%',
            paddingRight: 0,
        }
    },
    content: {
        maxWidth: '100%',
        '@media only screen and (max-width: 800px)': {
            padding: 10,
        },
    },
    padding: {
        padding: '20px 20px 10px 0',

        '@media only screen and (max-width: 800px)': {
            padding: 10,
        },
    },
    smallPadding: {
        paddingRight: 20,
        maxWidth: 150,
        paddingBottom: 10,

        '@media only screen and (max-width: 800px)': {
            paddingLeft: 10
        },

    },
    rightPadding: {
        paddingLeft: 10,
        color: 'rgba(0,0,0,0.4)',
    },
    direction:{
        flexDirection:'row',
        '@media only screen and (max-width: 800px)': {
            flexDirection:'column',
        },
    },
    button:{
        marginLeft:'auto'
    },
    holder:{
        padding: '10px 10px 10px 0',
    },
    buttonBase: {
        padding: 0,
        margin: 0,

    }
};


class EventListItem extends Component {
    render() {
        const { classes, data } = this.props;
        let image = (data.image) ? data.image: TIHLDE;

        let start = moment(data.start, ['YYYY-MM-DD HH:mm'], "nb");

        return (
            <CardActionArea classes={{root: classes.buttonBase}}>
            <Paper className={classes.root} onClick={this.props.onClick} square>
                <Grid container className={classes.direction} wrap='nowrap'>
                    <div className={classes.imageContainer}>
                        <img className={classes.image} alt="complex" src={image} />
                    </div>
                    <Grid className={classes.content} container direction="column"  >
                        <Grid className={classes.padding} item >
                            <Typography variant="headline"> {data.title} </Typography>
                        </Grid>

                        <Grid container direction="row" alignItems='center' className={classes.holder} wrap='wrap'>
                            <Grid container direction="row" alignItems='center' className={classes.smallPadding} wrap='nowrap'>
                                <Calendar/>
                                <Typography className={classes.rightPadding} noWrap>{start.format('DD-MM-YYYY')} </Typography>
                            </Grid>
                            <Grid container direction="row" alignItems='center' className={classes.smallPadding} wrap='nowrap'>
                                <Time/>
                                <Typography className={classes.rightPadding}> {start.format('HH:mm')}</Typography>
                            </Grid>
                            <Grid container direction="row" alignItems='center' className={classes.smallPadding} wrap='nowrap'>
                                <Location/>
                                <Typography className={classes.rightPadding}>{data.location}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider/>
            </Paper>
            </CardActionArea>
        );
    }
}

EventListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventListItem);
