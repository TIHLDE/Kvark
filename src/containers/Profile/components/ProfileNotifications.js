import PropTypes from 'prop-types';

// API
import { useNotification } from '../../../api/hooks/Notification';

// Material-UI
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

// Project components
import Paper from '../../../components/layout/Paper';

const style = (theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    marginBottom: 5,
    '& div': {
      width: '100%',
      padding: 5,
    },
  },
  icon: {
    fontSize: 25,
    margin: 5,
    marginRight: 25,
    color: theme.palette.text.secondary,
  },
  unread: {
    backgroundColor: theme.palette.colors.tihlde + '44',
  },
  text: {
    color: theme.palette.text.primary,
  },
});

const Notification = (props) => {
  const { classes, notification } = props;
  const { updateNotificationReadState } = useNotification();

  let elementClass = classes.message;
  if (!notification.read) {
    elementClass = classNames(classes.message, classes.unread);
    updateNotificationReadState(notification.id, true);
  }

  return (
    <Paper className={elementClass}>
      <InfoIcon className={classes.icon} />
      <Typography align={'left'} className={classes.text} color={'inherit'}>
        {notification.message}
      </Typography>
    </Paper>
  );
};

Notification.propTypes = {
  classes: PropTypes.object,
  notification: PropTypes.object.isRequired,
};

const ProfileNotifications = (props) => {
  const { classes, notifications, isLoading } = props;

  return (
    <>
      {isLoading ? (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Laster notifikasjoner...
        </Typography>
      ) : notifications.length > 0 ? (
        notifications.map((notification, i) => <Notification classes={classes} key={i} notification={notification} />)
      ) : (
        <Typography align='center' className={classes.text} variant='subtitle1'>
          Ingen notifikasjoner
        </Typography>
      )}
    </>
  );
};

ProfileNotifications.propTypes = {
  classes: PropTypes.object,
  notifications: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default withStyles(style)(ProfileNotifications);
