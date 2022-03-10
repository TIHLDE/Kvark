import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton } from '@mui/material';
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
  editButton: {
    float: 'left',
    position: 'absolute',
    left: theme.spacing(2),
    top: theme.spacing(2),
    zIndex: 1000,
    bg: '#92AD40',
    p: '5px',
    color: 'white',
  },
}));

type PictureEditorProps = {
  id: string;
  slug: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

const PictureEditor = ({ id, slug, setOpen }: PictureEditorProps) => {
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
      onSuccess: () => {
        showSnackbar('Bildet ble slettet', 'success');
        setOpen(false);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const Image = {
      ...data,
      image: data.image,
      title: data.title,
      image_alt: data.image_alt,
      description: data.description,
    } as PictureRequired;
    await editPicture.mutate(Image, {
      onSuccess: () => {
        showSnackbar('Bildet ble redigert', 'success');
        setOpen(false);
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
        <input hidden value={data?.image} {...register('image')} />
        <SubmitButton className={classes.margin} formState={formState}>
          Oppdater
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
    </>
  );
};

type PictureEditorDialogProps = {
  id: string;
  slug: string;
};

const PictureEditorDialog = ({ slug, id }: PictureEditorDialogProps) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <IconButton className={classes.editButton} onClick={() => setOpen(true)}>
        <EditRoundedIcon />
      </IconButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Rediger bilde'}>
        <PictureEditor id={id} setOpen={setOpen} slug={slug} />
      </Dialog>
    </>
  );
};

export default PictureEditorDialog;
