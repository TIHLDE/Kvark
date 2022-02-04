import { Event } from 'types';
import { getUserClass, getUserStudyShort } from 'utils';
import { useEventStatistics } from 'hooks/Event';

// Material-UI
import { Typography, Stack, Box } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type EventStatisticsProps = {
  eventId: Event['id'];
};

const EventStatistics = ({ eventId }: EventStatisticsProps) => {
  const { data } = useEventStatistics(eventId);

  if (!data) {
    return null;
  }

  type StatProps = {
    label: string;
    number: number;
  };

  const Stat = ({ label, number }: StatProps) => (
    <Paper bgColor='smoke' noPadding sx={{ textAlign: 'center', width: '100%' }}>
      <Typography variant='subtitle2'>{label}</Typography>
      <Typography sx={{ fontSize: '2.1rem' }} variant='h3'>
        {number}
      </Typography>
    </Paper>
  );

  return (
    <>
      <Typography>{`Ankommet: ${data.has_attended_count} av ${data.list_count} påmeldte`}</Typography>
      <Stack direction={{ md: 'column' }} gap={1}>
        <Box sx={{ width: '100%' }}>
          <Typography>Klasse:</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            {data.classes.map((cls) => (
              <Stat key={cls[0]} label={getUserClass(cls[0])} number={cls[1]} />
            ))}
          </Stack>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography>Studie:</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
            {data.studies.map((study) => (
              <Stat key={study[0]} label={getUserStudyShort(study[0])} number={study[1]} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default EventStatistics;
