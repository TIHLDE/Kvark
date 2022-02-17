import { CloseRounded, FileUploadRounded, GridViewRounded, ListRounded } from '@mui/icons-material';
import { Box, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles()((theme) => ({
  fileUploader: {
    display: 'block',
  },
  uploadBox: {
    padding: theme.spacing(2),
    borderRadius: `${theme.shape.borderRadius}px`,
    border: '2px solid white',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      opacity: [0.9, 0.8, 0.7],
    },
  },
}));

type FileUploaderProps = {
  fileTypes: ('application/pdf' | 'image/jpeg' | 'image/png')[];
  files: File[];
  title: string;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const FileUploader = ({ fileTypes, files, setFiles, title }: FileUploaderProps) => {
  const { classes } = useStyles();
  const [previewImages, setPreviewImages] = useState<(string | boolean)[]>([]);
  const [view, setView] = useState('list');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...Array.from(acceptedFiles)]);
    setPreviewImages((prev) => [
      ...prev,
      ...Array.from(acceptedFiles).map((newFile) => (newFile.type === 'image/jpeg' || newFile.type === 'image/png' ? URL.createObjectURL(newFile) : false)),
    ]);
  }, []);

  const { getRootProps } = useDropzone({
    onDrop,
    accept: fileTypes.join(','),
  });
  const deleteFile = (index: number) => {
    setFiles(files.filter((item, i) => i !== index));
    setPreviewImages(previewImages.filter((item, i) => i !== index));
  };
  useEffect(() => {
    return previewImages.forEach((imageUrl) => typeof imageUrl === 'string' && URL.revokeObjectURL(imageUrl));
  }, []);

  return (
    <>
      <Box sx={{ my: 2 }}>
        {files.length > 0 && (
          <Typography textAlign='center'>
            Lastet opp: <b>{files.length}</b>
          </Typography>
        )}
      </Box>
      <Box className={classes.uploadBox} {...getRootProps()}>
        <Stack alignItems='center' direction={{ xs: 'column', md: 'row' }} spacing={1}>
          <FileUploadRounded fontSize='large' />
          <Typography color='GrayText' textAlign='center'>
            {title}
          </Typography>
        </Stack>
      </Box>

      <Stack direction='row' justifyContent='end' sx={{ mr: 2 }}>
        <IconButton onClick={() => setView('list')}>
          <ListRounded />
        </IconButton>
        <IconButton onClick={() => setView('grid')}>
          <GridViewRounded />
        </IconButton>
      </Stack>
      <Box sx={{ mb: 2, maxHeight: 250, overflowY: 'scroll' }}>
        {view === 'list' && (
          <List>
            {files.map((file, i) => (
              <ListItem dense={true} divider={true} key={i}>
                <ListItemIcon>
                  <IconButton onClick={() => deleteFile(i)}>
                    <CloseRounded />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        )}
        {view === 'grid' && (
          <Grid columns={{ xs: 4, sm: 8, md: 12 }} container spacing={{ xs: 2, md: 3 }}>
            {files.map((file, i) => (
              <Grid item key={i} md={4} sm={4} xs={2}>
                <Paper
                  elevation={2}
                  sx={{
                    height: '100px',
                    background: previewImages[i] ? `url(${previewImages[i]})` : 'white',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}>
                  <IconButton
                    onClick={() => deleteFile(i)}
                    size='small'
                    sx={{
                      background: 'rgba(0,0,0,0.2)',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.5)',
                      },
                    }}>
                    <CloseRounded />
                  </IconButton>

                  {!previewImages[i] && (
                    <Box sx={{ px: 2 }}>
                      <Typography color='black' fontWeight='bold' noWrap={true} textAlign='center'>
                        {file.name}
                      </Typography>
                      <Typography color='black' textAlign='center'>
                        {file.type.split('/')[1]}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default FileUploader;
