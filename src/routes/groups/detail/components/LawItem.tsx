import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '~/components/inputs/Input';
import FormTextarea from '~/components/inputs/Textarea';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import type { Group, GroupLaw } from '~/types';
import { formatLawHeader } from '~/utils';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// TODO: Re-add law mutations — previously used useDeleteGroupLaw and useUpdateGroupLaw from ~/hooks/Group.
// The new query layer (~/api/queries/groups) does not yet have group law endpoints.

export type LawItemProps = {
  groupSlug: Group['slug'];
  law: GroupLaw;
  isAdmin?: boolean;
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

const LawItem = ({ law, groupSlug: _groupSlug, isAdmin = false }: LawItemProps) => {
  const [editOpen, setEditOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: law.amount.toString(),
      description: law.description || '',
      paragraph: law.paragraph.toString(),
      title: law.title,
    },
  });

  const handleDeleteLaw = () => {
    // TODO: Implement when law delete mutation is available
    toast.error('Sletting av lovparagraf er ikke implementert enda');
    setEditOpen(false);
  };

  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // TODO: Implement when law update mutation is available
    toast.error('Oppdatering av lovparagraf er ikke implementert enda');
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
            <i>Boter: {law.amount}</i>
          </h1>
        )}
      </div>

      {isAdmin && (
        <ResponsiveDialog
          description='Endre en lovparagraf for gruppen'
          onOpenChange={setEditOpen}
          open={editOpen}
          title='Endre lovparagraf'
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
                  Oppdater
                </Button>

                <ResponsiveAlertDialog
                  action={handleDeleteLaw}
                  description='Er du sikker pa at du vil slette denne lovparagrafen?'
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
