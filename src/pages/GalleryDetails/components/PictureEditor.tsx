import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Gallery, Picture } from 'types';

import { useDeletePicture, usePictureById, useUpdatePicture } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';
import VerifyDialog from 'components/layout/VerifyDialog';

type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

export type PictureEditorDialogProps = {
  pictureId: Picture['id'];
  gallerySlug: Gallery['slug'];
  onClose: () => void;
};

const PictureEditorDialog = ({ gallerySlug, pictureId, onClose }: PictureEditorDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data } = usePictureById(gallerySlug, pictureId);
  const editPicture = useUpdatePicture(gallerySlug, pictureId);
  const deletePicture = useDeletePicture(gallerySlug, pictureId);
  const showSnackbar = useSnackbar();
  const { handleSubmit, register, formState, reset } = useForm<FormValues>();
  const setValues = useCallback(
    (newValues: Picture | null) => {
      reset({
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
    deletePicture.mutate(null, {
      onSuccess: () => {
        showSnackbar('Bildet ble slettet', 'success');
        setOpen(false);
        onClose();
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  const submit: SubmitHandler<FormValues> = async (data) =>
    editPicture.mutate(data, {
      onSuccess: () => {
        showSnackbar('Bildet ble oppdatert', 'success');
        setOpen(false);
      },
      onError: (e) => showSnackbar(e.detail, 'error'),
    });

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditRoundedIcon />
      </IconButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText='Rediger bilde'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField formState={formState} label='Tittel' {...register('title')} />
          <TextField formState={formState} inputProps={{ maxLength: 100 }} label='Beskrivelse' {...register('description')} />
          <TextField formState={formState} label='Bildetekst' {...register('image_alt')} />
          <input hidden value={data?.image} {...register('image')} />
          <SubmitButton formState={formState} sx={{ my: 2 }}>
            Oppdater bilde
          </SubmitButton>
          <VerifyDialog closeText='Avbryt' color='error' contentText='Fjerning av bilder kan ikke reverseres.' onConfirm={remove}>
            Fjern bilde fra galleri
          </VerifyDialog>
        </form>
      </Dialog>
    </>
  );
};

export default PictureEditorDialog;
