import { Box, Button } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Picture, PictureRequired } from 'types';

import { useDeletePicture, usePictureById, useUpdatePicture } from 'hooks/Gallery';
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

type PictureEditorProps = {
  id: string;
  slug: string;
};

type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

const PictureEditor = ({ id, slug }: PictureEditorProps) => {
  const { classes } = useStyles();
  const { data } = usePictureById(slug, id);
  const editPicture = useUpdatePicture(slug, id);
  const deletePicture = useDeletePicture(slug, id);
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

  const remove = async () => {
    deletePicture.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const Image = {
      ...data,
      title: data.title,
      image_alt: data.image_alt,
      description: data.description,
    } as PictureRequired;
    await editPicture.mutate(Image, {
      onSuccess: () => {
        showSnackbar('Bildet ble lastet opp', 'success');
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
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt', { required: 'Gi bildet en alt-tekst' })} required />
        <SubmitButton className={classes.margin} formState={formState}>
          Rediger
        </SubmitButton>
        <VerifyDialog
          closeText='Ikke slett bildet'
          color='error'
          contentText='Sletting av bilder kan ikke reverseres.'
          onConfirm={remove}
          titleText='Er du sikker?'>
          Slett
        </VerifyDialog>
      </form>
    </Box>
  );
};

const PictureEditorDialog = ({ slug, id }: PictureEditorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant='outlined'>
        Rediger
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Rediger bilde'}>
        <PictureEditor id={id} slug={slug} />
      </Dialog>
    </Box>
  );
};

export default PictureEditorDialog;
