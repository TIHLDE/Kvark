import { useMemo } from 'react';
import { useUserEvents } from 'hooks/User';

import { Stack } from '@mui/material';

// Project componets
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Pagination from 'components/layout/Pagination';

const ProfileEvents = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserEvents();
  const events = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  if (!data) {
    return <EventListItemLoading />;
  } else if (!events.length) {
    return <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />;
  } else {
    return (
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere arrangementer' nextPage={() => fetchNextPage()}>
        <Stack gap={1}>{events?.map((event) => !event.expired && <EventListItem event={event} key={event.id} />)}</Stack>
      </Pagination>
    );
  }
};

export default ProfileEvents;
