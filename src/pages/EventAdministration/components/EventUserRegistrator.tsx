import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonProps } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateEventRegistrationAdmin } from 'hooks/Event';
import { useSnackbar } from 'hooks/Snackbar';

import UserSearch from 'components/inputs/UserSearch';
import Dialog from 'components/layout/Dialog';

import { UserBase } from '../../../types';

export type EventMessageSenderProps = ButtonProps & {
  eventId: number;
};

type FormValues = {
  user: UserBase;
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
        contentText='Legg til ønsket person som deltager på arrangementet.'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleSubmit(submit)}
        open={dialogOpen}
        titleText='Legg til deltager'>
        <UserSearch control={control} formState={formState} label={'Person'} multiple={false} name='user' />
      </Dialog>
    </>
  );
};

export default EventUserRegistrator;
