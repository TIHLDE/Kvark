import { useMemo } from 'react';
import { useUserEvents } from 'hooks/User';

// Project componets
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Pagination from 'components/layout/Pagination';

const ProfileEvents = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserEvents();
  const events = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  if (!data) {
    return <ListItemLoading />;
  } else if (!events.length) {
    return <NotFoundIndicator header='Fant ingen arrangementer' subtitle='Du er ikke påmeldt noen kommende arrangementer' />;
  } else {
    return (
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere arrangementer' nextPage={() => fetchNextPage()}>
        {events?.map((event) => !event.expired && <ListItem event={event} key={event.id} />)}
      </Pagination>
    );
  }
};

export default ProfileEvents;
