import MuiQrCodeIcon from '@mui/icons-material/QrCodeRounded';
import { ButtonProps, Button as MuiButton, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { QrCodeIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

import MuiDialog from 'components/layout/Dialog';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog';

const Qr = styled(QRCodeCanvas)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  display: 'block',
  margin: '0 auto',
  height: 'auto !important',
  width: '100% !important',
  maxHeight: 350,
  objectFit: 'contain',
}));

export type QRButtonProps = ButtonProps & {
  qrValue: string;
  subtitle?: string;
};

const QRButton = ({ qrValue, subtitle, children, ...props }: QRButtonProps) => {
  const [showQR, setShowQR] = useState(false);
  const theme = useTheme();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <MuiButton endIcon={<MuiQrCodeIcon />} variant='outlined' {...props} onClick={() => setShowQR(true)}>
        {children}
      </MuiButton>
      <MuiDialog
        fullScreen={lgDown}
        onClose={() => setShowQR(false)}
        open={showQR}
        sx={{ '& .MuiPaper-root': { backgroundColor: (theme) => theme.palette.common.white } }}>
        <Qr bgColor={theme.palette.common.white} fgColor={theme.palette.common.black} size={1000} value={qrValue} />
        {subtitle && (
          <Typography align='center' sx={{ my: 0.25, color: (theme) => theme.palette.common.black }} variant='h3'>
            {subtitle}
          </Typography>
        )}
      </MuiDialog>
    </>
  );
};

export const ShadQRButton = ({ qrValue, subtitle, children }: QRButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full md:w-auto' size='lg' variant='outline'>
          <QrCodeIcon className='mr-2 h-4 w-4' /> {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <QRCodeCanvas className='block !h-auto !w-full max-h-[350px] mx-auto object-contain' size={1000} value={qrValue} />
        {subtitle && <h1 className='text-center my-1 text-xl'>{subtitle}</h1>}
      </DialogContent>
    </Dialog>
  );
};

export default QRButton;
