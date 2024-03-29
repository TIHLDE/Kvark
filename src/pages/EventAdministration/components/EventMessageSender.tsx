import SendIcon from '@mui/icons-material/SendRounded';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useNotifyEventRegistrations } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import Dialog from 'components/layout/Dialog';

export type EventMessageSenderProps = ButtonProps & {
  eventId: number;
};

type FormValues = {
  title: string;
  message: string;
};

const EventMessageSender = ({ eventId, ...props }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const { register, formState, handleSubmit, reset } = useForm<FormValues>();
  const notify = useNotifyEventRegistrations(eventId);

  const submit = (data: FormValues) => {
    if (notify.isLoading) {
      return;
    }
    notify.mutate(
      { title: data.title, message: data.message },
      {
        onSuccess: (data) => {
          showSnackbar(data.detail, 'success');
          reset();
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
      <Button endIcon={<SendIcon />} fullWidth variant='outlined' {...props} onClick={() => setDialogOpen(true)}>
        Send epost til deltagere
      </Button>
      <Dialog
        contentText='Send en melding på epost og et varsel til de påmeldte deltagerne.'
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        titleText='Send melding til påmeldte'>
        <form onSubmit={handleSubmit(submit)}>
          <TextField formState={formState} label='Tittel' {...register('title', { required: 'Oppgi en tittel' })} required />
          <TextField
            formState={formState}
            label='Melding'
            maxRows={10}
            minRows={3}
            multiline
            {...register('message', { required: 'Oppgi en melding' })}
            required
          />
          <SubmitButton disabled={notify.isLoading} formState={formState}>
            Send melding
          </SubmitButton>
        </form>
      </Dialog>
    </>
  );
};

export default EventMessageSender;
