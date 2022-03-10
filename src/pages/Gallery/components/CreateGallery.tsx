import { Button } from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery, GalleryRequired } from 'types';

import { useCreateGallery } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import Dialog from 'components/layout/Dialog';

type FormValues = Omit<Gallery, 'slug'>;

const CreateGallery = () => {
  const { handleSubmit, register, watch, formState, setValue } = useForm<FormValues>();
  const createGallery = useCreateGallery();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const submit: SubmitHandler<FormValues> = async (data) => {
    const gallery = {
      ...data,
      slug: '_',
    } as GalleryRequired;
    await createGallery.mutate(gallery, {
      onSuccess: (data) => {
        showSnackbar('Galleriet ble lagt til', 'success');
        navigate(`${URLS.gallery}${data.slug}/`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <ImageUpload formState={formState} label='Velg display bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Bildetekst' {...register('image_alt')} />
        <SubmitButton formState={formState} sx={{ mt: 2 }}>
          Opprett nytt galleri
        </SubmitButton>
      </form>
    </>
  );
};

const CreateGalleryDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outlined'>
        Opprett nytt galleri
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Opprett nytt galleri'}>
        <CreateGallery />
      </Dialog>
    </>
  );
};

export default CreateGalleryDialog;
