import { useEffect, useMemo } from 'react';
import parseISO from 'date-fns/parseISO';
import { Link } from 'react-router-dom';
import { Notification } from 'types/Types';
import { useNotifications, useUpdateNotification } from 'api/hooks/Notification';
import { useGoogleAnalytics } from 'api/hooks/Utils';
import { getTimeSince } from 'utils';

// Material-UI
import { Skeleton, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core';

// Icons
import NotificationUnreadIcon from '@material-ui/icons/NotificationsRounded';
import NotificationReadIcon from '@material-ui/icons/NotificationsNoneRounded';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardRounded';

// Project components
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Paper from 'components/layout/Paper';
import Pagination from 'components/layout/Pagination';

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { event } = useGoogleAnalytics();
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
    <Paper noPadding sx={{ mb: 1, ...(!notification.read && { backgroundColor: (theme) => theme.palette.colors.tihlde + '25' }) }}>
      <ListItem
        secondaryAction={
          notification.link && (
            <IconButton
              {...(notification.link.substr(0, 4) === 'http' ? { component: 'a', href: notification.link } : { component: Link, to: notification.link })}
              aria-label='Åpne link'
              edge='end'
              onClick={() => event('open-notification-link', 'notifications', `Opened notification link: ${notification.link}`)}>
              <ArrowForwardIcon />
            </IconButton>
          )
        }>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={notification.message} secondary={getTimeSince(parseISO(notification.created_at))} />
      </ListItem>
    </Paper>
  );
};

const NotificationItemLoading = () => {
  return (
    <Paper noPadding sx={{ mb: 1 }}>
      <ListItem>
        <ListItemIcon>
          <NotificationReadIcon />
        </ListItemIcon>
        <ListItemText primary={<Skeleton height={24} width='40%' />} secondary={<Skeleton height={12} width='15%' />} />
      </ListItem>
    </Paper>
  );
};

const ProfileNotifications = () => {
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNotifications();
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const notifications = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <>
      {isLoading && <NotificationItemLoading />}
      {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <List dense disablePadding>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Pagination>
      )}
      {isFetching && <NotificationItemLoading />}
    </>
  );
};

export default ProfileNotifications;
