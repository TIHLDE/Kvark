// React
import React, {Component} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import URLS from '../../../URLS';
import PropTypes from 'prop-types';

// API and store import
import UserService from '../../../api/services/UserService';
import NotificationService from '../../../api/services/NotificationService';

// Material-UI
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';

import Settings from '@material-ui/icons/Settings';
import DateRange from '@material-ui/icons/DateRange';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Skeleton from '@material-ui/lab/Skeleton';

// Components
import ProfileSettings from './ProfileSettings';
import ProfileEvents from './ProfileEvents';
import ProfileNotifications from './ProfileNotifications';
import MemberProof from './MemberProof';
import Paper from '../../../components/layout/Paper';

const styles = (theme) => ({
  paper: {
    width: '90%',
    maxWidth: 750,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: '-60px',
    padding: '28px',
    paddingTop: '110px',
    textAlign: 'center',
  },
  tabs: {
    marginTop: 30,
    marginBottom: 1,
    backgroundColor: theme.colors.background.light,
    color: theme.colors.text.light,
  },
  button: {
    margin: '15px auto 0px',
  },
  buttonLink: {
    width: 'fit-content',
    textDecoration: 'none',
  },
  logOutButton: {
    backgroundColor: theme.colors.status.red,
    color: theme.colors.constant.white,
    '&:hover': {
      backgroundColor: theme.colors.status.red + 'bb',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  avatar: {
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
    top: -100,
    width: 200,
    height: 200,
    fontSize: 65,
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, ' + theme.colors.gradient.avatar.top + ', ' + theme.colors.gradient.avatar.bottom + ')',
    color: theme.colors.gradient.avatar.text,
  },
  skeleton: {
    animation: 'animate 1.5s ease-in-out infinite',
  },
  skeletonText: {
    margin: '4px auto',
  },
  text: {
    margin: '2px auto',
    color: theme.colors.text.main,
  },
  skeletonCircle: {
    width: 110,
    margin: 45,
    marginTop: 30,
    height: 150,
  },
});

class ProfilePaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabViewMode: 0,
      userData: {},
      groupMember: false,
      isLoading: true,
      modalShow: false,
    };
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

    loadUserData = () => {
      UserService.getUserData()
          .then((user) => {
            if (user) {
              user.notifications.reverse();
              this.setState({userData: user});
            }
          })
          .catch(() => {})
          .then(() => {
            this.setState({isLoading: false});
          });
    }

    loadIsGroupMember = () => {
      UserService.isGroupMember().then((groups) => {
        if (groups.isHS || groups.isPromo || groups.isNok || groups.isDevkom) {
          this.setState({groupMember: true});
        }
      });
    }

    updateNotificationReadState = (id, newState) => {
      NotificationService.updateNotificationReadState(id, newState).then((data) => {
        this.setState((oldState) => {
          oldState.userData.unread_notifications--;

          // Find the updated notification and mark as read.
          oldState.userData.notifications.map((notification) => {
            if (notification.id === id) {
              notification.read = true;
            }
            return notification;
          });
        });
      });
    }

    componentDidMount() {
      this.loadUserData();
      this.loadIsGroupMember();
    }

    handleLogOut = () => {
      this.props.logOutMethod();
    }

    handleChange(event, newValue) {
      this.setState({tabViewMode: newValue});
    }
    closeEventModal = () => {
      this.setState({modalShow: false});
    }
    showEventModal = () => {
      this.setState({modalShow: true});
    }

    render() {
      const {classes} = this.props;
      const notifications = this.state.userData.notifications ? this.state.userData.notifications : [];

      return (
        <Paper className={classes.paper} noPadding>
          {this.state.modalShow && this.state.userData &&
            <MemberProof
              onClose={this.closeEventModal}
              userId={this.state.userData.user_id}
              status={this.state.modalShow} />
          }
          <Avatar className={classes.avatar}>{this.state.userData.first_name !== undefined ? String((this.state.userData.first_name).substring(0, 1)) + (this.state.userData.last_name).substring(0, 1) : <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant="text" /> }</Avatar>
          <Typography className={classes.text} variant='h4'>{ this.state.userData.first_name !== undefined ? this.state.userData.first_name + ' ' + this.state.userData.last_name : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="75%" /> }</Typography>
          <Typography className={classes.text} variant='subtitle1'>{ this.state.userData.email !== undefined ? this.state.userData.email : <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant="text" width="45%" /> }</Typography>
          <div className={classes.buttonsContainer}>
            { this.state.groupMember && <Link to={URLS.admin} className={classNames(classes.button, classes.buttonLink)}><Button variant='contained' color='primary'>Admin</Button></Link> }
            <Button className={classes.button} variant='contained' color='primary' onClick={this.showEventModal}>Medlemsbevis</Button>
            <Button className={classNames(classes.logOutButton, classes.button)} variant='contained' color='inherit' onClick={this.handleLogOut}>Logg ut</Button>
          </div>
          <Tabs variant="fullWidth" scrollButtons="on" centered className={classes.tabs} value={this.state.tabViewMode} onChange={this.handleChange}>
            <Tab id='0' icon={<DateRange />} label={<Hidden xsDown>Arrangementer</Hidden>} />
            <Tab id='1' icon={
              <Badge badgeContent={this.state.userData.unread_notifications} color="error">
                <NotificationsIcon />
              </Badge>
            } label={<Hidden xsDown>Notifikasjoner</Hidden>} />
            <Tab id='2' icon={<Settings />} label={<Hidden xsDown>Innstillinger</Hidden>} />
          </Tabs>
          {this.state.tabViewMode === 0 && <ProfileEvents/>}
          {this.state.tabViewMode === 1 && <ProfileNotifications updateNotificationReadState={this.updateNotificationReadState} isLoading={this.state.isLoading} messages={notifications} />}
          {this.state.tabViewMode === 2 && <ProfileSettings />}
        </Paper>
      );
    }
}

ProfilePaper.propTypes = {
  classes: PropTypes.object,
  logOutMethod: PropTypes.func,
};

export default withStyles(styles)(ProfilePaper);
