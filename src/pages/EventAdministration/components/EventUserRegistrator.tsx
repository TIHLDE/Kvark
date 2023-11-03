import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateEventRegistrationAdmin } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

import UserSearch from 'components/inputs/UserSearch';
import Dialog from 'components/layout/Dialog';

import { User } from '../../../types';

export type EventMessageSenderProps = ButtonProps & {
  eventId: number;
};

type FormValues = {
  user: User;
};

const EventUserRegistrator = ({ eventId, ...props }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const showSnackbar = useSnackbar();
  const { formState, handleSubmit, reset, control } = useForm<FormValues>();
  const { mutateAsync } = useCreateEventRegistrationAdmin(eventId);
  const submit = async (data: FormValues) => {
    try {
      await mutateAsync(data.user.user_id);

      showSnackbar('Deltager lagt til', 'success');
      reset();
      setDialogOpen(false);
    } catch (e) {
      showSnackbar(e.detail, 'error');
    }
  };

  return (
    <>
      <Button endIcon={<AddIcon />} fullWidth variant='outlined' {...props} onClick={() => setDialogOpen(true)}>
        Legg til deltager
      </Button>
      <Dialog
        confirmText='Legg til'
        contentText='Send en melding på epost og et varsel til de påmeldte deltagerne.'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleSubmit(submit)}
        open={dialogOpen}
        titleText='Send melding til påmeldte'>
        <UserSearch control={control} formState={formState} label={'Person'} name='user' />
      </Dialog>
    </>
  );
};

export default EventUserRegistrator;
