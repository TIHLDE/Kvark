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

import TIHLDE from '../assets/img/tihlde_image.png';
import Time from '../assets/icons/twotone-access_time-24px.svg';
import Calendar from '../assets/icons/twotone-calendar_today-24px.svg';
import Location from '../assets/icons/twotone-location_on-24px.svg';


const styles = {
    root: {
        width: 'auto',
        height: 'auto',
        fontFamily:'arial',
        cursor: 'pointer',
    },
    image:{
        height: '100px',
        width:'100px',
        borderStyle:'inset',
        borderWidth:'2px',
    },
    imageContainer:{
        padding:'40px',
        '@media only screen and (max-width: 800px)': {
            maxWidth: 'none',
        }
    },
    padding: {
        padding: 20
    },
    direction:{
        flexDirection:'row',
        '@media only screen and (max-width: 800px)': {
            flexDirection:'column',
        },
    }
};


class EventListItem extends Component {
    render() {
        const { classes, data } = this.props;
        let image = (data.image) ? data.image: TIHLDE;

        let start = moment(data.start, ['YYYY-MM-DD HH:mm'], "nb");

        return (
            <Paper className={classes.root} onClick={this.props.onClick}>
                <Grid container className={classes.direction} wrap='nowrap'>
                    <div className={classes.imageContainer}>
                        <img className={classes.image} alt="complex" src={image} />
                    </div>
                    <Grid  container direction="column"  >
                        <Grid className={classes.padding} item >
                            <Typography variant="display1"> {data.title} </Typography>
                        </Grid>

                        <Grid container direction="row" alignItems='center'>
                            <Grid item className={classes.padding} >
                                <img src={Calendar}/>
                                <Typography >{start.format('DD MM YYYY')} </Typography>
                            </Grid>
                            <Grid item className={classes.padding} >
                                <img src={Time}/>
                                <Typography> {start.format('HH:mm')}</Typography>
                            </Grid>
                            <Grid item className={classes.padding} >
                                <img src={Location}/>
                                <Typography >{data.location}</Typography>
                            </Grid>

                            <Button variant="outlined" color="secondary" className={classes.button}>
                                Secondary
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider/>
            </Paper>
        );
    }
}

EventListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventListItem);
