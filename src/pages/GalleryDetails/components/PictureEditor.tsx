// React
import { useCallback, useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

// Material-UI
import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

// Hooks
import { useUpdatePicture, useDeletePicture, usePictureById } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

//Types
import { Picture, PictureRequired } from 'types';

// Components
import Dialog from 'components/layout/Dialog';
import { ImageUpload } from 'components/inputs/Upload';
import SubmitButton from 'components/inputs/SubmitButton';
import VerifyDialog from 'components/layout/VerifyDialog';
import TextField from 'components/inputs/TextField';

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
  const acceptedFileTypes = ['jpg', 'png'];
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const { handleSubmit, register, watch, formState, setValue, reset } = useForm<FormValues>();
  const setValues = useCallback(
    (newValues: Picture | null) => {
      reset({
        title: newValues?.title || '',
        image: newValues?.image || '',
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
      image: data.image,
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
        <Typography sx={{ fontSize: 40 }}>Rediger bildet</Typography>
        <TextField formState={formState} label='Tittel' {...register('title', { required: 'Gi bildet en tittel' })} required />
        <TextField formState={formState} label='Beskrivelse' {...register('description', { required: 'Gi bildet en beskrivelse' })} required />
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        <ImageUpload formState={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt', { required: 'Gi bildet en alt-tekst' })} required />
        <SubmitButton className={classes.margin} formState={formState}>
          Rediger
        </SubmitButton>
        <VerifyDialog
          closeText='Ikke slett arrangementet'
          color='error'
          contentText='Sletting av bildet kan ikke reverseres.'
          onConfirm={remove}
          titleText='Er du sikker?'>
          Slett
        </VerifyDialog>
      </form>
      <Dialog
        contentText={acceptedFileTypes.join(', ').toUpperCase()}
        onClose={() => setAcceptedFileTypesOpen(false)}
        open={acceptedFileTypesOpen}
        titleText='Godkjente filtyper'
      />
    </Box>
  );
};

const PictureEditorDialog = ({ slug, id }: PictureEditorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant='outlined'>
        Last opp et bilde
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <PictureEditor id={id} slug={slug} />
      </Dialog>
    </Box>
  );
};

export default PictureEditorDialog;
