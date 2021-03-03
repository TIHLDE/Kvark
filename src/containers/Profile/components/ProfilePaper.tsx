import { useState } from 'react';
import classNames from 'classnames';
import { Groups } from 'types/Enums';
import { useUser, useHavePermission } from 'api/hooks/User';

// Material-UI
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
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
import BadgesIcon from '@material-ui/icons/EmojiEventsRounded';

// Components
import ProfileAdmin from 'containers/Profile/components/ProfileAdmin';
import ProfileSettings from 'containers/Profile/components/ProfileSettings';
import ProfileEvents from 'containers/Profile/components/ProfileEvents';
import ProfileNotifications from 'containers/Profile/components/ProfileNotifications';
import ProfileBadges from 'containers/Profile/components/ProfileBadges';
import Paper from 'components/layout/Paper';
import Modal from 'components/layout/Modal';
import Avatar from 'components/miscellaneous/Avatar';
import QRCode from 'components/miscellaneous/QRCode';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    left: 0,
    right: 0,
    top: -60,
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
  const { data: user } = useUser();
  const { allowAccess: isAdmin } = useHavePermission([Groups.HS, Groups.PROMO, Groups.INDEX, Groups.NOK]);
  const [showModal, setShowModal] = useState(false);
  const eventTab = { label: 'Arrangementer', icon: EventIcon };
  const notificationsTab = { label: 'Varsler', icon: NotificationsIcon, badge: user?.unread_notifications };
  const badgesTab = { label: 'Badges', icon: BadgesIcon };
  const settingsTab = { label: 'Profil', icon: ProfileIcon };
  const adminTab = { label: 'Admin', icon: AdminIcon };
  const logoutTab = { label: 'Logg ut', icon: LogOutIcon, onClick: logoutMethod, className: classes.logOutButton };
  const tabs = [eventTab, notificationsTab, badgesTab, settingsTab, ...(isAdmin ? [adminTab] : []), logoutTab];
  const [tab, setTab] = useState(eventTab.label);

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
        {showModal && user && (
          <Modal className={classes.memberProof} onClose={() => setShowModal(false)} open={showModal}>
            <QRCode height={350} value={user.user_id} width={350} />
          </Modal>
        )}
        <Avatar className={classes.avatar} user={user} />
        {user && user.first_name ? (
          <>
            <Typography className={classes.text} variant='h4'>
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
          <Collapse in={tab === notificationsTab.label} unmountOnExit>
            <ProfileNotifications />
          </Collapse>
          <Collapse in={tab === badgesTab.label}>
            <ProfileBadges />
          </Collapse>
          <Collapse in={tab === settingsTab.label}>
            <Paper>{user && <ProfileSettings user={user} />}</Paper>
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
