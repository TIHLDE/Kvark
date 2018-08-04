import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import URLS from '../URLS';

// Material UI Components
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import CloseIcon from '@material-ui/icons/Close';

// Project Components
import Link from './Link';

const styles = {
    root: {
        zIndex: 10,
        height: '100%',
        position: 'relative',
    },
    wrapper: {
        width: 'auto',
        padding: 10,
    },

    // Event styles
    eventHeader: {
        '@media only screen and (max-width: 800px)': {
            fontSize: '1.3em',
        }
    },
    eventSubheader: {
        '@media only screen and (max-width: 800px)': {
            fontSize: '12px',
        }
    },

    // Event Details styles
    details: {
        backgroundColor: 'white',
        transform: 'none',
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 1000,

        padding: 10,
    },
    eventContent: {
        paddingTop: 4,
        height: '100%',
    },
    button: {
        margin: '0 5px',
    },
    descriptionContainer: {
        height: 'auto',
        overflow: 'hidden',
        marginBottom: 4,
        
    },
    actionContainer: {
        minHeight: 30,
    },
    description: {
      height: '100%',
    }

};

const EventDetails = withStyles(styles)((props) => {
    const {classes, event} = props;
    console.log(event);
    return (
        <Grow in={true} timeout={300}>
            <Grid className={classes.details} container direction='column' wrap='nowrap' ref={props.ref} >
                <Grid container direction='row' wrap='nowrap' justify='space-between' alignItems='center'>
                    <Typography variant='headline'>{event.title}</Typography>
                    <IconButton onClick={props.onClose}><CloseIcon/></IconButton>
                </Grid>
                <Grid container direction='row' wrap='nowrap' justify='space-between'>
                    <Typography variant='body2'>{event.location}</Typography>
                    <Typography variant='body2'>{event.time} - {event.date}</Typography>
                </Grid>
                <Grid className={classes.eventContent} container direction='column' wrap='nowrap' justify='space-between'>
                    <div className={classes.descriptionContainer}>
                        <Typography className={classes.descriptionb} variant='subheading'>
                            {event.description}
                        </Typography>
                    </div>
                    <Grid className={classes.actionContainer} container direction='row' wrap='nowrap' justify='flex-end'>
                        <Link to={URLS.events + event.id}>
                            <Button className={classes.button} size='small' color='primary' variant='raised'>Åpne</Button>
                        </Link>
                        {(!event.sign_up)? null : 
                            <Button className={classes.button} size='small' color='primary' variant='raised'>Meld deg på</Button>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grow>
    );
});

const Event = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <Divider/>
            <ListItem button disableGutters style={{padding: 3}} onClick={props.onClick}>
                <ListItemText>
                    <Grid container direction='row' alignItems='center'>
                        <Typography className={classes.eventHeader} component='span' variant='headline'>{props.title}</Typography>
                        <Typography className={classes.eventSubheader} component='span' variant='subheading'>&nbsp; {props.location ? 'på' : ''} {props.location}</Typography>
                    </Grid>
                </ListItemText>
                <div>
                    <Typography variant='subheading'>{props.date}</Typography>
                    <Typography variant='caption'>{props.time}</Typography>
                </div>
            </ListItem>
        </Fragment>
    );
});

Event.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    start: PropTypes.string,
    time: PropTypes.string,
};

// Is there a better way of doing this in JS?
// Answer: Yes - String.padStart()  - PS: Also use a lambda please
function zeropadNumber(num, digits=2) {
    let s = num.toString();
    while (s.length < digits) {
        s = '' + '0' + s;
    }
    return s;
}

let maxElementsCount = 5;


class EventList extends Component {

    constructor() {
        super();
        this.state = {
            showDetails: false,
            selectedEvent: null,
        };
    }

    componentDidMount() {
        const {height} = this.props;
        maxElementsCount = height*5;
    }

    toggleShowDetails = () => {
        this.setState({showDetails: !this.state.showDetails});
    }

    openEvent = (event) => {
        this.setState({selectedEvent: event});
        this.toggleShowDetails();
    }

    render() {
        const {classes, data} = this.props;
        const {selectedEvent} = this.state;
        const eventslist = data.events || [];

        const events = [];
        const eventCount = (eventslist.length > maxElementsCount)? maxElementsCount : eventslist.length;
        for (let i = 0; i < eventCount; i++) {
            const v = eventslist[i];
            const startTime = new Date(v.start);
            v.time = zeropadNumber(startTime.getHours()) + ':' + zeropadNumber(startTime.getMinutes());
            v.date = zeropadNumber(startTime.getDay()) + '/' + zeropadNumber(startTime.getMonth());
            events[i] = <Event key={v.id}
                          title={v.title || '<No title>'}
                          location={v.location || ''}
                          date={v.date}
                          time={v.time}
                          onClick={() => this.openEvent(v)}
                        />;
        }
   
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
                {(this.state.showDetails)? <EventDetails event={selectedEvent} onClose={this.toggleShowDetails}/> : null}
            </Card>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object,
    height: PropTypes.number,
    data: PropTypes.object,
};

export default withStyles(styles)(EventList);
