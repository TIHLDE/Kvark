// React
import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import UserService from '../../../api/services/UserService';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import LinkButton from '../../../components/navigation/LinkButton';
import { Typography } from '@material-ui/core';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import Start from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';

// Project componets
import TIHLDELOGO from '../../../assets/img/tihlde_image.png';

const styles = (theme) => ({
  wrapper: {
    borderTop: '1px solid lightgray',
  },
  eventListRow: {
    display: 'flex',
    minHeight: 80,
    overflow: 'hidden',
    alignItems: 'center',
  },
  eventImageContainer: {
    minHeight: 81,
    minWidth: 81,
    width: 81,
    height: 81,
    overflow: 'hidden',
    display: 'inline-flex',
  },
  eventImage: {
    objectFit: 'cover',
    height: 80,
    width: 80,
  },
  eventTitle: {
    flexGrow: 1,
    padding: 5,
  },
  eventInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'left',
    overflow: 'hidden',
    width: 165,
    '@media only screen and (max-width: 700px)': {
      width: 'unset',
    },
  },
  eventContainer: {
    display: 'flex',
    flexGrow: 1,
    '@media only screen and (max-width: 700px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  eventInfoElement: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  eventIcon: {
    paddingRight: 10,
  },
  hiddenOnMobile: {
    '@media only screen and (max-width: 700px)': {
      display: 'none',
    },
  },
  noEventText: {
    backgroundColor: 'white',
    padding: 5,
  },

});

class ProfileEvents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: null,
    };
  }

  loadUserData = () => {
    UserService.getUserData().then((user) => {
        if (user) {
            this.setState({events: user.events});
        }
    });
  }

  componentDidMount() {
      this.loadUserData();
  }

  item(event, key) {
    const { classes } = this.props;
    const start = moment(event.start_date, ['YYYY-MM-DD HH:mm'], 'nb');
    const end = moment(event.end_date, ['YYYY-MM-DD HH:mm'], 'nb');
    const src = event.image ? event.image : TIHLDELOGO;
    const imageAlt = event.image_alt ? event.image_alt : event.title;

    return (
      <LinkButton noPadding to={'/arrangementer/' + event.id + '/'}>
        <div className={classes.eventListRow}>
          <div className={classes.eventImageContainer}>
            <img className={classes.eventImage} src={src} alt={imageAlt} />
          </div>
          <div className={classes.eventContainer}>
            <div className={classes.eventTitle}>
              <Typography align='center' variant='h6'>{event.title}</Typography>
              <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
                <LocationOn className={classes.eventIcon} />
                {event.location}
              </div>
            </div>
            <div className={classes.eventInfo}>
              <div className={classes.eventInfoElement}>
                <Start className={classes.eventIcon} />
                {start.format('DD.MM.YYYY, HH:mm')}
              </div>
              <div className={classNames(classes.hiddenOnMobile, classes.eventInfoElement)}>
                <Stop className={classes.eventIcon} />
                {end.format('DD.MM.YYYY, HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </LinkButton>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.events && this.state.events.map((eventData, key) => {
          if (eventData.closed === false && eventData.expired === false) {
            return (
              <div key={key} className={classes.wrapper}>
                {this.item(eventData)}
              </div>
            )
          }
          return ('')
        })
        }
        {(!this.state.events || this.state.events.length < 1) && <Typography align='center' variant='subtitle1'>Du er ikke påmeldt noen kommende arrangementer</Typography>}
      </div>
    );
  }
}

export default withStyles(styles)(ProfileEvents);