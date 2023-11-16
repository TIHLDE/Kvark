import DeleteIcon from '@mui/icons-material/DeleteRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, Typography } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

import { QRCode } from 'types';

import { useDeleteQRCode } from 'hooks/QRCode';
import { useSnackbar } from 'hooks/Snackbar';

import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';

const QRCodeItem = (qrCode: QRCode) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const deleteQRCode = useDeleteQRCode(qrCode.id || -1);
  const showSnackbar = useSnackbar();

  const remove = async () => {
    deleteQRCode.mutate(null, {
      onSuccess: () => {
        showSnackbar('QR koden ble slettet', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const download = () => {
    const canvas = document.getElementById(qrCode.id.toString()) as HTMLCanvasElement | null;

    if (canvas) {
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');

      link.download = `${qrCode.name}.png`;

      link.href = image;

      link.click();
    }
  };

  return (
    <Paper>
      <Typography align='center' variant='h3'>
        {qrCode.name}
      </Typography>
      <Box
        padding={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}>
        <QRCodeCanvas id={qrCode.id.toString()} size={256} value={qrCode.content} />
      </Box>
      <div>
        <Button endIcon={<FileDownloadIcon />} fullWidth onClick={download}>
          Last ned
        </Button>
        <Button color='error' endIcon={<DeleteIcon />} fullWidth onClick={() => setRemoveDialogOpen(true)}>
          Slett QR kode
        </Button>
      </div>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Denne QR koden vil ikke lenger være tilgjenglig for deg selv og andre.'
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={remove}
        open={removeDialogOpen}
        titleText='Er du sikker?'
      />
    </Paper>
  );
};

export default QRCodeItem;
