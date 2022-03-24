import MenuIcon from '@mui/icons-material/MoreVertRounded';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import { formatISO9075, parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from 'utils';

import { Toddel, ToddelMutate } from 'types';
import { PermissionApp } from 'types/Enums';

import { useSnackbar } from 'hooks/Snackbar';
import { useDeleteToddel, useUpdateToddel } from 'hooks/Toddel';
import { HavePermission } from 'hooks/User';

import DatePicker from 'components/inputs/DatePicker';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { FormFileUpload, ImageUpload } from 'components/inputs/Upload';
import Dialog from 'components/layout/Dialog';
import Paper from 'components/layout/Paper';
import VerifyDialog from 'components/layout/VerifyDialog';

export type ToddelListItemProps = {
  toddel: Toddel;
};

const ToddelListItem = ({ toddel }: ToddelListItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateToddel = useUpdateToddel(toddel.edition);
  const deleteToddel = useDeleteToddel(toddel.edition);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, control, setValue, watch } = useForm<ToddelMutate>({ defaultValues: toddel });

  const submit = (data: ToddelMutate) =>
    updateToddel.mutate(
      {
        ...data,
        published_at: formatISO9075(typeof data.published_at === 'string' ? parseISO(data.published_at) : (data.published_at as unknown as Date), {
          representation: 'date',
        }),
      },
      {
        onSuccess: () => {
          showSnackbar('Publikasjonen ble oppdatert', 'success');
          setDialogOpen(false);
        },
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );

  const remove = () =>
    deleteToddel.mutate(undefined, {
      onSuccess: () => {
        showSnackbar('Publikasjonen ble slettet', 'success');
        setDialogOpen(false);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <Stack component={Paper} gap={1} noOverflow sx={{ p: 0 }}>
      <Stack direction='row' gap={1} sx={{ p: 1, pl: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Stack>
          <Typography variant='h2'>{toddel.title}</Typography>
          <Typography variant='caption'>
            Utgave {toddel.edition} - Publisert {formatDate(parseISO(toddel.published_at), { time: false, capitalizeFirstLetter: false, fullDayOfWeek: true })}
          </Typography>
        </Stack>
        <HavePermission apps={[PermissionApp.TODDEL]}>
          <IconButton aria-label='Endre publikasjon' onClick={() => setDialogOpen(true)}>
            <MenuIcon />
          </IconButton>
        </HavePermission>
      </Stack>
      <ButtonBase component='a' focusRipple href={toddel.pdf} target='_blank'>
        <Box alt={toddel.title} component='img' src={toddel.image} sx={{ objectFit: 'contain', width: '100%' }} />
      </ButtonBase>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Endre publikasjon'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi publikasjonen en tittel' })} required />
          <DatePicker
            control={control}
            formState={formState}
            fullWidth
            label='Utgivelsesdato'
            name='published_at'
            required
            rules={{ required: 'En utgivelsesdato er påkrevd' }}
            type='date'
          />
          <ImageUpload
            formState={formState}
            label='Velg bilde *'
            paperProps={{ sx: { mb: 2, mt: 1 } }}
            register={register('image', { required: 'Gi publikasjonen et visningsbilde til nettsiden' })}
            setValue={setValue}
            watch={watch}
          />
          <FormFileUpload
            accept='application/pdf'
            formState={formState}
            label='Velg publikasjon (pdf) *'
            paperProps={{ sx: { mb: 2 } }}
            register={register('pdf', { required: 'Du må laste opp publikasjonen (pdf)' })}
            setValue={setValue}
            watch={watch}
          />
          <SubmitButton formState={formState} sx={{ mb: 2 }}>
            Lagre
          </SubmitButton>
        </form>
        <VerifyDialog color='error' contentText='Publikasjonen vil slettes for alltid. Denne handlingen kan ikke angres.' onConfirm={remove}>
          Slett publikasjon
        </VerifyDialog>
      </Dialog>
    </Stack>
  );
};

export default ToddelListItem;

export const ToddelListItemLoading = () => (
  <Stack component={Paper} gap={1} noOverflow sx={{ p: 0 }}>
    <Stack gap={1} sx={{ p: 1, pl: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Typography sx={{ width: '100%' }} variant='h2'>
        <Skeleton width='80%' />
      </Typography>
      <Typography sx={{ width: '100%' }} variant='caption'>
        <Skeleton width='50%' />
      </Typography>
    </Stack>
    <Skeleton height={400} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} variant='rectangular' width='100%' />
  </Stack>
);
