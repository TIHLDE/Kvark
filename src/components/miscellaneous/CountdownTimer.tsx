import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds } from 'date-fns';

import Paper from 'components/layout/Paper';

import vipps from '../../../public/img/vipps.svg';

const ContentPaper = styled(Paper)({
  height: 'fit-content',
  overflowX: 'auto',
});

// TODO: write to date-fns
const getTimeDifference = (time?: Date) => {
  if (!time) {
    return;
  }

  const now = new Date();
  const myDate = new Date(time);

  return myDate.getTime() - now.getTime();
};

// TODO: write this nicer. can milliseconds me undefined? 
const convertTime = (milliseconds?: number) => {
  if (!milliseconds) {
    return;
  }

  return `${millisecondsToHours(milliseconds)}:${millisecondsToMinutes(milliseconds)}:${millisecondsToSeconds(milliseconds)}`;
};

type Order = {
  payment_link?: string;
  expire_date?: Date;
};

const CountdownTimer = ({ payment_link, expire_date }: Order) => {
  const [timeLeft, setTimeLeft] = useState(convertTime(getTimeDifference(expire_date)));

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = getTimeDifference(expire_date);

      if (distance && distance > 0) {
        setTimeLeft(convertTime(distance));
      } else {
        // Invalidate react query key for this event
        window.location.reload();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ContentPaper>
      <Typography align='center' gutterBottom sx={{ color: (theme) => theme.palette.text.primary, fontSize: '2.4rem', wordWrap: 'break-word' }} variant='h2'>
        Gjenstående tid
      </Typography>
      <Typography align='center' sx={{ color: (theme) => theme.palette.text.primary, fontSize: '2.4rem', wordWrap: 'break-word', pb: 4 }} variant='h2'>
        {timeLeft}
      </Typography>
      <Typography align='center'>
        <Link href={payment_link}>
          <img alt='Betal med vipps' src={vipps} width={'45%'} />
        </Link>
      </Typography>
    </ContentPaper>
  );
};

export default CountdownTimer;
