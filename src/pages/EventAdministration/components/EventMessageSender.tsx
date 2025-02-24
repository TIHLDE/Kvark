import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { Textarea } from '~/components/ui/textarea';
import { useNotifyEventRegistrations } from '~/hooks/Event';
import useMediaQuery, { SMALL_SCREEN } from '~/hooks/MediaQuery';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type EventMessageSenderProps = {
  eventId: number;
};

const formSchema = z.object({
  title: z.string().min(1, { message: 'Oppgi en tittel' }),
  message: z.string().min(1, { message: 'Oppgi en melding' }),
});

const EventMessageSender = ({ eventId }: EventMessageSenderProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const notify = useNotifyEventRegistrations(eventId);
  const isTablet = useMediaQuery(SMALL_SCREEN);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (notify.isLoading) {
      return;
    }
    notify.mutate(
      { title: values.title, message: values.message },
      {
        onSuccess: (values) => {
          toast.success(values.detail);
          form.reset();
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(error.detail);
        },
      },
    );
  };

  const SmallOpenButton = (
    <Button size='icon' variant='secondary'>
      <Mail className='w-5 h-5 stroke-[1.5px]' />
    </Button>
  );

  const OpenButton = (
    <Button variant='secondary'>
      <Mail className='mr-2 w-5 h-5 stroke-[1.5px]' />
      Send epost
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
          <FormField
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tittel <span className='text-red-300'>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Skriv her...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Melding <span className='text-red-300'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder='Skriv her...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='w-full' disabled={notify.isLoading} type='submit'>
            {notify.isLoading ? 'Sender melding...' : 'Send melding'}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};

export default EventMessageSender;
