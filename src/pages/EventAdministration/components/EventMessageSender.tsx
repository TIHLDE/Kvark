import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button } from '~/components/ui/button';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { useNotifyEventRegistrations } from '~/hooks/Event';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export type EventMessageSenderProps = {
  eventId: number;
};

const formSchema = z.object({
  title: z.string().min(1, { message: 'Oppgi en tittel' }),
  message: z.string().min(1, { message: 'Oppgi en melding' }),
});

type FormValues = z.infer<typeof formSchema>;

const EventMessageSender = ({ eventId }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const notify = useNotifyEventRegistrations(eventId);

  const form = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        await notify.mutateAsync(
          { title: value.title, message: value.message },
          {
            onSuccess: (values) => {
              toast.success(values.detail);
            },
            onError: (error) => {
              toast.error(error.detail);
            },
          },
        );
        setDialogOpen(false);
      },
    },
    defaultValues: {
      title: '',
      message: '',
    } as FormValues,
  });

  return (
    <ResponsiveDialog
      className='max-w-2xl w-full'
      description='Send en melding på epost og et varsel til de påmeldte deltagerne.'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Send melding til påmeldte'
      trigger={
        <Button variant='secondary'>
          <Mail className='mr-2 w-5 h-5 stroke-[1.5px]' />
          Send epost
        </Button>
      }>
      <form className='space-y-4 px-4' onSubmit={handleFormSubmit(form)}>
        <form.AppField name='title'>{(field) => <field.InputField label='Tittel' required placeholder='Skriv her...' />}</form.AppField>

        <form.AppField name='message'>{(field) => <field.TextareaField label='Melding' required placeholder='Skriv her...' />}</form.AppField>

        <form.AppForm>
          <form.SubmitButton className='w-full' disabled={notify.isPending} type='submit'>
            {notify.isPending ? 'Sender melding...' : 'Send melding'}
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  );
};

export default EventMessageSender;
