import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

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

  return myDate.getTime() - now.getTime();
};

const convertTime = (milliseconds?: number) => {
  if (!milliseconds) {
    return;
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const tempHours = Math.floor(totalSeconds / 3600);
  const hours = tempHours < 10 ? `0${tempHours}` : tempHours.toString();
  const tempMinutes = Math.floor((totalSeconds % 3600) / 60);
  const minutes = tempMinutes < 10 ? `0${tempMinutes}` : tempMinutes.toString();
  const tempSeconds = totalSeconds % 60;
  const seconds = tempSeconds < 10 ? `0${tempSeconds}` : tempSeconds.toString();

  return `${hours}:${minutes}:${seconds}`;
};

interface Order {
  payment_link?: string;
  expire_date?: Date;
}

const CountdownTimer: React.FC<Order> = ({ payment_link, expire_date }) => {
  const [timeLeft, setTimeLeft] = useState(convertTime(getTimeDifference(expire_date)));

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = getTimeDifference(expire_date);

      if (distance && distance >= 0) {
        setTimeLeft(convertTime(distance));
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
