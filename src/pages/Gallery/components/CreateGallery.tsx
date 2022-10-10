import AddRounded from '@mui/icons-material/AddRounded';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery, GalleryCreate } from 'types';

import { useCreateGallery } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

type FormValues = Omit<Gallery, 'id' | 'slug'>;

const CreateGallery = () => {
  const { handleSubmit, register, watch, formState, setValue } = useForm<FormValues>();
  const createGallery = useCreateGallery();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const submit: SubmitHandler<FormValues> = async (data) => {
    const gallery = {
      ...data,
      slug: '_',
    } as GalleryCreate;
    await createGallery.mutate(gallery, {
      onSuccess: (data) => {
        showSnackbar('Galleriet ble lagt til', 'success');
        navigate(`${URLS.gallery}${data.id}/`);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi galleriet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description')} />
        <ImageUpload formState={formState} label='Cover-bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Bildetekst' {...register('image_alt')} />
        <SubmitButton formState={formState} sx={{ mt: 2 }}>
          Opprett galleri
        </SubmitButton>
      </form>
    </>
  );
};

const CreateGalleryDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <BannerButton endIcon={<AddRounded />} onClick={() => setOpen(true)} variant='outlined'>
        Nytt galleri
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText='Nytt galleri'>
        <CreateGallery />
      </Dialog>
    </>
  );
};

export default CreateGalleryDialog;
