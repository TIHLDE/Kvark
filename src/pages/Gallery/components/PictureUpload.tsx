// React
import { useState } from 'react';

// Material-UI
import { Box, Button, Input, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';

// Components
import Dialog from 'components/layout/Dialog';

// Service
import { validateFileSize, validateFileType } from './service/FileTypeValidatorService';
import FileService from './service/FileService';
import { Picture } from 'types';

const useStyles = makeStyles()((theme) => ({
  uploadInput: {
    display: 'grid',
    gridGap: theme.spacing(1),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
}));

const PictureUpload = () => {
  const [acceptedFileTypesOpen, setAcceptedFileTypesOpen] = useState<boolean>(false);
  const [uploadFormError, setUploadFormError] = useState<string>('');
  const acceptedFileTypes = ['jpg', 'png'];
  const { classes } = useStyles();
  const handleFileUpload = async (element: HTMLInputElement) => {
    setUploadFormError('');
    const file = element.files;

    if (file === null) {
      return;
    }

    const validFileSize = await validateFileSize(file[0].size);
    const validFileType = await validateFileType(FileService.getFileExtension(file[0].name));

    if (!validFileSize.isValid) {
      setUploadFormError(validFileSize.errorMessage);
    }

    if (!validFileType.isValid) {
      setUploadFormError(validFileType.errorMessage);
    }

    if (uploadFormError && validFileSize.isValid) {
      setUploadFormError('');
    }
  };

  return (
    <Box sx={{ m: '100px auto', padding: 2, width: '50%' }}>
      <Typography sx={{ mb: 4, fontSize: 40 }}>Last opp et bilde</Typography>
      <Button onClick={() => setAcceptedFileTypesOpen(true)} variant='outlined'>
        Tillatte Filtyper
      </Button>
      {uploadFormError && (
        <Typography color={'red'} mt={5}>
          {uploadFormError}
        </Typography>
      )}
      <Box ml={'24px'} mt={10}>
        <input className={classes.uploadInput} onChange={(e) => handleFileUpload(e.currentTarget as HTMLInputElement)} type={'file'} />
      </Box>
      <Dialog
        contentText={acceptedFileTypes.join(', ').toUpperCase()}
        onClose={() => setAcceptedFileTypesOpen(false)}
        open={acceptedFileTypesOpen}
        titleText='Godkjente filtyper'
      />
    </Box>
  );
};

export default PictureUpload;
