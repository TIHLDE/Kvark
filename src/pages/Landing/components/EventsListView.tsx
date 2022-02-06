import { EventCompact } from 'types';
import { Groups } from 'types/Enums';
import { Typography, styled, Stack, useMediaQuery, Theme } from '@mui/material';

// Project componets
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  p: 0.5,
}));

export type EventsListViewProps = {
  events: Array<EventCompact>;
  isLoading?: boolean;
};

const NO_OF_EVENTS_TO_SHOW = 3;
const NO_OF_EVENTS_TO_SHOW_MD_DOWN = 4;

const EventsListView = ({ events, isLoading = false }: EventsListViewProps) => {
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (isLoading && mdDown) {
    return (
      <Stack gap={1} sx={{ alignSelf: 'start' }}>
        <EventListItemLoading />
        <EventListItemLoading />
        <EventListItemLoading />
      </Stack>
    );
  } else if (isLoading) {
    return (
      <Container>
        <Stack gap={1} sx={{ alignSelf: 'start' }}>
          <EventListItemLoading />
          <EventListItemLoading />
          <EventListItemLoading />
        </Stack>
        <Stack gap={1} sx={{ alignSelf: 'start' }}>
          <EventListItemLoading />
          <EventListItemLoading />
          <EventListItemLoading />
        </Stack>
      </Container>
    );
  } else if (!events.length) {
    return (
      <Text align='center' variant='subtitle1'>
        Ingen kommende arrangementer
      </Text>
    );
  } else if (mdDown) {
    return (
      <Stack gap={1}>
        {events.slice(0, NO_OF_EVENTS_TO_SHOW_MD_DOWN).map((event) => (
          <EventListItem event={event} key={event.id} />
        ))}
      </Stack>
    );
  }

  const getNokEvents = () => events.filter((event) => event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase()).slice(0, NO_OF_EVENTS_TO_SHOW);
  const getOtherEvents = () => events.filter((event) => event.organizer?.slug.toLowerCase() !== Groups.NOK.toLowerCase()).slice(0, NO_OF_EVENTS_TO_SHOW);

  return (
    <Container>
      <Stack gap={1} sx={{ alignSelf: 'start' }}>
        {getNokEvents().length ? (
          getNokEvents().map((event) => <EventListItem event={event} key={event.id} />)
        ) : (
          <Text align='center' variant='subtitle1'>
            Ingen kommende bedpres eller kurs
          </Text>
        )}
      </Stack>
      <Stack gap={1} sx={{ alignSelf: 'start' }}>
        {getOtherEvents().length ? (
          getOtherEvents().map((event) => <EventListItem event={event} key={event.id} />)
        ) : (
          <Text align='center' variant='subtitle1'>
            Ingen kommende sosiale eller andre arrangementer
          </Text>
        )}
      </Stack>
    </Container>
  );
};

export default EventsListView;
