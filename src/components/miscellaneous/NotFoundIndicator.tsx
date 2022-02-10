import { styled, Typography } from '@mui/material';

import NotFoundIcon from 'assets/icons/empty.svg';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export type NotFoundIndicatorProps = {
  header: string;
  subtitle?: string;
};

const NotFoundIndicator = ({ header, subtitle }: NotFoundIndicatorProps) => {
  return (
    <Root>
      <img alt={header} height={100} loading='lazy' src={NotFoundIcon} />
      <Typography align='center' sx={{ m: (theme) => theme.spacing(1) }} variant='h3'>
        {header}
      </Typography>
      {subtitle && (
        <Typography align='center' variant='subtitle1'>
          {subtitle}
        </Typography>
      )}
    </Root>
  );
};

export default NotFoundIndicator;
