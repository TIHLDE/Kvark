import { lazy, Suspense } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useTheme, Skeleton } from '@material-ui/core';
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
  background?: 'default' | 'paper';
  className?: string;
};

const QRCode = ({ value, background = 'default', className }: QRCodeProps) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Suspense fallback={<Skeleton className={classnames(classes.qrcode, classes.skeleton, className)} />}>
      <QR
        bgColor={theme.palette.background[background === 'default' ? 'default' : 'paper']}
        className={classnames(classes.qrcode, className)}
        fgColor={theme.palette.mode === 'light' ? theme.palette.colors.tihlde : theme.palette.text.primary}
        size={1000}
        value={value}
      />
    </Suspense>
  );
};
export default QRCode;
