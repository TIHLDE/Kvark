import { Button } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Picture, PictureRequired } from 'types';

import { useCreatePicture } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles()((theme) => ({
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

type FormValues = Omit<Picture, 'id' | 'created_at' | 'updated_at'>;

type PictureUploadProps = {
  slug: string;
};

const PictureUpload = ({ slug }: PictureUploadProps) => {
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const { handleSubmit, register, watch, formState, setValue } = useForm<FormValues>();
  const acceptedFileTypes = ['jpg', 'png'];
  const createImage = useCreatePicture(slug);
  const { classes } = useStyles();
  const showSnackbar = useSnackbar();

  const submit: SubmitHandler<FormValues> = async (data) => {
    const Image = {
      ...data,
      title: data.title,
      image_alt: data.image_alt,
      description: data.description,
      image: data.image,
    } as PictureRequired;
    await createImage.mutate([Image], {
      onSuccess: () => {
        showSnackbar('Bildet ble lastet opp', 'success');
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
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        <ImageUpload formState={formState} label='Velg bilde' register={register('image')} setValue={setValue} watch={watch} />
        <TextField formState={formState} label='Alt-tekst' {...register('image_alt', { required: 'Gi bildet en alt-tekst' })} required />
        <SubmitButton className={classes.margin} formState={formState}>
          Legg til bildet
        </SubmitButton>
      </form>
      <Dialog
        contentText={acceptedFileTypes.join(', ').toUpperCase()}
        onClose={() => setAcceptedFileTypesOpen(false)}
        open={acceptedFileTypesOpen}
        titleText='Godkjente filtyper'
      />
    </>
  );
};

const PictureUploadDialog = ({ slug }: PictureUploadProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <BannerButton onClick={() => setOpen(true)} variant='outlined'>
        Last opp et bilde
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Last opp bilde'}>
        <PictureUpload slug={slug} />
      </Dialog>
    </>
  );
};

export default PictureUploadDialog;
