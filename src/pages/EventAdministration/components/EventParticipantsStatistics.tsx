import { useMemo } from 'react';
import { Registration } from 'types';
import { getUserClass, getUserStudyShort } from 'utils';

// Material-UI
import { Typography, Stack, Box } from '@mui/material';

// Project components
import Paper from 'components/layout/Paper';

export type EventStatisticsProps = {
  registrations: Array<Registration>;
};

const EventStatistics = ({ registrations }: EventStatisticsProps) => {
  const attendedNumber = useMemo(() => registrations.filter((x) => x.has_attended).length, [registrations]);

  const classNo = (userClass: number) => {
    const no = registrations.filter((registration) => registration.user_info.user_class === userClass).length;
    return no > 0 ? no : '0';
  };
  const studyNo = (userStudy: number) => {
    const no = registrations.filter((registration) => registration.user_info.user_study === userStudy).length;
    return no > 0 ? no : '0';
  };

  type NumbersProps = {
    title: string;
    titleFunc: (i: number) => string;
    dataFunc: (i: number) => string | number;
  };

  const Numbers = ({ title, titleFunc, dataFunc }: NumbersProps) => (
    <Box sx={{ width: '100%' }}>
      <Typography>{title}:</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={1}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Paper bgColor='smoke' key={i} noPadding sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant='subtitle2'>{titleFunc(i)}</Typography>
            <Typography sx={{ fontSize: '2.1rem' }} variant='h3'>
              {dataFunc(i)}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <Typography>{`Ankommet: ${attendedNumber} av ${registrations.length} påmeldte`}</Typography>
      <Stack direction={{ md: 'column' }} gap={1}>
        <Numbers dataFunc={classNo} title='Klasse' titleFunc={getUserClass} />
        <Numbers dataFunc={studyNo} title='Studie' titleFunc={getUserStudyShort} />
      </Stack>
    </>
  );
};

export default EventStatistics;
