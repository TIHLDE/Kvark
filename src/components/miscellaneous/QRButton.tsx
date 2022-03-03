import QrCodeIcon from '@mui/icons-material/QrCodeRounded';
import { Button, ButtonProps, Skeleton, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { lazy, Suspense, useState } from 'react';

import { useAnalytics } from 'hooks/Utils';

import Dialog from 'components/layout/Dialog';

const QR = lazy(() => import('qrcode.react'));

const useStyles = makeStyles()((theme) => ({
  qrcode: {
    padding: theme.spacing(4, 3),
    display: 'block',
    margin: '0 auto',
    height: 'auto !important',
    width: '100% !important',
    maxHeight: 350,
    objectFit: 'contain',
  },
  skeleton: {
    height: '250px !important',
  },
}));

export type QRCodeProps = {
  value: string;
  className?: string;
};

const QRCode = ({ value, className }: QRCodeProps) => {
  const { classes, cx } = useStyles();
  const theme = useTheme();
  return (
    <Suspense fallback={<Skeleton className={cx(classes.qrcode, classes.skeleton, className)} />}>
      <QR bgColor={theme.palette.common.white} className={cx(classes.qrcode, className)} fgColor={theme.palette.common.black} size={1000} value={value} />
    </Suspense>
  );
};

export type QRButtonProps = ButtonProps & {
  qrValue: string;
  subtitle?: string;
};

const QRButton = ({ qrValue, subtitle, children, ...props }: QRButtonProps) => {
  const [showQR, setShowQR] = useState(false);
  const theme = useTheme();
  const { event } = useAnalytics();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const openQR = () => {
    event('open-QR', 'profile', 'Open');
    setShowQR((prev) => !prev);
  };

  const QRDialog = styled(Dialog)({
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.common.white,
    },
  });

  return (
    <>
      <Button endIcon={<QrCodeIcon />} variant='outlined' {...props} onClick={openQR}>
        {children}
      </Button>
      <QRDialog fullScreen={lgDown} onClose={() => setShowQR(false)} open={showQR}>
        <QRCode value={qrValue} />
        {subtitle && (
          <Typography align='center' sx={{ my: 0.25, color: (theme) => theme.palette.common.black }} variant='h3'>
            {subtitle}
          </Typography>
        )}
      </QRDialog>
    </>
  );
};

export default QRButton;
