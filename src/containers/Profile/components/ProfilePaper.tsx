import { useState, useEffect } from 'react';
import classNames from 'classnames';
import QRCode from 'qrcode.react';
import { User, Notification } from 'types/Types';
import { Groups } from 'types/Enums';
import { useUser, useHavePermission } from 'api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
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
import LogOutIcon from '@material-ui/icons/ExitToAppRounded';
import BadgesIcon from '@material-ui/icons/EmojiEventsOutlined';

// Components
import ProfileAdmin from 'containers/Profile/components/ProfileAdmin';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';
import ProfileEvents from 'containers/Profile/components/ProfileEvents';
import ProfileNotifications from 'containers/Profile/components/ProfileNotifications';
import ProfileBadges from 'containers/Profile/components/ProfileBadges';
import Paper from 'components/layout/Paper';
import Modal from 'components/layout/Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    maxWidth: 1000,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: '-60px',
    padding: theme.spacing(4),
    paddingTop: theme.spacing(14),
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: 'auto',
    marginBottom: theme.spacing(0),
    marginLeft: 'auto',
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
  skeletonCircle: {
    width: 110,
    margin: theme.spacing(5),
    marginTop: theme.spacing(4),
    height: 150,
  },
  memberProof: {
    background: theme.palette.common.white,
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
  redirect: {
    justifyContent: 'flex-end',
  },
  logOutButton: {
    color: theme.palette.error.main,
  },
}));

export type ProfilePaperProps = { logoutMethod: () => void };

const ProfilePaper = ({ logoutMethod }: ProfilePaperProps) => {
  const classes = useStyles();
  const { getUserData } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [isAdmin] = useHavePermission([Groups.HS, Groups.PROMO, Groups.INDEX, Groups.NOK]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: userData?.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const settingsTab = { label: 'Profil', icon: ProfileIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logoutMethod, className: classes.logOutButton };
  const tabs = [eventTab, notificationsTab, badgesTab, settingsTab, ...(isAdmin ? [adminTab] : []), logoutTab];
  const [tab, setTab] = useState(eventTab.label);

  useEffect(() => {
    let subscribed = true;
    getUserData()
      .then((user) => {
        if (user) {
          user.notifications.reverse();
          !subscribed || setUserData(user);
        }
      })
      .finally(() => !subscribed || setIsLoading(false));
    return () => {
      subscribed = false;
    };
  }, [getUserData]);

  useEffect(() => {
    if (tab === notificationsTab.label && userData && userData.unread_notifications !== 0) {
      setUserData({ ...userData, unread_notifications: 0 });
    } else if (
      tab !== notificationsTab.label &&
      userData &&
      userData.unread_notifications === 0 &&
      userData.notifications.some((notification) => !notification.read)
    ) {
      const newNotifications = userData.notifications.map((notification: Notification) => {
        return { ...notification, read: true };
      });
      setUserData({ ...userData, notifications: newNotifications });
    }
    // eslint-disable-next-line
  }, [tab]);

  type NavListItem = {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
    iconEnd?: React.ComponentType<SvgIconProps>;
    badge?: string | number;
    onClick?: () => void;
    className?: string;
  };

  const NavListItem = ({ label, icon: Icon, iconEnd: IconEnd, onClick, badge, className = '', ...props }: NavListItem) => (
    <ListItem button onClick={onClick ? onClick : () => setTab(label)} selected={tab === label} {...props}>
      <ListItemIcon>
        <Badge badgeContent={badge} color='error'>
          <Icon className={className} color={tab === label ? 'primary' : 'inherit'} />
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

  return (
    <>
      <Paper className={classes.paper} noPadding>
        {showModal && userData && (
          <Modal className={classes.memberProof} onClose={() => setShowModal(false)} open={showModal}>
            <QRCode size={280} value={userData.user_id} />
          </Modal>
        )}
        <Avatar className={classes.avatar}>
          {userData?.first_name ? (
            `${userData.first_name.substring(0, 1)}${userData.last_name.substring(0, 1)}`
          ) : (
            <Skeleton className={classNames(classes.skeleton, classes.skeletonCircle)} variant='text' />
          )}
        </Avatar>
        {userData && userData.first_name ? (
          <>
            <Typography className={classes.text} variant='h4'>
              {`${userData.first_name} ${userData.last_name}`}
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
            <ProfileNotifications isLoading={isLoading} notifications={userData?.notifications || []} />
          </Collapse>
          <Collapse in={tab === settingsTab.label}>
            <Paper>
              <ProfileSettings />
            </Paper>
          </Collapse>
          <Collapse in={tab === badgesTab.label}>
            <ProfileBadges />
          </Collapse>
          <Collapse in={tab === adminTab.label}>
            <ProfileAdmin />
          </Collapse>
        </div>
      </div>
    </>
  );
};

export default ProfilePaper;
