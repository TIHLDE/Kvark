import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
    root: {
        zIndex: 10,
        height: '100%',
    },
    wrapper: {
        width: 'auto',
        padding: 10,
    },
};

const Event = (props) => (
    <Fragment>
        <Divider/>
        <ListItem button disableGutters style={{padding: 3}}>
            <ListItemText>
                <Grid container direction='row' wrap='nowrap' alignItems='center'>
                    <Typography component='span' variant='headline'>{props.title}</Typography>
                    <Typography component='span' variant='subheading'>&nbsp; {props.location ? 'på' : ''} {props.location}</Typography>
                </Grid>
            </ListItemText>
            <div>
                <Typography variant='subheading'>{props.date}</Typography>
                <Typography variant='caption'>{props.time}</Typography>
            </div>
        </ListItem>
    </Fragment>
);

Event.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    start: PropTypes.string,
    time: PropTypes.string,
};

// Is there a better way of doing this in JS?
function zeropadNumber(num, digits=2) {
    let s = num.toString();
    while (s.length < digits) {
        s = '' + '0' + s;
    }
    return s;
}

class EventList extends Component {

    render() {
        const {classes, data} = this.props;
        const eventslist = data.events || [];
        const events = eventslist.map((v, i) => {
            const startTime = new Date(v.start);
            const time = zeropadNumber(startTime.getHours()) + ':' + zeropadNumber(startTime.getMinutes());
            const date = zeropadNumber(startTime.getDay()) + '/' + zeropadNumber(startTime.getMonth());

            return <Event key={v.id}
                          title={v.title || '<No title>'}
                          location={v.location || ''}
                          date={date}
                          time={time}
                   />;
        });

        return (
            <Card className={classes.root} square={true}>
                <div className={classes.wrapper}>
                    <Grid container direction='row' wrap='nowrap'>
                      <Typography variant='title'>{data.name}</Typography>
                    </Grid>
                    <List dense>
                      {events}
                    </List>
                </div>
            </Card>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(EventList);
