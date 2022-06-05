import { UploadRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';

import { Gallery } from 'types';

import { useUploadPictures } from 'hooks/Gallery';
import { useSnackbar } from 'hooks/Snackbar';

import FileUploader from 'components/inputs/FileUploader';
import { BannerButton } from 'components/layout/Banner';
import Dialog from 'components/layout/Dialog';

export type PictureUploadProps = {
  slug: Gallery['slug'];
};

const PictureUpload = ({ slug }: PictureUploadProps) => {
  const [open, setOpen] = useState(false);
  const upload = useUploadPictures(slug);
  const [files, setFiles] = useState<File[]>([]);
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
          setFiles([]);
        },
        onError: (error) => showSnackbar(error.detail, 'error'),
      },
    );
  };

  return (
    <>
      <BannerButton endIcon={<UploadRounded />} onClick={() => setOpen(true)} variant='outlined'>
        Legg til bilder
      </BannerButton>
      <Dialog onClose={() => setOpen(false)} open={open} titleText={'Last opp bilde'}>
        <FileUploader files={files} fileTypes={{ 'image/jpeg': ['.jpeg'], 'image/png': ['.png'] }} setFiles={setFiles} title='Last opp eller dra bilder hit.' />
        <Button disabled={files.length < 1 || upload.isLoading} fullWidth onClick={submit} sx={{ mt: 2 }} variant='contained'>
          Last opp bilder
        </Button>
      </Dialog>
    </>
  );
};
export default PictureUpload;
