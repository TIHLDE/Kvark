import { useRef, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import QRCodeStyling from 'qr-code-styling';
import LogoIcon from 'assets/img/logoIcon.png';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  QRCode: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));
export type QRCodeProps = {
  value: string;
  width: number;
  height: number;
};

const QRCode = ({ value, height, width }: QRCodeProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const qrCodeColor = theme.palette.type === 'light' ? theme.palette.colors.tihlde : theme.palette.common.white;
  const qrCode = new QRCodeStyling({
    height: height,
    width: width,
    data: value,
    image: LogoIcon,
    qrOptions: {
      typeNumber: 4,
      mode: 'Byte',
      errorCorrectionLevel: 'Q',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.6,
      margin: 11,
    },
    backgroundOptions: {
      color: theme.palette.background.paper,
    },
    dotsOptions: {
      type: 'extra-rounded',
      color: qrCodeColor,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: qrCodeColor,
    },
  });
  const ref = useRef(null);
  useEffect(() => {
    qrCode.append(ref.current || undefined);
  }, []);
  return <div className={classes.QRCode} ref={ref} />;
};
export default QRCode;
