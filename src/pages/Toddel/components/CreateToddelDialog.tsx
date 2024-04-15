import AddIcon from '@mui/icons-material/AddRounded';
import { formatISO9075, parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ToddelMutate } from 'types';

import { useSnackbar } from 'hooks/Snackbar';
import { useCreateToddel } from 'hooks/Toddel';

import DatePicker from 'components/inputs/DatePicker';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { FormFileUpload, ImageUpload } from 'components/inputs/Upload';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

const CreateToddelDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createToddel = useCreateToddel();
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, control, setValue, watch, reset } = useForm<ToddelMutate>();

  const submit = (data: ToddelMutate) =>
    createToddel.mutate(
      {
        ...data,
        published_at: formatISO9075(typeof data.published_at === 'string' ? parseISO(data.published_at) : (data.published_at as unknown as Date), {
          representation: 'date',
        }),
      },
      {
        onSuccess: () => {
          showSnackbar('Publikasjonen ble opprettet', 'success');
          setDialogOpen(false);
          reset();
        },
        onError: (e) => showSnackbar(e.detail, 'error'),
      },
    );

  return (
    <>
      <BannerButton onClick={() => setDialogOpen(true)} startIcon={<AddIcon />} variant='outlined'>
        Ny publikasjon
      </BannerButton>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen} titleText='Ny publikasjon'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            formState={formState}
            InputLabelProps={{ shrink: true }}
            inputProps={{ inputMode: 'numeric' }}
            label='Utgave'
            {...register('edition', {
              // TODO: Fix type
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              pattern: { value: RegExp(/^[0-9]*$/), message: 'Skriv inn et heltall som 0 eller høyere' },
              valueAsNumber: true,
              min: { value: 0, message: 'Utgaven må være over 0' },
              required: 'Du må gi publikasjonen et utgave-nummer',
            })}
            required
          />
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
          <SubmitButton formState={formState}>Opprett publikasjon</SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default CreateToddelDialog;
