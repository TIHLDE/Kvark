import CloudSyncIcon from '@mui/icons-material/CloudSyncRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { Alert, Collapse, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { TIHLDE_API_URL } from 'constant';
import { useEffect, useMemo, useState } from 'react';

import { USERS_ENDPOINT } from 'api/api';

import { useUser, useUserEvents } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import { Pre } from 'components/miscellaneous/MarkdownRenderer';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

export const EventsSubscription = () => {
  const [subscribeExpanded, setSubscribeExpanded] = useState(false);
  const { data: user } = useUser();
  const { event } = useAnalytics();

  useEffect(() => {
    !subscribeExpanded || event('open', 'event-calendar-subscription', 'Opened info about event-subscriptions in calendar');
  }, [subscribeExpanded]);

  return (
    <Paper noOverflow noPadding>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setSubscribeExpanded((prev) => !prev)}>
          <ListItemIcon sx={{ minWidth: 35 }}>
            <CloudSyncIcon />
          </ListItemIcon>
          <ListItemText primary='Kalender-abonnement' secondary='Påmeldinger rett inn i kalenderen' />
          {subscribeExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={subscribeExpanded}>
        <Divider />
        <Stack gap={1} sx={{ p: 2 }}>
          <Typography variant='body2'>
            Du kan abonnere på din arrangement-kalender slik at nye påmeldinger kommer automatisk inn i kalenderen din. Kopier URLen under og åpne{' '}
            <a href='https://calendar.google.com/calendar/u/0/r/settings/addbyurl' rel='noopener noreferrer' target='_blank'>
              Google Calendar
            </a>
            ,{' '}
            <a href='https://support.apple.com/no-no/guide/calendar/icl1022/mac' rel='noopener noreferrer' target='_blank'>
              Apple Calendar (fremgangsmåte)
            </a>
            ,{' '}
            <a href='https://support.microsoft.com/nb-no/office/cff1429c-5af6-41ec-a5b4-74f2c278e98c' rel='noopener noreferrer' target='_blank'>
              Microsoft Outlook (fremgangsmåte)
            </a>{' '}
            eller en annen kalender for å begynne å abonnere på arrangement-kalenderen din. Hvis nye påmeldinger til arrangementer ikke kommer inn i kalenderen
            din umiddelbart, så kan det være fordi kalenderen sjelden ser etter oppdateringer. Oppdaterings-frekvensen varierer fra kalender til kalender,
            enkelte oppdateres kun daglig.
          </Typography>
          {!user ? null : user.public_event_registrations ? (
            <Pre>{`${TIHLDE_API_URL}${USERS_ENDPOINT}/${user.user_id}/events.ics`}</Pre>
          ) : (
            <Alert color='info' variant='outlined'>
              Du har skrudd av offentlige arrangementspåmeldinger. Du må skru det på i profilen for å kunne abonnere på din arrangement-kalender.
            </Alert>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
};

const ProfileEvents = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserEvents();
  const events = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  return (
    <Stack gap={1}>
      <EventsSubscription />
      {!data ? (
        <EventListItemLoading />
      ) : !events.length ? (
        <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />
      ) : (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere arrangementer' nextPage={() => fetchNextPage()}>
          {events?.map((event) => !event.expired && <EventListItem event={event} key={event.id} />)}
        </Pagination>
      )}
    </Stack>
  );
};

export default ProfileEvents;
