import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import { Box, Button, IconButton, Typography } from '@mui/material';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Banner from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';
import { useCreateQRCode, useDeleteQRCode, useQRCodes } from 'hooks/QRCode';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics } from 'hooks/Utils';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { QRCode } from 'types';


const useStyles = makeStyles()((theme) => ({
    grid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridGap: theme.spacing(2),
      alignItems: 'self-start',
      paddingBottom: theme.spacing(2),
  
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
      },
    },
    list: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(2),
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        order: 1,
      },
    },
    create: {
      display: 'grid',
      gridGap: theme.spacing(2),
      position: 'sticky',
      top: 80,
  
      [theme.breakpoints.down('lg')]: {
        order: 0,
        position: 'static',
        top: 0,
      },
    },
    adornment: {
      marginRight: 0,
    },
    qrCode: {
      padding: theme.spacing(2, 3),
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    header: {
      margin: 'auto 0',
    },
  }));


const QRCodeItem = ({ qrCode }: { qrCode: QRCode }) => {
    const { classes } = useStyles();
    const { event } = useAnalytics();
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const deleteQRCode = useDeleteQRCode();
    const showSnackbar = useSnackbar();

    const remove = () => {
        deleteQRCode.mutate(qrCode.id, {
          onSuccess: () => {
            showSnackbar('QR koden ble slettet', 'success');
            event('delete', 'qr-code', `Delete ${qrCode.name}`);
          },
          onError: (e) => {
            const msg: { name: Array<string>; url: Array<string> } = typeof e.detail === 'string' ? JSON.parse(e.detail) : e.detail;
    
            if (msg.name.length > 0) {
              showSnackbar(msg.name[0], 'error');
            } else {
              showSnackbar('Kunne ikke slette QR koden', 'error');
            }
          },
        });
    };

    return (
        <Paper className={classes.qrCode}>
            <div className={classes.row}>
                <Typography
                    className={classes.header}
                    variant='h3'
                >
                    { qrCode.name }
                </Typography>
                <IconButton color='primary' onClick={() => {}}>
                    <FileDownloadIcon />
                </IconButton>
            </div>
            <Box 
                component='img'
                alt='QR kode'
                src={qrCode.image}
                loading='lazy'
                sx={{ objectFit: 'contain', px: 1, width: 200, height: 200 }}
            />
            <Button color='error' endIcon={<DeleteIcon />} fullWidth onClick={() => setRemoveDialogOpen(true)}>
                Slett link
            </Button>
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
}


const QRCodes = () => {
    const { classes } = useStyles();
    const { event } = useAnalytics();
    const { data, error, isFetching } = useQRCodes();
    const createQRCode = useCreateQRCode();
    const showSnackbar = useSnackbar();
    const { register, formState, handleSubmit, setError, reset } = useForm<QRCode>();

    const create = (data: QRCode) => {
        createQRCode.mutate(data, {
          onSuccess: () => {
            showSnackbar('QR koden ble opprettet', 'success');
            reset();
            event('create', 'qr-code', `Created ${data.name}`);
          },
          onError: (e) => {
            const msg: { name: Array<string>; url: Array<string> } = typeof e.detail === 'string' ? JSON.parse(e.detail) : e.detail;
    
            if (msg.name.length > 0) {
              setError('name', { message: msg.name[0] });
            } else {
              showSnackbar('En ukjent feil oppstod', 'error');
            }
          },
        });
    };

    return (
        <Page
            banner={<Banner title='QR-koder' text='Opprett, se og slett dine QR koder' />} 
            options={{ title: 'QR koder' }}
        >
            <div className={classes.grid}>
                <div className={classes.list}>
                    {error && <Paper>{error.detail}</Paper>}
                    {data !== undefined && (
                        <>
                            {!data.length && <NotFoundIndicator header='Fant ingen QR koder' />}
                            {data.map((qrCode) => (
                                <QRCodeItem key={qrCode.id} qrCode={qrCode} />
                            ))}
                        </>
                    )}
                </div>

                <div className={classes.create}>
                    <Paper>
                        <form onSubmit={handleSubmit(create)}>
                            <Typography variant='h2'>
                                Ny QR kode
                            </Typography>
                            <TextField 
                                disabled={isFetching}
                                formState={formState}
                                label='Navn'
                                {...register('name', { required: 'Navn må fylles ut' })}
                                required
                            />
                            <TextField 
                                disabled={isFetching}
                                formState={formState}
                                label='URL'
                                {...register('url', { required: 'Du må oppgi en link' })}
                                required
                            />
                            <SubmitButton
                                disabled={isFetching}
                                formState={formState}
                            >
                                Opprett
                            </SubmitButton>
                        </form>
                    </Paper>
                </div>
            </div>
        </Page>
    );
}


export default QRCodes;