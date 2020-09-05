import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import URLS from '../../../URLS';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

// API and store import
import UserService from '../../../api/services/UserService';

// Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';

// Icons
import EventIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneRounded';
import ProfileIcon from '@material-ui/icons/InsertEmoticonRounded';

// Components
import ProfileSettings from './ProfileSettings';
import ProfileEvents from './ProfileEvents';
import ProfileNotifications from './ProfileNotifications';
import Paper from '../../../components/layout/Paper';
import Modal from '../../../components/layout/Modal';

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
    backgroundColor: theme.colors.background.smoke,
  },
  tabs: {
    marginTop: 20,
    marginBottom: 1,
    color: theme.colors.text.light,
  },
  button: {
    margin: '7px auto 0px',
    minWidth: 150,
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
    margin: 'auto',
    minHeight: 35,
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
  memberProof: {
    background: theme.colors.constant.white,
  },
});

function ProfilePaper(props) {
  const { classes, logoutMethod } = props;
  const [tab, setTab] = useState(0);
  const [userData, setUserData] = useState({});
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadUserData = () => {
    UserService.getUserData()
      .then((user) => {
        if (user) {
          user.notifications.reverse();
          setUserData(user);
          const groups = user.groups;
          if (groups.includes('HS') || groups.includes('Promo') || groups.includes('NoK') || groups.includes('DevKom')) {
            setIsGroupMember(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => loadUserData(), []);

  useEffect(() => {
    if (tab === 1 && userData.unread_notifications !== 0) {
      setUserData({ ...userData, unread_notifications: 0 });
    } else if (tab !== 1 && userData.unread_notifications === 0 && userData.notifications.some((n) => !n.read)) {
      const newNotifications = userData.notifications.map((notification) => {
        return { ...notification, read: true };
      });
      setUserData({ ...userData, notifications: newNotifications });
    }
    // eslint-disable-next-line
  }, [tab]);

  return (
    <Paper className={classes.paper} noPadding>
      {showModal && userData && (
        <Modal className={classes.memberProof} onClose={() => setShowModal(false)} open={showModal}>
          <QRCode size={280} value={userData.user_id} />
        </Modal>
      )}
      <Avatar className={classes.avatar}>
        {userData.first_name ? (
          String(userData.first_name.substring(0, 1)) + userData.last_name.substring(0, 1)
        ) : (
          <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant='text' />
        )}
      </Avatar>
      {userData.first_name ? (
        <>
          <Typography className={classes.text} variant='h4'>
            {userData.first_name + ' ' + userData.last_name}
          </Typography>
          <Typography className={classes.text} variant='subtitle1'>
            {userData.email}
          </Typography>
          <Typography className={classes.text} variant='subtitle1'>
            {userData.user_id}
          </Typography>
        </>
      ) : (
        <>
          <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant='text' width='75%' />
          <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant='text' width='45%' />
          <Skeleton className={classNames(classes.skeleton, classes.skeletonText)} variant='text' width='35%' />
        </>
      )}
      <div className={classes.buttonsContainer}>
        {isGroupMember && (
          <Button className={classes.button} color='primary' component={Link} to={URLS.admin} variant='contained'>
            Admin
          </Button>
        )}
        <Button className={classes.button} color='primary' onClick={() => setShowModal(true)} variant='contained'>
          Medlemsbevis
        </Button>
        <Button className={classNames(classes.logOutButton, classes.button)} color='inherit' onClick={logoutMethod} variant='contained'>
          Logg ut
        </Button>
      </div>
      <Tabs centered className={classes.tabs} onChange={(e, newTab) => setTab(newTab)} scrollButtons='on' value={tab} variant='fullWidth'>
        <Tab icon={<EventIcon />} id='0' label={<Hidden xsDown>Arrangementer</Hidden>} />
        <Tab
          icon={
            <Badge badgeContent={userData.unread_notifications} color='error'>
              <NotificationsIcon />
            </Badge>
          }
          id='1'
          label={<Hidden xsDown>Varsler</Hidden>}
        />
        <Tab icon={<ProfileIcon />} id='2' label={<Hidden xsDown>Profil</Hidden>} />
      </Tabs>
      {tab === 0 && <ProfileEvents />}
      {tab === 1 && <ProfileNotifications isLoading={isLoading} notifications={userData.notifications || []} setUserData={setUserData} />}
      {tab === 2 && <ProfileSettings />}
    </Paper>
  );
}

ProfilePaper.propTypes = {
  classes: PropTypes.object,
  logoutMethod: PropTypes.func,
};

export default withStyles(styles)(ProfilePaper);
