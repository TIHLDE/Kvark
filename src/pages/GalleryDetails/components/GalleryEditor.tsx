import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery } from 'types';

import { useDeleteGallery, useGalleryById, useUpdateGallery } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';
import VerifyDialog from 'components/layout/VerifyDialog';

export type GalleryEditorProps = {
  id: Gallery['id'];
};

type FormValues = Omit<Gallery, 'id' | 'slug'>;

const GalleryEditor = ({ id }: GalleryEditorProps) => {
  const { data } = useGalleryById(id);
  const editGallery = useUpdateGallery(id);
  const deleteGallery = useDeleteGallery(id);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const { handleSubmit, register, formState, reset, watch, setValue } = useForm<FormValues>();
  const setValues = useCallback(
    (newValues: Gallery | null) => {
      reset({
        image: newValues?.image || '',
        title: newValues?.title || '',
        description: newValues?.description || '',
        image_alt: newValues?.image_alt || '',
      });
    },
    [reset],
  );

  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  const remove = async () =>
    deleteGallery.mutate(null, {
      onSuccess: () => {
        showSnackbar('Galleriet ble slettet', 'success');
        navigate(URLS.gallery);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const submit: SubmitHandler<FormValues> = async (data) => {
    await editGallery.mutate(
      { ...data, slug: '_', id },
      {
        onSuccess: () => {
          showSnackbar('Galleriet ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <TextField formState={formState} label='Tittel' {...register('title')} />
      <TextField formState={formState} label='Beskrivelse' {...register('description')} />
      <ImageUpload formState={formState} label='Trykk for å velge bilde eller dra bilde over' register={register('image')} setValue={setValue} watch={watch} />
      <TextField formState={formState} label='Bildetekst' {...register('image_alt')} />
      <SubmitButton formState={formState} sx={{ my: 2 }}>
        Oppdater galleri
      </SubmitButton>
      <VerifyDialog closeText='Avbryt' color='error' contentText='Sletting av galleri kan ikke reverseres.' onConfirm={remove}>
        Slett galleri
      </VerifyDialog>
    </form>
  );
};

const GalleryEditorDialog = ({ id }: GalleryEditorProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <BannerButton endIcon={<EditRoundedIcon />} onClick={() => setOpen(true)} variant='outlined'>
        Rediger galleri
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText='Rediger galleri'>
        <GalleryEditor id={id} />
      </Dialog>
    </>
  );
};

export default GalleryEditorDialog;
