import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateEventRegistrationAdmin } from 'hooks/Event';
import useMediaQuery, { SMALL_SCREEN } from 'hooks/MediaQuery';

import { SingleUserSearch } from 'components/inputs/UserSearch';
import { Button } from 'components/ui/button';
import { Form } from 'components/ui/form';
import ResponsiveDialog from 'components/ui/responsive-dialog';

export type EventMessageSenderProps = {
  eventId: number;
};

const formSchema = z.object({
  user: z.object({
    user_id: z.string(),
  }),
});

const EventUserRegistrator = ({ eventId }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const addUser = useCreateEventRegistrationAdmin(eventId);
  const isTablet = useMediaQuery(SMALL_SCREEN);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        user_id: '',
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addUser.mutate(values.user.user_id, {
      onSuccess: () => {
        toast.success('Deltager lagt til');
        form.reset();
        setDialogOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const SmallOpenButton = (
    <Button size='icon' variant='secondary'>
      <Plus className='w-5 h-5 stroke-[1.5px]' />
    </Button>
  );

  const OpenButton = (
    <Button variant='secondary'>
      <Plus className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Legg til
    </Button>
  );

  return (
    <ResponsiveDialog
      className='max-w-2xl w-full'
      description='Send en melding på epost og et varsel til de påmeldte deltagerne.'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Send melding til påmeldte'
      trigger={!isTablet ? SmallOpenButton : OpenButton}>
      <Form {...form}>
        <form className='space-y-4 px-4' onSubmit={form.handleSubmit(onSubmit)}>
          <SingleUserSearch form={form} label='Bruker' name='user' required />

          <Button className='w-full' type='submit'>
            Legg til deltager
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default EventUserRegistrator;
