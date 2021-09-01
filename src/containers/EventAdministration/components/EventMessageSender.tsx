import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNotifyEventRegistrations } from 'api/hooks/Event';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/SendRounded';

// Project components
import Dialog from 'components/layout/Dialog';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';

export type EventMessageSenderProps = {
  eventId: number;
};

type FormValues = {
  title: string;
  message: string;
};

const EventMessageSender = ({ eventId }: EventMessageSenderProps) => {
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
      <Button endIcon={<SendIcon />} fullWidth onClick={() => setDialogOpen(true)} variant='outlined'>
        Send melding til deltagere
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
