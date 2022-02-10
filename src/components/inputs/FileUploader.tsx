import { CloseRounded, FileUploadRounded } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { FileUploader as RDDFileUploader } from 'react-drag-drop-files';

const useStyles = makeStyles()((theme) => ({
  fileUploader: {
    display: 'block',
  },
  uploadBox: {
    padding: theme.spacing(2),
    borderRadius: `${theme.shape.borderRadius}px`,
    border: '2px dashed white',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      opacity: [0.9, 0.8, 0.7],
    },
  },
}));

type FileUploaderProps = {
  fileTypes: ('PDF' | 'DOCX' | 'PNG' | 'JPEG')[];
  files: File[];
  title: string;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const FileUploader = ({ fileTypes, files, setFiles, title }: FileUploaderProps) => {
  const { classes } = useStyles();
  const handleFileUpload = (newFiles: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const deleteFile = (index: number) => {
    setFiles(files.filter((item, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ my: 2 }}>
        {files.length > 0 && (
          <Typography textAlign='center'>
            Lastet opp: <b>{files.length}</b>
          </Typography>
        )}
      </Box>
      <RDDFileUploader classes={classes.fileUploader} handleChange={handleFileUpload} hoverTitle='Dra hit' multiple={true} name='file' types={fileTypes}>
        <Box className={classes.uploadBox}>
          <Stack alignItems='center' direction={{ xs: 'column', md: 'row' }} spacing={1}>
            <FileUploadRounded fontSize='large' />
            <Typography color='GrayText' textAlign='center'>
              {title} (støtter {fileTypes.join(',')})
            </Typography>
          </Stack>
        </Box>
      </RDDFileUploader>
      <List sx={{ my: 2, maxHeight: 300, overflowY: 'scroll' }}>
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
    </Box>
  );
};

export default FileUploader;
