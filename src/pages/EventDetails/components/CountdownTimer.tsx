import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { differenceInMilliseconds, formatDistanceStrict } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Paper from 'components/layout/Paper';

import VIPPS from 'assets/img/vipps.svg';

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

  const now = new Date();

  return formatDistanceStrict(new Date(now.getTime() + milliseconds), now, {
    locale: nb,
  });
};

type Order = {
  expire_date: Date;
  payment_link?: string;
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
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Link to={payment_link || '/'}>
          <img alt='Betal med vipps' src={VIPPS} />
        </Link>
      </Box>
      <Typography align='center' sx={{ color: (theme) => theme.palette.text.primary }}>
        Betal innen {timeLeft} for å beholde plassen på arrangementet.
      </Typography>
    </ContentPaper>
  );
};

export default CountdownTimer;