import AddIcon from '@mui/icons-material/EditRounded';
import { Stack } from '@mui/material';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useEvents } from 'hooks/Event';
import { useGroup } from 'hooks/Group';
import { useUserPermissions } from 'hooks/User';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import EventListItem, { EventListItemLoading } from 'components/miscellaneous/EventListItem';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

const GroupEvents = () => {
  const { slug } = useParams<'slug'>();
  const { data: permissions } = useUserPermissions();
  const { data: group } = useGroup(slug || '-');
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useEvents({ organizer: slug });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Stack>
      {permissions?.permissions.event.write && (
        <Button component={Link} fullWidth startIcon={<AddIcon />} sx={{ mt: 1 }} to='/admin/arrangementer' variant='outlined'>
          Nytt arrangement
        </Button>
      )}
      {isLoading && <EventListItemLoading />}
      {!isLoading && !events.length && <NotFoundIndicator header={`${group?.name} har ingen kommende arrangementer`} />}
      {error && <Paper>{error.detail}</Paper>}
      {data !== undefined && (
        <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
          <Stack gap={1}>
            {events.map((event) => (
              <EventListItem event={event} key={event.id} />
            ))}
          </Stack>
        </Pagination>
      )}
      {isFetching && <EventListItemLoading />}
    </Stack>
  );
};

export default GroupEvents;
