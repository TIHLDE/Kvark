import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';
import { differenceInMilliseconds, formatDistance } from 'date-fns';
import { nb } from 'date-fns/locale';
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

  const now = new Date();

  return formatDistance(now, new Date(now.getTime() + milliseconds), {
    includeSeconds: true,
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
