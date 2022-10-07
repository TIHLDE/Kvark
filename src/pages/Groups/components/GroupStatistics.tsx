import { Box, Stack, Typography } from '@mui/material';

import { useGroupStatistics } from 'hooks/Group';

import Paper from 'components/layout/Paper';

export type GroupStatisticsProps = {
  slug: string;
};

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

const GroupStatistics = ({ slug }: GroupStatisticsProps) => {
  const { data } = useGroupStatistics(slug);

  if (!data) {
    return null;
  }

  return (
    <Stack direction={{ md: 'column' }} gap={1}>
      <Box sx={{ width: '100%' }}>
        <Typography>Klasse:</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
          {data.studyyears.map((studyyear) => (
            <Stat key={studyyear.studyyear} label={studyyear.studyyear} number={studyyear.amount} />
          ))}
        </Stack>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Typography>Studie:</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
          {data.studies.map((study) => (
            <Stat key={study.study} label={study.study} number={study.amount} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default GroupStatistics;
