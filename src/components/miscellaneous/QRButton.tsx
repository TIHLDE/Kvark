import { useState } from 'react';

// Material UI Components
import { Button, ButtonProps, styled, useMediaQuery, Theme } from '@mui/material';

// Project components
import Dialog, { DialogProps } from 'components/layout/Dialog';
import QRCode from 'components/miscellaneous/QRCode';

// Icons
import QrCodeIcon from '@mui/icons-material/QrCodeRounded';

export type QRButtonProps = ButtonProps &
  Pick<DialogProps, 'closeText'> & {
    qrValue: string;
  };

const QRDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    backgroundColor: 'white',
  },
});

const QRButton = ({ qrValue, children, ...props }: QRButtonProps) => {
  const [showQR, setShowQR] = useState(false);
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Button endIcon={<QrCodeIcon />} sx={{ minWidth: 250 }} variant='outlined' {...props} onClick={() => setShowQR((prev) => !prev)}>
        {children}
      </Button>
      <QRDialog fullScreen={lgDown} onClose={() => setShowQR(false)} open={showQR}>
        <QRCode background='paper' value={qrValue} />
      </QRDialog>
    </>
  );
};

export default QRButton;
