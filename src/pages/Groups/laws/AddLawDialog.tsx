import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useCreateGroupLaw } from '~/hooks/Group';
import type { Group } from '~/types';
import { parseLawParagraphNumber } from '~/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type AddLawDialogProps = {
  groupSlug: Group['slug'];
};

const formSchema = z.object({
  amount: z.string(),
  description: z.string().optional(),
  paragraph: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Paragraf må være et tall med opptil to desimaler' }),
  title: z.string().min(1, { message: 'Tittel er påkrevd' }),
});

const AddLawDialog = ({ groupSlug }: AddLawDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const createLaw = useCreateGroupLaw(groupSlug);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '1',
      description: '',
      paragraph: '1',
      title: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      amount: parseInt(values.amount),
      description: values.description || '',
      paragraph: parseLawParagraphNumber(values.paragraph),
      title: values.title,
    };
    createLaw.mutate(data, {
      onSuccess: () => {
        toast.success('Lovparagrafen ble opprettet');
        setDialogOpen(false);
        form.reset();
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
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
              description='Heltall for overskrift. Maks 2 siffer på hver side av komma'
              form={form}
              label='Paragraf'
              name='paragraph'
              required
              type='number'
            />

            <FormInput description='For eks.: Forsentkomming' form={form} label='Tittel' name='title' required />

            <FormTextarea description='La stå tom for å ikke kunne velges ved botgivning' form={form} label='Beskrivelse' name='description' />

            <FormInput
              description='Brukes for å forhåndsutfylle antall bøter når det lages en ny'
              form={form}
              label='Veiledende antall bøter'
              name='amount'
              required
              type='number'
            />

            <Button className='w-full' disabled={createLaw.isLoading} type='submit'>
              {createLaw.isLoading ? 'Oppretter...' : 'Opprett'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </ResponsiveDialog>
  );
};

export default AddLawDialog;
