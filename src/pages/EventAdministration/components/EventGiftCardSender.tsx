import { CloseRounded, PictureAsPdfRounded } from '@mui/icons-material/';
import { Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import { useSendGiftCardsToAttendees } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

// Project components
import Dialog from 'components/layout/Dialog';

export type EventFileSenderProps = {
  eventId: number;
};

const FILE_TYPES = ['PDF', 'DOCX'];

const EventGiftCardSender = ({ eventId }: EventFileSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (newFiles: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const deleteFile = (index: number) => {
    setFiles(files.filter((item, i) => i !== index));
  };

  const sendEmail = useSendGiftCardsToAttendees(eventId);

  const submit = () => {
    if (sendEmail.isLoading || !files) {
      return;
    }
    sendEmail.mutate(
      { files },
      {
        onSuccess: (data) => {
          showSnackbar(data.detail, 'success');
          setDialogOpen(false);
        },
        onError: (error) => showSnackbar(error.detail, 'error'),
      },
    );
  };

  return (
    <>
      <Button endIcon={<PictureAsPdfRounded />} fullWidth onClick={() => setDialogOpen(true)} variant='outlined'>
        Send gavekort til deltagere
      </Button>
      <Dialog
        contentText='Send et gavekort på epost til alle deltagere som er merket som ankommet.'
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        titleText='Send gavekort til deltagere'>
        <Box sx={{ my: 2 }}>
          {files.length > 0 && (
            <Typography textAlign='center'>
              Lastet opp: <b>{files.length}</b>
            </Typography>
          )}
          <FileUploader handleChange={handleFileUpload} multiple={true} types={FILE_TYPES}>
            <Box
              sx={{
                p: 2,
                borderRadius: '20px',
                border: '2px dashed white',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}>
              <Stack alignItems='center' direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <PictureAsPdfRounded fontSize='large' />
                <Typography color='GrayText' textAlign='center'>
                  Last opp eller dra gavekort hit.
                </Typography>
              </Stack>
            </Box>
          </FileUploader>
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
          Send Gavekort
        </Button>
      </Dialog>
    </>
  );
};

export default EventGiftCardSender;
