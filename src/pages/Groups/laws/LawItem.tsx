import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useDeleteGroupLaw, useUpdateGroupLaw } from '~/hooks/Group';
import type { Group, GroupLaw } from '~/types';
import { formatLawHeader, parseLawParagraphNumber } from '~/utils';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export type LawItemProps = {
  groupSlug: Group['slug'];
  law: GroupLaw;
  isAdmin?: boolean;
};

const formSchema = z.object({
  amount: z.string(),
  description: z.string().optional(),
  paragraph: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Paragraf må være et tall med opptil to desimaler' }),
  title: z.string().min(1, { message: 'Tittel er påkrevd' }),
});

const LawItem = ({ law, groupSlug, isAdmin = false }: LawItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const deleteLaw = useDeleteGroupLaw(groupSlug, law.id);
  const updateLaw = useUpdateGroupLaw(groupSlug, law.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: law.amount.toString(),
      description: law.description || '',
      paragraph: law.paragraph.toString(),
      title: law.title,
    },
  });

  const handleDeleteLaw = () =>
    deleteLaw.mutate(null, {
      onSuccess: () => {
        toast.success('Lovparagrafen ble slettet');
        setEditOpen(false);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      amount: Number.parseInt(values.amount),
      description: values.description || '',
      paragraph: parseLawParagraphNumber(values.paragraph),
      title: values.title,
    };
    updateLaw.mutate(data, {
      onSuccess: () => {
        toast.success('Lovparagrafen ble oppdatert');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const OpenButton = (
    <Button size='icon' variant='ghost'>
      <Pencil className='w-5 h-5' />
    </Button>
  );

  return (
    <div className='w-full flex justify-between items-center'>
      <div>
        <h1 className={`${law.paragraph % 1 === 0 ? 'text-xl font-bold' : ''}`}>{formatLawHeader(law)}</h1>

        {Boolean(law.description) && (
          <h1 className='break-words text-sm text-muted-foreground'>
            {law.description}
            <br />
            <i>Bøter: {law.amount}</i>
          </h1>
        )}
      </div>

      {isAdmin && (
        <ResponsiveDialog
          description='Endre en lovparagraf for gruppen'
          onOpenChange={setEditOpen}
          open={editOpen}
          title='Endre lovparagraf'
          trigger={OpenButton}
        >
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

                <Button className='w-full' disabled={updateLaw.isLoading} type='submit'>
                  {updateLaw.isLoading ? 'Oppdaterer...' : 'Oppdater'}
                </Button>

                <ResponsiveAlertDialog
                  action={handleDeleteLaw}
                  description='Er du sikker på at du vil slette denne lovparagrafen?'
                  title='Slett lovparagrafen?'
                  trigger={
                    <Button className='w-full' variant='destructive'>
                      Slett lovparagraf
                    </Button>
                  }
                />
              </form>
            </Form>
          </ScrollArea>
        </ResponsiveDialog>
      )}
    </div>
  );
};

export default LawItem;
