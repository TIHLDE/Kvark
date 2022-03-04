import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box, IconButton } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Gallery, GalleryRequired } from 'types';

import { useAlbumsById, useDeleteAlbum, useUpdateAlbum } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
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
  const { data } = useAlbumsById(slug);
  const editGallery = useUpdateAlbum(slug);
  const deleteGallery = useDeleteAlbum(slug);
  const showSnackbar = useSnackbar();
  const { handleSubmit, register, formState, reset } = useForm<FormValues>();
  const setValues = useCallback(
    (newValues: Gallery | null) => {
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

  const remove = async () => {
    deleteGallery.mutate(null, {
      onSuccess: () => {
        showSnackbar('Slettet', 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const Album = {
      ...data,
      image: data.image,
      title: data.title,
      image_alt: data.image_alt,
      description: data.description,
    } as GalleryRequired;
    await editGallery.mutate(Album, {
      onSuccess: () => {
        showSnackbar('Albumet ble oppdatert', 'success');
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
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <TextField formState={formState} label='Tittel' {...register('title')} />
        <TextField formState={formState} label='Beskrivelse' {...register('description')} />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt')} />
        <input hidden value={data?.image} {...register('image')} />
        <SubmitButton className={classes.margin} formState={formState}>
          Oppdater
        </SubmitButton>
        <VerifyDialog
          closeText='Ikke slett albumet'
          color='error'
          contentText='Sletting av album kan ikke reverseres.'
          onConfirm={remove}
          titleText='Er du sikker?'>
          Slett
        </VerifyDialog>
      </form>
    </Box>
  );
};

const GalleryEditorDialog = ({ slug }: GalleryEditorProps) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <EditRoundedIcon />
      </IconButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Rediger album'}>
        <GalleryEditor slug={slug} />
      </Dialog>
    </Box>
  );
};

export default GalleryEditorDialog;
