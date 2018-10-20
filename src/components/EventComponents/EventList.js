import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import URLS from '../../URLS';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';

// Text
import Text from '../../text/EventText';

// Material UI Components
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Project Components
import MessageIndicator from '../MessageIndicator';

const styles = (theme) => ({
    root: {
        zIndex: 10,
        height: '100%',
        position: 'relative',

        '@media only screen and (max-width: 800px)': {
            minHeight: 300,
            maxHeight: 365,
        }
    },
    wrapper: {
        width: 'auto',
        padding: '5px 16px'
    },
    padding: {
        padding: 15,
    },
    top: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    moreButton: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        width: '100%',
        borderRadius: 0,
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
    button: {
        margin: '0 5px',
        height: 40,
    },
});

const Event = withStyles(styles)((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <ListItem button disableGutters style={{padding: 3}} onClick={props.onClick}>
                <ListItemText>
                    <Grid container direction='column' justify='center'>
                        <Typography
                        className={classes.eventHeader}
                        component='span'
                        variant='headline'
                        color={(props.priority === 2)? 'primary' : 'default'}>
                        {(props.priority === 2)? 
                            <strong>{props.title}</strong>
                            : props.title
                        }
                        </Typography>
                        <Typography className={classes.eventSubheader} component='span' variant='subheading'>{props.location}</Typography>
                    </Grid>
                </ListItemText>
                <div>
                    <Typography variant='subheading'>{props.date}</Typography>
                    <Typography variant='caption'>{props.time}</Typography>
                </div>
            </ListItem>
            <Divider/>
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
        s = '0' + s;
    }
    return s;
}

let maxElementsCount = 5;

class EventList extends Component {

    componentDidMount() {
        const {height} = this.props;
        maxElementsCount = height*5;
    }

    openEvent = (event) => {
        this.props.history.push(URLS.events.concat(event.id));
    }

    openEventsPage = () => {
        this.props.history.push(URLS.events);
    }

    render() {
        const {classes, data} = this.props;
        const eventslist = data.events || [];

        const events = [];
        const eventCount = (eventslist.length > maxElementsCount)? maxElementsCount : eventslist.length;
        for (let i = 0; i < eventCount; i++) {
            const v = eventslist[i];
            const startTime = new Date(v.start);
            v.time = zeropadNumber(startTime.getUTCHours()) + ':' + zeropadNumber(startTime.getMinutes());
            v.date = zeropadNumber(startTime.getDate()) + '/' + zeropadNumber(startTime.getMonth()+1);
            events[i] = <Event key={v.id}
                          title={v.title || '<No title>'}
                          location={v.location || ''}
                          date={v.date}
                          time={v.time}
                          priority={v.priority}
                          onClick={() => this.openEvent(v)}
                        />;
        }

        return (
            <Card className={classes.root} square={true}>
                 <Grid className={classNames(classes.padding, classes.top)} container direction='row' wrap='nowrap'>
                    <Typography variant='title' color='inherit'>{data.name}</Typography>
                </Grid>
                <div className={classes.wrapper}>
                   
                    {events.length > 0 ?
                        <List dense>
                            {events}
                        </List>
                        :
                        <MessageIndicator header={Text.noEvents} variant='subheading'/>
                    }
                </div>
                <Button className={classes.moreButton} onClick={this.openEventsPage} variant='contained' color='secondary'>Vis flere</Button>
            </Card>
        );
    }
};

EventList.propTypes = {
    classes: PropTypes.object,
    height: PropTypes.number,
    data: PropTypes.object,
};

export default withRouter(withStyles(styles, {withTheme: true})(EventList));
