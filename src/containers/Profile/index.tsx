import { useState } from 'react';
import classNames from 'classnames';
import { PermissionApp } from 'types/Enums';
import { useUser, useHavePermission } from 'api/hooks/User';
import URLS from 'URLS';
import { useNavigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useLogout } from 'api/hooks/User';

// Material-UI
import {
  makeStyles,
  useMediaQuery,
  Typography,
  Button,
  SvgIconProps,
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// Icons
import EventIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsIcon from '@material-ui/icons/NotificationsNoneRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import AdminIcon from '@material-ui/icons/TuneRounded';
import LogOutIcon from '@material-ui/icons/ExitToAppRounded';
import BadgesIcon from '@material-ui/icons/EmojiEventsRounded';
import GroupsIcon from '@material-ui/icons/PeopleOutlineRounded';

// Project Components
import Navigation from 'components/navigation/Navigation';
import ProfileAdmin from 'containers/Profile/components/ProfileAdmin';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';
import ProfileEvents from 'containers/Profile/components/ProfileEvents';
import ProfileGroups from 'containers/Profile/components/ProfileGroups';
import ProfileNotifications from 'containers/Profile/components/ProfileNotifications';
import ProfileBadges from 'containers/Profile/components/ProfileBadges';
import Paper from 'components/layout/Paper';
import Dialog from 'components/layout/Dialog';
import Avatar from 'components/miscellaneous/Avatar';
import QRCode from 'components/miscellaneous/QRCode';

const useStyles = makeStyles((theme) => ({
  top: {
    height: 260,
    background: 'radial-gradient(circle at bottom, ' + theme.palette.colors.gradient.profile.top + ', ' + theme.palette.colors.gradient.profile.bottom + ')',
  },
  paper: {
    position: 'relative',
    left: 0,
    right: 0,
    top: theme.spacing(-7),
    padding: theme.spacing(4),
    paddingTop: theme.spacing(14),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1, 'auto', 0),
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
  },
  skeleton: {
    animation: 'animate 1.5s ease-in-out infinite',
  },
  skeletonText: {
    margin: 'auto',
    minHeight: 35,
  },
  text: {
    margin: `${theme.spacing(0.25)}px auto`,
    color: theme.palette.text.primary,
  },
  memberProof: {
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gridGap: theme.spacing(1),
    marginTop: theme.spacing(-6),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  contentList: {
    overflow: 'hidden',
  },
  list: {
    padding: theme.spacing(0),
  },
  logOutButton: {
    color: theme.palette.error.main,
  },
}));

const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const logOut = useLogout();
  const { data: user } = useUser();
  const { allowAccess: isAdmin } = useHavePermission([PermissionApp.EVENT, PermissionApp.JOBPOST, PermissionApp.NEWS, PermissionApp.USER]);
  const [showModal, setShowModal] = useState(false);
  const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const logout = () => {
    logOut();
    navigate(URLS.landing);
  };

  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: user?.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const groupsTab = { label: 'Grupper', icon: GroupsIcon };
  const settingsTab = { label: 'Innstillinger', icon: SettingsIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logout, className: classes.logOutButton };
  const tabs = [eventTab, notificationsTab, badgesTab, groupsTab, settingsTab, ...(isAdmin ? [adminTab] : []), logoutTab];
  const [tab, setTab] = useState(eventTab.label);

  type NavListItem = {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
    badge?: string | number;
    onClick?: () => void;
    className?: string;
  };

  const NavListItem = ({ label, icon: Icon, onClick, badge, className = '', ...props }: NavListItem) => (
    <ListItem button onClick={onClick ? onClick : () => setTab(label)} selected={tab === label} {...props}>
      <ListItemIcon>
        <Badge badgeContent={badge} color='error'>
          <Icon className={className} color={tab === label ? 'primary' : 'inherit'} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );

  return (
    <Navigation banner={<div className={classes.top} />} fancyNavbar>
      <Helmet>
        <title>Profil - TIHLDE</title>
      </Helmet>
      <div>
        <Paper className={classes.paper} noPadding>
          {showModal && user && (
            <Dialog onClose={() => setShowModal(false)} open={showModal} titleText='Medlemsbevis'>
              <QRCode height={xsDown ? 280 : 350} value={user.user_id} width={xsDown ? 280 : 350} />
            </Dialog>
          )}
          <Avatar className={classes.avatar} user={user} />
          {user && user.first_name ? (
            <>
              <Typography className={classes.text} variant='h1'>
                {`${user.first_name} ${user.last_name}`}
              </Typography>
              <Typography className={classes.text} variant='subtitle1'>
                {user.email}
              </Typography>
              <Typography className={classes.text} variant='subtitle1'>
                {user.user_id}
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
            <Collapse in={tab === notificationsTab.label} mountOnEnter unmountOnExit>
              <ProfileNotifications />
            </Collapse>
            <Collapse in={tab === badgesTab.label} mountOnEnter>
              <ProfileBadges />
            </Collapse>
            <Collapse in={tab === groupsTab.label} mountOnEnter>
              <ProfileGroups />
            </Collapse>
            <Collapse in={tab === settingsTab.label} mountOnEnter>
              <Paper>{user && <ProfileSettings user={user} />}</Paper>
            </Collapse>
            <Collapse in={tab === adminTab.label} mountOnEnter>
              <ProfileAdmin />
            </Collapse>
          </div>
        </div>
      </div>
    </Navigation>
  );
};

export default Profile;
