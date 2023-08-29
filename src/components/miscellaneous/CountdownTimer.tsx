import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';
import { differenceInMilliseconds, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

import Paper from 'components/layout/Paper';

import vipps from '../../../public/img/vipps.svg';

const ContentPaper = styled(Paper)({
  height: 'fit-content',
  overflowX: 'auto',
});

const getTimeDifference = (time?: Date) => {
  if (!time) {
    return;
  }

  const now = new Date();
  const myDate = new Date(time);

  return differenceInMilliseconds(myDate, now);
};

const convertTime = (milliseconds?: number) => {
  if (!milliseconds) {
    return;
  }
  const duration = intervalToDuration({ start: 0, end: milliseconds });
  const hours = duration.hours?.toString().padStart(2, '0');
  const minutes = duration.minutes?.toString().padStart(2, '0');
  const seconds = duration.seconds?.toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
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
