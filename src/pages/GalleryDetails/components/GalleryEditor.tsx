import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery } from 'types';

import { useDeleteGallery, useGalleriesById, useUpdateGallery } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import Dialog from 'components/layout/Dialog';
import VerifyDialog from 'components/layout/VerifyDialog';

const useStyles = makeStyles()((theme) => ({
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

type GalleryEditorProps = {
  slug: string;
};

type FormValues = Omit<Gallery, 'id' | 'created_at' | 'updated_at'>;

const GalleryEditor = ({ slug }: GalleryEditorProps) => {
  const { classes } = useStyles();
  const { data } = useGalleriesById(slug);
  const editGallery = useUpdateGallery(slug);
  const deleteGallery = useDeleteGallery(slug);
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

  const remove = async () => {
    deleteGallery.mutate(null, {
      onSuccess: () => {
        showSnackbar('Galleriet ble slettet', 'success');
        navigate(URLS.gallery);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    await editGallery.mutate(data, {
      onSuccess: () => {
        showSnackbar('Galleriet ble oppdatert', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  useEffect(() => {
    setValues(data || null);
  }, [data, setValues]);

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <TextField formState={formState} label='Tittel' {...register('title')} />
        <TextField formState={formState} label='Beskrivelse' {...register('description')} />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt')} />
        <ImageUpload formState={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
        <SubmitButton className={classes.margin} formState={formState}>
          Oppdater
        </SubmitButton>
        <VerifyDialog
          closeText='Ikke slett galleriet'
          color='error'
          contentText='Sletting av galleri kan ikke reverseres.'
          onConfirm={remove}
          titleText='Er du sikker?'>
          Slett
        </VerifyDialog>
      </form>
    </>
  );
};

const GalleryEditorDialog = ({ slug }: GalleryEditorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditRoundedIcon />
      </IconButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Rediger galleri'}>
        <GalleryEditor slug={slug} />
      </Dialog>
    </>
  );
};

export default GalleryEditorDialog;
