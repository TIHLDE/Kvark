import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import URLS from '../../../URLS';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

// API and store import
import { useUser } from '../../../api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import EventIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneRounded';
import ProfileIcon from '@material-ui/icons/InsertEmoticonRounded';
import AdminIcon from '@material-ui/icons/TuneRounded';
import NewTabIcon from '@material-ui/icons/LaunchRounded';
import LogOutIcon from '@material-ui/icons/ExitToAppRounded';
import BadgesIcon from '@material-ui/icons/EmojiEventsOutlined';

// Components
import ProfileSettings from './ProfileSettings';
import ProfileEvents from './ProfileEvents';
import ProfileNotifications from './ProfileNotifications';
import ProfileBadges from './ProfileBadges';
import Paper from '../../../components/layout/Paper';
import Modal from '../../../components/layout/Modal';

const styles = (theme) => ({
  paper: {
    width: '100%',
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: '-60px',
    padding: '28px',
    paddingTop: '110px',
    textAlign: 'center',
    backgroundColor: theme.palette.colors.background.smoke,
  },
  button: {
    margin: '7px auto 0px',
    minWidth: 150,
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
    background: 'linear-gradient(90deg, ' + theme.palette.colors.gradient.avatar.top + ', ' + theme.palette.colors.gradient.avatar.bottom + ')',
    color: theme.palette.colors.gradient.avatar.text,
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
    color: theme.palette.colors.text.main,
  },
  skeletonCircle: {
    width: 110,
    margin: 45,
    marginTop: 30,
    height: 150,
  },
  memberProof: {
    background: theme.palette.colors.constant.white,
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridGap: 10,
    marginTop: -50,
    marginBottom: 20,
    '@media only screen and (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  contentList: {
    overflow: 'hidden',
  },
  list: {
    padding: 0,
  },
  redirect: {
    justifyContent: 'flex-end',
  },
  logOutButton: {
    color: theme.palette.colors.status.red,
  },
});

function ProfilePaper(props) {
  const { classes, logoutMethod } = props;
  const { getUserData } = useUser();
  const [userData, setUserData] = useState({});
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: userData.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const settingsTab = { label: 'Profil', icon: ProfileIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon, iconEnd: NewTabIcon, component: Link, to: URLS.admin };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logoutMethod, className: classes.logOutButton };
  const tabs = [eventTab, notificationsTab, badgesTab, settingsTab, ...(isGroupMember ? [adminTab] : []), logoutTab];
  const [tab, setTab] = useState(eventTab.label);

  useEffect(() => {
    getUserData()
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
  }, [getUserData]);

  useEffect(() => {
    if (tab === notificationsTab.label && userData.unread_notifications !== 0) {
      setUserData({ ...userData, unread_notifications: 0 });
    } else if (tab !== notificationsTab.label && userData.unread_notifications === 0 && userData.notifications.some((n) => !n.read)) {
      const newNotifications = userData.notifications.map((notification) => {
        return { ...notification, read: true };
      });
      setUserData({ ...userData, notifications: newNotifications });
    }
    // eslint-disable-next-line
  }, [tab]);

  const NavListItem = ({ label, icon: Icon, iconEnd: IconEnd, onClick, badge, ...props }) => (
    <ListItem button onClick={onClick ? onClick : () => setTab(label)} selected={tab === label} {...props}>
      <ListItemIcon>
        <Badge badgeContent={badge} color='error'>
          <Icon className={props.className} color={tab === label ? 'primary' : 'inherit'} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={label} />
      {IconEnd && (
        <ListItemIcon className={classes.redirect}>
          <IconEnd color='inherit' />
        </ListItemIcon>
      )}
    </ListItem>
  );
  NavListItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    iconEnd: PropTypes.object,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  return (
    <>
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
        <Button className={classes.button} color='primary' onClick={() => setShowModal(true)} variant='contained'>
          Medlemsbevis
        </Button>
      </Paper>
      <div className={classes.content}>
        <div>
          <Paper className={classes.contentList} noPadding>
            <List aria-label='Profil innholdsliste' className={classes.list}>
              {tabs.map((tab) => (
                <NavListItem {...tab} key={tab.label} />
              ))}
            </List>
          </Paper>
        </div>
        <div>
          <Collapse in={tab === eventTab.label}>
            <ProfileEvents />
          </Collapse>
          <Collapse in={tab === notificationsTab.label}>
            <ProfileNotifications isLoading={isLoading} notifications={userData.notifications || []} setUserData={setUserData} />
          </Collapse>
          <Collapse in={tab === settingsTab.label}>
            <Paper>
              <ProfileSettings />
            </Paper>
          </Collapse>
          <Collapse in={tab === badgesTab.label}>
            <ProfileBadges />
          </Collapse>
        </div>
      </div>
    </>
  );
}

ProfilePaper.propTypes = {
  classes: PropTypes.object,
  logoutMethod: PropTypes.func,
};

export default withStyles(styles)(ProfilePaper);
