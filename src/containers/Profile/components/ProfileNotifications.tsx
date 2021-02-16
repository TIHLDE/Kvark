import { Notification } from 'types/Types';
import { useNotification } from 'api/hooks/Notification';

// Material-UI
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/InfoRounded';

// Project components
import Paper from 'components/layout/Paper';

const useStyles = makeStyles((theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& div': {
      width: '100%',
      padding: theme.spacing(1),
    },
  },
  icon: {
    fontSize: 25,
    margin: theme.spacing(1),
    marginRight: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  unread: {
    backgroundColor: theme.palette.colors.tihlde + '44',
  },
  text: {
    color: theme.palette.text.primary,
  },
}));

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const classes = useStyles();
  const { updateNotificationReadState } = useNotification();

  if (!notification.read) {
    updateNotificationReadState(notification.id, true);
  }

  return (
    <Paper className={classNames(classes.message, !notification.read && classes.unread)}>
      <InfoIcon className={classes.icon} />
      <Typography align='left' className={classes.text} color='inherit'>
        {notification.message}
      </Typography>
    </Paper>
  );
};

export type ProfileNotificationsProps = {
  notifications: Array<Notification>;
  isLoading: boolean;
};

const ProfileNotifications = ({ notifications, isLoading }: ProfileNotificationsProps) => {
  const classes = useStyles();

  return (
    <>
      {isLoading ? (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Laster notifikasjoner...
        </Typography>
      ) : notifications.length ? (
        notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
      ) : (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Ingen notifikasjoner
        </Typography>
      )}
    </>
  );
};

export default ProfileNotifications;
