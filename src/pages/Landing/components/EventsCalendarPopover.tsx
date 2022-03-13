import { styled, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { formatDate, urlEncode } from 'utils';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

// Project components
import Paper from 'components/layout/Paper';
import DetailContent from 'components/miscellaneous/DetailContent';
import { useEventById } from 'hooks/Event';

const DetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'grid',
  gap: theme.spacing(1),
}));

const DetailsHeader = styled(Typography)({
  fontSize: '1.5rem',
});

export type PopoverProps = {
  id: number;
};

const EventsCalendarPopover = ({ id }: PopoverProps) => {
  const { data } = useEventById(Number(id));

  return (
    <>
      {data !== undefined ? (
        <DetailsPaper>
          <DetailsHeader variant='h2'>Detaljer</DetailsHeader>
          <DetailContent info={formatDate(parseISO(data.start_date))} title='Fra:' />
          <DetailContent info={formatDate(parseISO(data.end_date))} title='Til:' />
          <DetailContent info={data.location} title='Sted:' />
          <DetailsHeader variant='h2'>Påmelding</DetailsHeader>
          <DetailContent info={`${data.list_count}/${data.limit}`} title='Påmeldte:' />
          <DetailContent info={String(data.waiting_list_count)} title='Venteliste:' />
          <Link to={`${URLS.events}${data.id}/${urlEncode(data.title)}/`}>Til arrangement</Link>
        </DetailsPaper>
      ) : (
        <div style={{ width: '210px' }}></div>
      )}
    </>
  );
};

export default EventsCalendarPopover;
