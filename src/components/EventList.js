import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    root: {
       padding: 10,
    },
};

const Event = (props) => (
    <ListItem button disableGutters style={{padding: 3}}>
        <div style={{width: 5, height: 40, backgroundColor: 'var(--tihlde-blaa)'}}></div>
        <ListItemText primary={props.title} secondary={props.location}/>
        <div>
            <Typography variant='caption'>{props.date}</Typography>
            <Typography variant='caption'>{props.time}</Typography>
        </div>
    </ListItem>
);

Event.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
};

class EventList extends Component {

    render() {
        const {classes} = this.props;

        return (
            <Card className={classes.root}>
                <Grid container direction='row' wrap='nowrap' justify='space-between'>
                    <Typography variant='headline'>Arrangementer</Typography>
                    <Button variant='outlined'>FLERE</Button>
                </Grid>
                <List dense>
                    <Event title='Eksamensfest' location='TIHLDE kontoret' date='20.12.2018' time='18:00'/>
                    <Event title='Eksamensfest' location='TIHLDE kontoret' date='20.12.2018' time='18:00'/>
                    <Event title='Eksamensfest' location='TIHLDE kontoret' date='20.12.2018' time='18:00'/>
                    <Event title='Eksamensfest' location='TIHLDE kontoret' date='20.12.2018' time='18:00'/>
                </List>
                <Divider/>
                <CardActions>
                    <Grid container direction='row' justify='space-between' alignItems='center'>
                        <Button variant='outlined'>Tilbake</Button>
                        <Typography variant='caption'>Side 1 av 3</Typography>
                        <Button variant='outlined'>Neste</Button>
                    </Grid>
                </CardActions>
            </Card>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventList);
