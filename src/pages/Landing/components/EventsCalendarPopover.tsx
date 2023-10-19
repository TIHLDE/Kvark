import { Stack, styled, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';

import { useEventById } from 'hooks/Event';

import Paper from 'components/layout/Paper';
import DetailContent from 'components/miscellaneous/DetailContent';

const DetailsHeader = styled(Typography)({
  fontSize: '1.5rem',
});

export type EventsCalendarPopoverProps = {
  id: number;
};

const EventsCalendarPopover = ({ id }: EventsCalendarPopoverProps) => {
  const { data } = useEventById(Number(id));

  return (
    <Stack component={Paper} gap={1} sx={{ minWidth: 210, py: 1, px: 2 }}>
      {data && (
        <>
          <DetailsHeader variant='h2'>{data.title}</DetailsHeader>
          <DetailContent info={formatDate(parseISO(data.start_date))} title='Fra:' />
          <DetailContent info={formatDate(parseISO(data.end_date))} title='Til:' />
          <DetailContent info={data.location} title='Sted:' />
          {data.sign_up &&
            (
              <>
                <DetailContent info={`${data.list_count}${data.limit && "/"+data.limit}`} title='Påmeldte:' />
                {data.waiting_list_count && <DetailContent info={String(data.waiting_list_count)} title='Venteliste:' />}
              </>
            )
          }

          <Link to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>Til arrangement</Link>
        </>
      )}
    </Stack>
  );
};

export default EventsCalendarPopover;
