import { useState } from 'react';
import { useSendFilesToAttendees } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';
import { FileUploader } from 'react-drag-drop-files';

// Material-UI
import { Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { AttachFileRounded, CloseRounded } from '@mui/icons-material/';

// Project components
import Dialog from 'components/layout/Dialog';

export type EventFileSenderProps = {
  eventId: number;
};

const EventFileSender = ({ eventId }: EventFileSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const [files, setFiles] = useState<File[]>([]);
  const fileTypes = ['JPG', 'PNG', 'GIF', 'PDF', 'DOCX'];

  const handleFileUpload = (newFiles: FileList) => {
    setFiles([...Array.from(newFiles).filter((newFile) => files.every((file) => file.name !== newFile.name)), ...files]);
  };

  const deleteFile = (id: number) => {
    setFiles(files.filter((item, i) => i !== id));
  };

  const sendEmail = useSendFilesToAttendees(eventId);

  const submit = () => {
    if (sendEmail.isLoading || !files) {
      return;
    }
    sendEmail.mutate(
      { files },
      {
        onSuccess: (data) => {
          showSnackbar(data.detail, 'success');
          //reset();
          setDialogOpen(false);
        },
        onError: (error) => {
          showSnackbar(error.detail, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button endIcon={<AttachFileRounded />} fullWidth onClick={() => setDialogOpen(true)} variant='outlined'>
        Send filer til deltagere
      </Button>
      <Dialog
        contentText='Send en fil på epost til alle deltagere som er merket som ankommet.'
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        titleText='Send filer til deltagere'>
        <Box sx={{ my: 2 }}>
          {files.length > 0 && (
            <Typography textAlign='center'>
              Du har lastet opp <b>{files.length}</b> filer
            </Typography>
          )}
          <FileUploader handleChange={handleFileUpload} label='Last opp eller dra filer hit' multiple={true} name='Filer' types={fileTypes} />
        </Box>
        <List sx={{ mb: 2, maxHeight: 300, overflowY: 'scroll' }}>
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
        <Button disabled={files.length < 1 || sendEmail.isLoading} fullWidth onClick={submit} variant='contained'>
          Send filer
        </Button>
      </Dialog>
    </>
  );
};

export default EventFileSender;
