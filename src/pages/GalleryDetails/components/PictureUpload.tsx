import { Button } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';

import { useUploadPictures } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import FileUploader from 'components/inputs/FileUploader';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

const useStyles = makeStyles()((theme) => ({
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

type PictureUploadProps = {
  slug: string;
};

const PictureUpload = ({ slug }: PictureUploadProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const acceptedFileTypes = ['jpg', 'png'];
  const upload = useUploadPictures(slug);
  const [files, setFiles] = useState<File[]>([]);
  const { classes } = useStyles();
  const showSnackbar = useSnackbar();

  const submit = () => {
    if (upload.isLoading || !files) {
      return;
    }
    upload.mutate(
      { files },
      {
        onSuccess: (data) => {
          showSnackbar(data.detail, 'success');
          setOpen(false);
        },
        onError: (error) => showSnackbar(error.detail, 'error'),
      },
    );
  };

  return (
    <>
      <BannerButton onClick={() => setOpen(true)} variant='outlined'>
        Last opp et bilde
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Last opp bilde'}>
        <Button onClick={() => setAcceptedFileTypesOpen(true)} sx={{ mb: 2, width: '100%' }} variant='outlined'>
          Tillatte Filtyper
        </Button>
        <FileUploader files={files} fileTypes={['image/jpeg', 'image/png']} setFiles={setFiles} title='Last opp eller dra bilder hit.' />
        <Button className={classes.margin} disabled={files.length < 1 || upload.isLoading} fullWidth onClick={submit} variant='contained'>
          Last opp bilder
        </Button>
        <Dialog
          contentText={acceptedFileTypes.join(', ').toUpperCase()}
          onClose={() => setAcceptedFileTypesOpen(false)}
          open={acceptedFileTypesOpen}
          titleText='Godkjente filtyper'
        />
      </Dialog>
    </>
  );
};
export default PictureUpload;
