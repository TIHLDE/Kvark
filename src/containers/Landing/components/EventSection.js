import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import URLS from '../../../URLS';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import Calendar from '@material-ui/icons/CalendarToday';
import Location from '@material-ui/icons/LocationOn';
import Time from '@material-ui/icons/AccessTime';

import DEFAULT_IMAGE from '../../../assets/img/tihlde_image.png';

// Project Components
import Link from '../../../components/navigation/Link';

const styles = {
    root: {
        padding: 48,

        '@media only screen and (max-width: 600px)': {
            padding: 32,
        }
    },
    wrapper: {
        maxWidth: 1000,
        margin: 'auto',

        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '48px',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '100%',
            gridGap: '20px',
        }
    },
    content: {
        '@media only screen and (max-width: 800px)': {
            order: 2,
        },
        
    },
    imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media only screen and (max-width: 800px)': {
            order: 1,
        }
    },

    // Details
    details: {
        marginTop: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        color: 'black',
        
        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: 'auto',
            padding: '10px 0',
        },
    },

    // InfoContent
    info: {
        width: 'auto',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
    },

    // Image
    image: {
        width: '100%',
        height: 'auto',
        maxWidth: 500,
        objectFit: 'cover',

        margin: 'auto',

        '@media only screen and (max-width: 800px)': {
            maxWidth: 'none',
        }
    },

    // List
    list: {
        marginTop: 32,
    },

    // Event Item
    eventItem: {
        borderBottom: '1px solid rgba(0,0,0,0.1)',
    }
}

const InfoContent = withStyles(styles)((props) => (
    <Grid className={props.classes.info} container direction='row' wrap='nowrap' alignItems='center'>
        {props.icon}
        <Typography className={props.classes.infoText} variant='subheading'>{props.label}</Typography>
    </Grid>
));

InfoContent.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
};

const EventListItem = withStyles(styles)((props) => {
    const {classes} = props;
    const data = props.data || {};
    return (
        <Link to={URLS.events.concat(data.id)}>
            <ListItem className={classes.eventItem} button>
                <ListItemText primary={
                    <Grid container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                        <Typography variant='body2'>{data.title}</Typography>
                        <Typography variant='caption'>{moment(data.start).format('DD/MM')}</Typography>
                    </Grid>
                }/>
            </ListItem>
        </Link>
    )
});

class EventSection extends Component {

    constructor() {
        super();
        this.state = {
            currentEvent: {},
            moreEvents: [],
        }
    }

    componentDidMount() {
        this.initializeEvents();
    }

    initializeEvents = () => {
        const events = this.props.data.events;
        if(events && events.length > 0) {
            const currentEvent = events[0];
            currentEvent.date = moment(currentEvent.start).format('DD.MM.YYYY');
            currentEvent.time = moment(currentEvent.start).format('HH:mm');
            this.setState({
                currentEvent: currentEvent,
                moreEvents: events.slice(1, 5),
            });
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.data && prevProps.data !== this.props.data) {
            this.initializeEvents();
        }
    }

    render() {
        const {classes} = this.props;

        const {image, title, date, time, location, id} = this.state.currentEvent || {};
        
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <div className={classes.content}>
                        <Link to={URLS.events.concat(id)}>
                            <Typography variant='display1'><strong>{title}</strong></Typography>
                            <div className={classes.details}>
                                <InfoContent icon={<Calendar className={classes.icon}/>} label={date} />
                                <InfoContent icon={<Time className={classes.icon}/>} label={time} />
                                <InfoContent icon={<Location className={classes.icon}/>} label={location} />
                            </div>
                        </Link>
                        <div className={classes.list}>
                            <Typography variant='headline' gutterBottom>Flere arrangementer</Typography>
                            <Divider />
                            {this.state.moreEvents.map((value, index) => (
                                <EventListItem key={index} data={value}/>
                            ))}
                            {this.state.moreEvents.length === 0 && <Typography variant='caption'>Ingen flere arrangementer</Typography>}
                        </div>
                    </div>
                    <div className={classes.imageWrapper}>
                        <img className={classes.image} src={image || DEFAULT_IMAGE} alt={title} /> 
                    </div>
                </div>
            </div>
        );
    }
}

EventSection.propTypes = {
    data: PropTypes.object.isRequired,
};

EventSection.defaultProps = {
    data: {
        events: [],
        name: 'Arrangementer',
    },
}

export default withStyles(styles)(EventSection);