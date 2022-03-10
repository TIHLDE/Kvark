import { Button } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useState } from 'react';

import { useUploadPictures } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import FileUploader from 'components/inputs/FileUploader';
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
      <Button onClick={() => setOpen(true)} variant='outlined'>
        Last opp bilder
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Last opp bilde'}>
        <FileUploader files={files} fileTypes={['image/jpeg', 'image/png']} setFiles={setFiles} title='Last opp eller dra bilder hit.' />
        <Button className={classes.margin} disabled={files.length < 1 || upload.isLoading} fullWidth onClick={submit} variant='contained'>
          Last opp bilder
        </Button>
      </Dialog>
    </>
  );
};
export default PictureUpload;
