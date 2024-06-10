import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import NotificationReadIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationUnreadIcon from '@mui/icons-material/NotificationsRounded';
import {
  Badge,
  Box,
  ClickAwayListener,
  Collapse,
  Divider,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Skeleton,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import parseISO from 'date-fns/parseISO';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTimeSince, isExternalURL } from 'utils';

import { Notification } from 'types';

import { useNotifications } from 'hooks/Notification';
import { useUser } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Dialog from 'components/layout/Dialog';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Linkify from 'components/miscellaneous/Linkify';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

type NotificationItemProps = {
  notification: Notification;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NotificationsTopbarProps = {
  color: React.CSSProperties['backgroundColor'];
};

const NotificationItem = ({ notification, setShowNotifications }: NotificationItemProps) => {
  const [showDescription, setShowDescription] = useState(false);
  const { event } = useAnalytics();

  const Icon = notification.read ? NotificationReadIcon : NotificationUnreadIcon;

  const linkOnClick = () => {
    event('open-notification-link', 'notifications', `Opened notification link: ${notification.link}`);
    setShowNotifications(false);
  };

  return (
    <Paper noOverflow noPadding sx={{ mb: 1, ...(!notification.read && { backgroundColor: (theme) => theme.palette.colors.tihlde + '25' }) }}>
      <ListItem
        disablePadding
        secondaryAction={
          notification.description !== '' && (
            <IconButton aria-label='Åpne beskrivelse' edge='end' onClick={() => setShowDescription((prev) => !prev)}>
              {showDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )
        }>
        {notification.link ? (
          <ListItemButton
            {...(isExternalURL(notification.link) ? { component: 'a', href: notification.link } : { component: Link, to: notification.link })}
            aria-label='Åpne link'
            onClick={linkOnClick}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText aria-label='Åpne beskrivelse' primary={notification.title} secondary={getTimeSince(parseISO(notification.created_at))} />
          </ListItemButton>
        ) : (
          <>
            <ListItem component='div'>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText aria-label='Åpne beskrivelse' primary={notification.title} secondary={getTimeSince(parseISO(notification.created_at))} />
            </ListItem>
          </>
        )}
      </ListItem>
      <Collapse in={showDescription}>
        <Divider />
        <Typography sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-word', py: 1, px: 2 }} variant='body2'>
          <Linkify>{notification.description}</Linkify>
        </Typography>
      </Collapse>
    </Paper>
  );
};

const NotificationItemLoading = () => (
  <Paper noPadding sx={{ mb: 1 }}>
    <ListItem>
      <ListItemIcon>
        <NotificationReadIcon />
      </ListItemIcon>
      <ListItemText primary={<Skeleton height={24} width='40%' />} secondary={<Skeleton height={12} width='15%' />} />
    </ListItem>
  </Paper>
);

const NotificationsTopbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: user } = useUser();
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useNotifications({ enabled: showNotifications });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const notifications = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const buttonAnchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (buttonAnchorRef.current && buttonAnchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setShowNotifications(false);
  };

  const NotificationsList = () => (
    <>
      <Typography align='center' gutterBottom variant='h2'>
        Varslinger
      </Typography>
      {isLoading && <NotificationItemLoading />}
      {isEmpty && <NotFoundIndicator header='Fant ingen varsler' />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <List dense disablePadding>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} setShowNotifications={setShowNotifications} />
            ))}
          </List>
        </Pagination>
      )}
      {isFetching && <NotificationItemLoading />}
    </>
  );

  return (
    <>
      <IconButton aria-label='Vis varslinger' onClick={() => setShowNotifications((prev) => !prev)} ref={buttonAnchorRef}>
        <Badge badgeContent={user?.unread_notifications} color='error'>
          {showNotifications ? <CloseRoundedIcon /> : <NotificationReadIcon />}
        </Badge>
      </IconButton>
      {mdDown ? (
        <Dialog fullScreen onClose={() => setShowNotifications(false)} open={showNotifications && !isLoading}>
          <NotificationsList />
        </Dialog>
      ) : (
        <Popper anchorEl={buttonAnchorRef.current} disablePortal open={showNotifications && !isLoading} role={undefined} transition>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
              <Paper elevation={2} noPadding sx={{ maxWidth: (theme) => theme.breakpoints.values.md }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <Box sx={{ p: 2, height: 'calc(100vh - 130px)', overflow: 'auto' }}>
                    <NotificationsList />
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </>
  );
};

export default NotificationsTopbar;
