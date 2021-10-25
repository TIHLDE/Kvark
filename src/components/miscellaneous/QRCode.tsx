import { lazy, Suspense } from 'react';
import { makeStyles } from '@mui/styles';
import { Skeleton, useTheme } from '@mui/material';
import classnames from 'classnames';

const QR = lazy(() => import('qrcode.react'));

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Suspense fallback={<Skeleton className={classnames(classes.qrcode, classes.skeleton, className)} />}>
      <QR
        bgColor={theme.palette.common.white}
        className={classnames(classes.qrcode, className)}
        fgColor={theme.palette.common.black}
        size={1000}
        value={value}
      />
    </Suspense>
  );
};
export default QRCode;
