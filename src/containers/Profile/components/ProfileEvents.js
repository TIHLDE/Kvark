// React
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UserService from '../../../api/services/UserService';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';

// Project componets
import EventListItem from '../../Events/components/EventListItem';

const styles = (theme) => ({
  wrapper: {
    paddingTop: 10,
  },
  text: {
    color: theme.colors.text.light,
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

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.wrapper}>
        {this.state.events && this.state.events.map((eventData, key) => {
          if (eventData.closed === false && eventData.expired === false) {
            return <EventListItem key={key} data={eventData} />;
          }
          return ('');
        })
        }
        {(!this.state.events || this.state.events.length < 1) && <Typography className={classes.text} align='center' variant='subtitle1'>Du er ikke påmeldt noen kommende arrangementer</Typography>}
      </div>
    );
  }
}

ProfileEvents.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ProfileEvents);
