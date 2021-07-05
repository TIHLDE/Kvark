import { Fragment, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import parseISO from 'date-fns/parseISO';
import { Notification } from 'types/Types';
import { useNotifications, useUpdateNotification } from 'api/hooks/Notification';
import { getTimeSince } from 'utils';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { Typography, Skeleton } from '@material-ui/core';

// Icons
import NotificationUnreadIcon from '@material-ui/icons/NotificationsRounded';
import NotificationReadIcon from '@material-ui/icons/NotificationsNoneRounded';

// Project components
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Paper from 'components/layout/Paper';
import Pagination from 'components/layout/Pagination';

const useStyles = makeStyles((theme) => ({
  message: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  icon: {
    fontSize: 25,
    margin: theme.spacing(1),
    marginRight: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  unread: {
    backgroundColor: theme.palette.colors.tihlde + '25',
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
  const updateNotification = useUpdateNotification(notification.id);

  useEffect(() => {
    return () => {
      if (!notification.read) {
        updateNotification.mutate(true);
      }
    };
  }, [notification]);

  const Icon = notification.read ? NotificationReadIcon : NotificationUnreadIcon;
  return (
    <Paper className={classNames(classes.message, !notification.read && classes.unread)}>
      <Icon className={classes.icon} />
      <div style={{ width: '100%' }}>
        <Typography className={classes.text}>{notification.message}</Typography>
        <Typography variant='caption'>{getTimeSince(parseISO(notification.created_at))}</Typography>
      </div>
    </Paper>
  );
};

const NotificationItemLoading = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.message}>
      <NotificationReadIcon className={classes.icon} />
      <div style={{ width: '100%' }}>
        <Skeleton height={24} width='40%' />
        <Skeleton height={12} width='15%' />
      </div>
    </Paper>
  );
};

const ProfileNotifications = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNotifications();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);

  return (
    <>
      {isLoading && <NotificationItemLoading />}
      {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          {data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.results.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </Fragment>
          ))}
        </Pagination>
      )}
      {isFetching && <NotificationItemLoading />}
    </>
  );
};

export default ProfileNotifications;
