import { Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { QRCode } from 'types';

import { useCreateQRCode, useQRCodes } from 'hooks/QRCode';
import { useSnackbar } from 'hooks/Snackbar';
import { useAnalytics } from 'hooks/Utils';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

import QRCodeItem from './components/QRCodeItem';

const QRCodes = () => {
  const { event } = useAnalytics();
  const { data, error, isFetching } = useQRCodes();
  const createQRCode = useCreateQRCode();
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, reset } = useForm<QRCode>();

  const create = (data: QRCode) => {
    createQRCode.mutate(data, {
      onSuccess: () => {
        showSnackbar('QR koden ble opprettet', 'success');
        reset();
        event('create', 'qr-code', `Created ${data.name}`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Page banner={<Banner text='Opprett, se og slett dine QR koder' title='QR-koder' />} options={{ title: 'QR koder' }}>
      <Stack direction={{ xs: 'column-reverse', lg: 'row' }} gap={1} sx={{ mt: { xs: 1, lg: 2 } }}>
        <Grid columns={{ xs: 1, sm: 2 }} container gap={2} sx={{ mb: 2, justifyContent: { xs: 'center', md: 'start' } }}>
          {error && <Paper>{error.detail}</Paper>}
          {data !== undefined && (
            <>
              {!data.length && <NotFoundIndicator header='Fant ingen QR koder' />}
              {data.map((qrCode) => (
                <QRCodeItem key={qrCode.id} qrCode={qrCode} />
              ))}
            </>
          )}
        </Grid>

        <Paper sx={{ alignSelf: 'start', mb: { xs: 1 } }}>
          <form onSubmit={handleSubmit(create)}>
            <Typography variant='h2'>Ny QR kode</Typography>
            <TextField disabled={isFetching} formState={formState} label='Navn' {...register('name', { required: 'Navn må fylles ut' })} required />
            <TextField
              disabled={isFetching}
              formState={formState}
              label='Innhold'
              {...register('content', {
                required: 'Du må oppgi tekst eller en link',
              })}
              required
            />
            <SubmitButton disabled={isFetching} formState={formState}>
              Opprett
            </SubmitButton>
          </form>
        </Paper>
      </Stack>
    </Page>
  );
};

export default QRCodes;
