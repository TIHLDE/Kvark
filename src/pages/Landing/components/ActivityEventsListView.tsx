import { Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material';
import { useCallback, useState } from 'react';

import { useEvents } from 'hooks/Event';

import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  alignItems: 'self-start',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  p: 0.5,
}));

const NO_OF_EVENTS_TO_SHOW = 3;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

type Filters = {
  activity: boolean;
};

const ActivityEventsListView = () => {
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const getInitialFilters = useCallback((): Filters => {
    const activity = true;
    return { activity };
  }, []);
  const [filters] = useState<Filters>(getInitialFilters());

  const { data, isLoading } = useEvents(filters);

  if (isLoading) {
    return (
      <Stack gap={1}>
        <EventListItemLoading />
        <EventListItemLoading />
        <EventListItemLoading />
      </Stack>
    );
  } else if (!data?.pages[0]?.results.length) {
    return (
      <Text align='center' variant='subtitle1'>
        Ingen kommende arrangementer
      </Text>
    );
  } else if (mdDown) {
    return (
      <Stack gap={1}>
        {data?.pages[0]?.results.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} />
        ))}
      </Stack>
    );
  }

  return (
    <Container>
      {data?.pages[0].results.length ? (
        data?.pages[0]?.results.slice(0, NO_OF_EVENTS_TO_SHOW).map((event) => <EventListItem event={event} key={event.id} />)
      ) : (
        <Stack gap={1}>
          <Text align='center' variant='subtitle1'>
            Ingen kommende aktiviteter
          </Text>
        </Stack>
      )}
    </Container>
  );
};

export default ActivityEventsListView;
