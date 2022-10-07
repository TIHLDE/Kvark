import { Box, Stack, Typography } from '@mui/material';

import { Event } from 'types';

import { useEventStatistics } from 'hooks/Event';

import Paper from 'components/layout/Paper';

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

export type EventStatisticsProps = {
  eventId: Event['id'];
};

const EventStatistics = ({ eventId }: EventStatisticsProps) => {
  const { data } = useEventStatistics(eventId);

  if (!data) {
    return null;
  }

  return (
    <>
      <Typography>{`Ankommet: ${data.has_attended_count} av ${data.list_count} påmeldte`}</Typography>
      <Stack direction={{ md: 'column' }} gap={1}>
        {Boolean(data.studyyears.length) && (
          <Box sx={{ width: '100%' }}>
            <Typography>Klasse:</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
              {data.studyyears.map((studyyear) => (
                <Stat key={studyyear.studyyear} label={studyyear.studyyear} number={studyyear.amount} />
              ))}
            </Stack>
          </Box>
        )}
        {Boolean(data.studies.length) && (
          <Box sx={{ width: '100%' }}>
            <Typography>Studie:</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
              {data.studies.map((study) => (
                <Stat key={study.study} label={study.study} number={study.amount} />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </>
  );
};

export default EventStatistics;
