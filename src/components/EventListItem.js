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

import TIHLDE from '../assets/img/tihlde_image.png'
import Head from './Head';


const styles = {
    root: {
        width: 'auto',
        height: 'auto',
        fontFamily:'arial',
        cursor: 'pointer',
    },
    image:{
        height: 200,
        maxWidth:'300px',
        objectFit: 'cover',

        '@media only screen and (max-width: 800px)': {
            maxWidth: 'none',
        }
    },
    faded:{
        height: 100,
        background: 'linear-gradient( transparent 10%, white 90%);',
        position:'absolute',
        bottom:0, left: 0, right: 0,
        '@media only screen and (max-width: 600px)': {
            height:0
        },

    },
    padding: {
        padding: 20,
        overflow: 'hidden',

        '@media only screen and (max-width: 800px)': {
            overflow: 'visible',
        }
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

                    <img className={classes.image} alt="complex" src={image} />
                    <Grid  container direction="column" style={{position:'relative'}} >
                        <Grid className={classes.padding} item xs>
                            <Typography variant="display1">
                                {data.title}
                            </Typography>
                            <Typography >{start.format('DD MMM')} {start.format('HH:mm')}</Typography>
                            <br/>
                            <Hidden smDown implementation='css'>
                            <Typography variant='subheading'>
                                {data.description}
                            </Typography>
                            </Hidden>
                        </Grid>

                        <Hidden smDown implementation='css'>
                        <Grid item xs className={classes.faded}/>
                        </Hidden>
                    </Grid>

                </Grid>
            </Paper>
        );
    }
}

EventListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventListItem);
