import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useCreateEventRegistrationAdmin } from '~/hooks/Event';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type EventMessageSenderProps = {
  eventId: number;
};

const EventUserRegistrator = ({ eventId }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const addUser = useCreateEventRegistrationAdmin(eventId);

  const form = useAppForm({
    defaultValues: { user: '' },
    onSubmit({ value }) {
      addUser.mutate(value.user, {
        onSuccess: () => {
          toast.success('Deltager lagt til');
          setDialogOpen(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      });
    },
  });

  return (
    <ResponsiveDialog
      className='max-w-2xl w-full'
      description='Legg til deltager til arrangementet'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Legg til deltager'
      trigger={
        <Button variant='secondary'>
          <Plus className='mr-2 w-5 h-5 stroke-[1.5px]' />
          Legg til
        </Button>
      }>
      <form className='space-y-4 px-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField
          validators={{
            onBlur({ value }) {
              if (!value || value === '') return 'Velg en bruker';
              return undefined;
            },
          }}
          name='user'>
          {(field) => <field.UserField label='Bruker' required multiple={false} />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton className='w-full' type='submit'>
            Legg til deltager
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default EventUserRegistrator;
