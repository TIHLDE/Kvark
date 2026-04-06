import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import type { Group } from '~/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add create law mutation — previously used useCreateGroupLaw from ~/hooks/Group.
// The new query layer (~/api/queries/groups) does not yet have a create group law endpoint.

export type AddLawDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  amount: z.string(),
  description: z.string().optional(),
  paragraph: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    error: 'Paragraf ma vaere et tall med opptil to desimaler',
  }),
  title: z.string().min(1, {
    error: 'Tittel er pakrevd',
  }),
});

const AddLawDialog = ({ groupSlug: _groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '1',
      description: '',
      paragraph: '1',
      title: '',
    },
  });

  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // TODO: Implement when create law mutation is available
    toast.error('Oppretting av lovparagraf er ikke implementert enda');
    setDialogOpen(false);
  };

  const OpenButton = (
    <Button className='w-full'>
      <Plus className='w-5 h-5 mr-2' />
      Ny lovparagraf
    </Button>
  );

  return (
    <ResponsiveDialog
      description='Opprett en ny lovparagraf for gruppen'
      onOpenChange={setDialogOpen}
      open={dialogOpen}
      title='Ny lovparagraf'
      trigger={OpenButton}>
      <ScrollArea className='h-[60vh]'>
        <Form {...form}>
          <form className='space-y-6 pb-6 px-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput
              description='Heltall for overskrift. Maks 2 siffer pa hver side av komma'
              form={form}
              label='Paragraf'
              name='paragraph'
              required
              type='number'
            />

            <FormInput description='For eks.: Forsentkomming' form={form} label='Tittel' name='title' required />

            <FormTextarea description='La sta tom for a ikke kunne velges ved botgivning' form={form} label='Beskrivelse' name='description' />

            <FormInput
              description='Brukes for a forhandsutfylle antall boter nar det lages en ny'
              form={form}
              label='Veiledende antall boter'
              name='amount'
              required
              type='number'
            />

            <Button className='w-full' type='submit'>
              Opprett
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default AddLawDialog;
