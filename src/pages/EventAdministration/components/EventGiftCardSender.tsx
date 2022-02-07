import { ArticleRounded, AttachFileRounded, CloseRounded, PictureAsPdfRounded } from '@mui/icons-material/';
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

const FILE_TYPES = ['JPG', 'PNG', 'GIF', 'PDF', 'DOCX'];

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
          <FileUploader handleChange={handleFileUpload} label='Last opp eller dra filer hit' multiple={true} name='Filer' types={FILE_TYPES}>
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
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='center' spacing={1}>
                <PictureAsPdfRounded fontSize='large' />
                <ArticleRounded fontSize='large' />
                <Typography>Last opp filer</Typography>
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
          Send filer
        </Button>
      </Dialog>
    </>
  );
};

export default EventGiftCardSender;
